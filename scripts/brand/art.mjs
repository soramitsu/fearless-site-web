export const num = value => String(Number(value.toFixed(2)))
export const seq = (count, draw) => Array.from({ length: count }, (_, index) => draw(index)).join('')
export const group = (body, attrs = '') => `<g ${attrs}>${body}</g>`
export const at = (x, y, body) => group(body, `transform="translate(${num(x)} ${num(y)})"`)
export const path = (data, fill = 'none', extra = '') => `<path d="${data}" fill="${fill}" ${extra}/>`
export const pen = (data, color, width = 1.7, extra = '') => path(data, 'none', `stroke="${color}" stroke-width="${num(width)}" stroke-linecap="round" stroke-linejoin="round" ${extra}`)
export const rect = (x,y,w,h,r,fill,extra='') => `<rect x="${num(x)}" y="${num(y)}" width="${num(w)}" height="${num(h)}" rx="${num(r)}" fill="${fill}" ${extra}/>`
export const circ = (x,y,r,fill,extra='') => `<circle cx="${num(x)}" cy="${num(y)}" r="${num(r)}" fill="${fill}" ${extra}/>`
export const polar = (radius,turn) => [num(radius*Math.sin(turn*2*Math.PI)),num(-radius*Math.cos(turn*2*Math.PI))].join(' ')
export const arc = (radius,start,end) => `M${polar(radius,start)}A${radius} ${radius} 0 ${end-start>.5?1:0} 1 ${polar(radius,end)}`

export function canvas(name, kit) {
  const {colors,sh,solar,fonts,badges}=kit, {text,textMuted,night,line,gold}=colors
  const defs=new Map(), rules=[], id=key=>`${name}-${key}`, url=key=>`url(#${id(key)})`
  const define=(key,make)=>{if(!defs.has(key)) defs.set(key,make(id(key))); return url(key)}
  const use=key=>`<use xlink:href="#${id(key)}"/>`
  const gradient=(key,stops,radial=false,coords='')=>define(key,ident=>{const type=radial?'radialGradient':'linearGradient';return `<${type} id="${ident}" ${coords||(!radial?'x2="1" y2="1"':'')}>${stops.map(([offset,color,alpha=1])=>`<stop offset="${offset}" stop-color="${color}" stop-opacity="${alpha}"/>`).join('')}</${type}>`})
  const glass=()=>gradient('glass',[[0,'#352047'],[.5,'#251541'],[1,night]])
  const rim=()=>gradient('rim',[[0,gold,.55],[.48,'#FF4FA3',.30],[1,line,.16]])
  const pink=()=>gradient('fill',[[0,colors.pinkActive],[1,'#A8005A']])
  const panel=(x,y,w,h,r=15,fill=glass())=>rect(x+.5,y+.5,w-1,h-1,r,fill,`stroke="${rim()}"`)+pen(`M${x+r+2} ${y+1.5}h${Math.max(2,w*.35-r)}`,text,.7,'opacity=".12"')
  const label=(str,x,y,size=14,weight=600,color=text,align='left',tabular=false)=>{
    const font=fonts[weight], chars=Array.from(str), scale=size/font.unitsPerEm
    const digit=Math.max(...Array.from('0123456789',char=>font.charToGlyph(char).advanceWidth))
    let offset=0
    const outlines=chars.map((char,index)=>{const glyph=font.charToGlyph(char);if(!glyph.index)throw Error(`Missing glyph ${char}`)
      const fixed=tabular&&/\d/.test(char), advance=fixed?digit:glyph.advanceWidth, key=`g${weight}-${glyph.index}`
      if(char!==' ')define(key,ident=>`<path id="${ident}" d="${glyph.getPath(0,0,100).toPathData(1)}"/>`)
      const place=(offset+(advance-glyph.advanceWidth)/2)*100/font.unitsPerEm
      offset+=advance+(index+1<chars.length&&!tabular?font.getKerningValue(glyph,font.charToGlyph(chars[index+1])):0)
      return char===' '?'':`<use x="${num(place)}" xlink:href="#${id(key)}"/>`})
    const left=x-offset*scale*({left:0,center:.5,right:1}[align]);return group(outlines.join(''),`fill="${color}" transform="translate(${num(left)} ${y}) scale(${num(size/100)})"`)
  }
  const badge=(x,y,size)=>{const variant=size<64?'small':'full',key=`badge-${variant}`;define(key,ident=>`<symbol id="${ident}" viewBox="0 0 512 512">${badges[variant].replace(/id="g"/g,`id="${ident}-bg"`).replace(/url\(#g\)/g,`url(#${ident}-bg)`)}</symbol>`);return `<use x="${x}" y="${y}" width="${size}" height="${size}" xlink:href="#${id(key)}"/>`}
  const anim=(key,body,frames,period=10000,ease='linear',base='')=>{
    const token=id(key),timing=sh.easing[ease]?`cubic-bezier(${sh.easing[ease]})`:ease
    rules.push(`.${token}{transform-box:fill-box;transform-origin:center;animation:${token} ${num(period)}ms ${timing} infinite}@keyframes ${token}{${frames.map(([ms,style])=>`${num(ms/period*100)}%{${style}}`).join('')}}`)
    return group(body,`class="${token}" ${base}`)
  }
  const gate=(key,body,start,end,base=false,period=10000)=>{
    const fade=sh.durationsMs[0],frames=[[0,`opacity:${start===0?1:0}`]]
    if(start)frames.push([start,'opacity:0'],[start+fade,'opacity:1'])
    frames.push([end-fade,'opacity:1'],[end,'opacity:0'])
    if(end<period){if(!start)frames.push([period-fade,'opacity:0']);frames.push([period,`opacity:${start===0?1:0}`])}
    return anim(key,body,frames,period,'linear',`opacity="${+base}"`)
  }
  const spin=(key,body,seconds,reverse=false)=>anim(key,body,[[0,'transform:rotate(0deg)'],[seconds*1000,`transform:rotate(${reverse?-360:360}deg)`]],seconds*1000)
  const pulse=(key,x,y,r,time,period=10000)=>at(x,y,anim(key,circ(0,0,r,'none',`stroke="${gold}"`),[[0,'opacity:0;transform:scale(1)'],[time,'opacity:0;transform:scale(1)'],[time+1,'opacity:.9;transform:scale(1)'],[time+sh.dial.sealMs,'opacity:0;transform:scale(2.1)'],[period,'opacity:0;transform:scale(2.1)']],period,'depart','opacity="0"'))
  const tick=(key,oldValue,newValue,x,y,size,time,{align='right',color=text,down=false,weight=700,width=65}={})=>{
    const value=str=>label(str,x,y,size,weight,color,align,true), shift=down?-6:6
    return gate(key+'-old',value(oldValue),0,time)+anim(key+'-new',value(newValue),[[0,`opacity:0;transform:translateY(${shift}px)`],[time,`opacity:0;transform:translateY(${shift}px)`],[time+sh.durationsMs[2],'opacity:1;transform:translateY(0)'],[9820,'opacity:1'],[10000,'opacity:0']],10000,'settle')+anim(key+'-line',rect(align==='right'?x-width:x,y+3,width,1,0,down?'#FF9F57':sh.colors.flight),[[0,'opacity:0;transform:scaleX(0)'],[time,'opacity:0;transform:scaleX(0)'],[time+180,'opacity:1;transform:scaleX(1)'],[time+510,'opacity:0;transform:scaleX(1)'],[10000,'opacity:0']],10000,'glide','opacity="0" style="transform-origin:left center"')
  }
  const clip=(key,shape,body)=>{define(key,ident=>`<clipPath id="${ident}">${shape}</clipPath>`);return group(body,`clip-path="${url(key)}"`)}
  const svg=(width,height,title,body)=>`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><title>${title}</title><defs>${[...defs.values()].join('')}</defs><style>${rules.join('\n')}\n@media (prefers-reduced-motion: reduce) { * { animation: none !important } }</style>${body}</svg>\n`
  return {colors,sh,solar,text,textMuted,gold,night,define,url,use,gradient,glass,rim,pink,panel,label,badge,anim,gate,spin,pulse,tick,clip,svg}
}

const icons={send:'M-8 0 8-8 3 8-1 2-8 0ZM-1 2 8-8',receive:'M0-8V3m-5-5 5 5 5-5M-8 4v4H8V4',buy:'M-7 0H7M0-7V7',swap:'M-8-3H7L3-7M8 3H-7l4 4',transfer:'M-7 4 4-7M-2-7h6v6M7 1v6H1',search:'M5 5l4 4M6 0a6 6 0 1 1-12 0 6 6 0 0 1 12 0',scan:'M-8-3v-5h5m6 0h5v5m0 6v5H3m-6 0h-5V3M-4 0h8',earn:'m-8-4 8-4 8 4-8 4ZM-8 0l8 4 8-4M-8 4l8 4 8-4',wallet:'M-8-5h14v3H-6a2 2 0 0 1 0-4l10-2M-8-4v10q0 2 2 2H8V-2H4M5 2H2v3h3',settings:'m-2-8 4 0 1 2 3 1 2 3-1 2 1 3-3 3-2-1-2 3-4-1-1-2-3-1-1-4 2-2-1-3 3-2ZM3 0a3 3 0 1 1-6 0 3 3 0 1 1 6 0',all:'M-6-5 6 4M-6 5 0-6m0 0 6 10M-7-5h2m4-2h2m4 12h2m-15 0h2',back:'M3-7l-7 7 7 7',chevron:'m-4-2 4 4 4-4',check:'m-6 0 4 4 8-9',star:'m0-7 2 4 5 1-3.5 3.5.7 4.5L0 4l-4.2 2 .7-4.5L-7-2l5-1Z',warn:'M0-8 9 7H-9ZM0-3v4m0 3v.2',clock:'M7 0a7 7 0 1 1-14 0 7 7 0 0 1 14 0M0-4v5l3 2',paste:'M-3-6h-4V8H7V-6H3M-3-8h6v4h-6Z'}
export const icon=(key,x,y,color,size=18)=>at(x,y,group(pen(icons[key],color),`transform="scale(${num(size/18)})"`))
export function coin(key,x,y,r) {
  const fill={ETH:'#39477C',SOL:'#121124',DOT:'#D50065',XOR:'#E23',BTC:'#A34D0B',TON:'#077BAC',DAI:'#98600D',USDC:'#286BB0',ALL:'#45305D'}[key]
  const glyph={ETH:path('M0-11 7 0 0 4-7 0Z','#FBF7FF')+path('M0-11 7 0 0 4Z','#ABB6ED')+path('M-7 2 0 6 7 2 0 11Z','#D6DEFF'),SOL:seq(3,index=>path(`M-7 ${-8+index*6}h15l-3 3h-15Z`,['#70F0CC','#87B8EF','#B88BFF'][index],index===1?'transform="scale(-1 1)"':'')),DOT:seq(6,index=>`<ellipse cx="0" cy="-7.5" rx="3.4" ry="2" fill="white" transform="rotate(${index*60})"/>`),XOR:pen('M-8-6H8M-8-2H8M0-5v5l-7 9M0 0l7 9','white',2.8),TON:pen('M-8-6H8L0 9ZM0-6V9','white'),BTC:pen('M-5-7h7q8 1 2 7 8 4-1 7h-8M-2-8v15M0-10v3m4-3v3M0 7v3m4-3v3M-2 0h5','white',2),DAI:pen('M-5-7v14h5a7 7 0 0 0 0-14ZM-8-2H8M-8 2H8','white'),USDC:pen('M4-4Q-4-8-4-2q0 2 4 2t4 3q-1 5-9 1M0-8v2m0 12v2M-7-7q-7 7 0 14M7-7q7 7 0 14','white'),ALL:icon('all',0,0,'white')}
  return at(x,y,group(circ(0,0,14,fill)+glyph[key],`transform="scale(${num(r/14)})"`))
}
