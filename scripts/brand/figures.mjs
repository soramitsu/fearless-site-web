import {num,seq,group,at,path,pen,circ,arc,polar} from './art.mjs'

function comet(radius,turn,color){return seq(9,index=>pen(arc(radius,-turn*(9-index)/9,-turn*(8-index)/9),color,1.9,`opacity="${num((index+1)/9)}"`))}
const centerBox=(radius,body)=>circ(0,0,radius,'none')+body
export function dial(ctx,x,y,counts,step=360,solidLabels=false){
  const {sh,gold,gate,pulse,label,spin}=ctx, radius=8, dial=sh.dial, finish=counts.length*step
  const draw=(fraction,color)=>pen(seq(dial.segments,index=>{const start=index/dial.segments+dial.gapTurn/2,end=Math.min(fraction,(index+1)/dial.segments-dial.gapTurn/2);return start<end?arc(radius,start,end):''}),color,1.6)
  const display=(key,body,start,end,base=false)=>ctx.anim(key,body,[[0,`opacity:${+!start}`],...(start?[[start,'opacity:1']]:[]),[end,'opacity:0'],...(end<10000?[[10000,`opacity:${+!start}`]]:[])],10000,'steps(1,end)',`opacity="${+base}"`)
  const state=solidLabels?display:gate
  const states=counts.map((count,index)=>state(`answer-${count}`,draw(count/14,sh.colors.core)+label(`${count} / 14`,16,4,12,600,sh.colors.flight,'left',true),index*step,(index+1)*step)).join('')
  return at(x,y,group(draw(1,gold),'opacity=".2"')+states+gate('working',spin('comet',centerBox(radius,comet(radius,dial.cometTurn,sh.colors.flight)),dial.cometSeconds),0,finish)+state('settled',draw(1,gold)+circ(0,0,radius*.36,gold)+label('Live',16,4,12,700,gold),finish,10000,true)+pulse('completion',0,0,radius,finish))
}
export function loader(ctx,x,y,until){
  const {sh,gate,anim}=ctx,r=10.5, mirror=sh.mirror
  const rim=mirror.rim.map(({cx,cy,r:rr,from,to},index)=>{const pos=a=>`${num(r*(cx+rr*Math.cos(a)))} ${num(r*(cy+rr*Math.sin(a)))}`;return `${index?'L':'M'}${pos(from)}A${num(r*rr)} ${num(r*rr)} 0 0 1 ${pos(to)}`}).join('')+'Z'
  const loop=sh.loader.secondsPerTurn*1000,tail=sh.loader.tailTurn*100
  const trails=seq(sh.loader.comets,head=>seq(5,part=>{const offset=head*100/sh.loader.comets+part*tail/5
    return anim(`trail-${head}-${part}`,pen(rim,sh.colors.flight,1.65,`pathLength="100" stroke-dasharray="${num(tail/5)} ${num(100-tail/5)}" opacity="${num(1-part/5)}"`),[[0,`stroke-dashoffset:${num(offset)}`],[loop,`stroke-dashoffset:${num(offset-100)}`]],loop)}))
  return at(x,y,gate('loading',group(pen(rim,ctx.gold,1.6)+circ(0,0,r*mirror.cusp*.94/sh.ratio.yamato,'none',`stroke="${ctx.gold}"`),`opacity="${sh.loader.restAlpha}"`)+trails,0,until))
}
export function ticks(ctx,key,radius){
  const {solar}=ctx, {count,r,size,turnsPerSecond}=solar.ticks
  const data=seq(count,index=>`M${polar(radius*r,index/count)}L${polar(radius*(r-size*(index%11===0?6:3)),index/count)}`)
  const geometry=`ticks-${radius}`;ctx.define(geometry,ident=>group(centerBox(radius,pen(data,ctx.gold,1)+solar.strokes.filter(item=>item.group==='ring').map(item=>circ(0,0,radius*item.r,'none',`stroke="${ctx.gold}" stroke-width=".7"`)).join('')),`id="${ident}"`));return ctx.spin(key,ctx.use(geometry),1/Math.abs(turnsPerSecond),turnsPerSecond<0)
}
export function seal(ctx,x,y,radius,broken=false){
  const {solar,sh,anim,gate}=ctx, config=sh.seal, base=2500
  const starts=config.stages.map((_,index)=>base+index*1020), ignite=starts[3]+config.stageMs
  const window=progress=>ignite+Math.max(0,(progress-config.progress.accepted)/(1-config.progress.accepted))*config.igniteMs
  const ink=broken?sh.colors.failure:sh.colors.core
  const pieces=solar.strokes.map((stroke,index)=>{
    if(broken&&index>4)return ''
    const stage=config.stages.findIndex(name=>config.strokes[name].some(([group,rank])=>stroke.group===group&&solar.strokes.filter(item=>item.group===group)[rank]===stroke))
    const radiusPx=num(radius*(stroke.r||1)),px=key=>num((stroke[key]||0)*radius)
    const data=stroke.type==='line'?`M${px('x1')} ${px('y1')}L${px('x2')} ${px('y2')}`:`M${px('cx')} ${num((stroke.cy-stroke.r)*radius)}a${radiusPx} ${radiusPx} 0 1 1 0 ${num(2*radius*stroke.r)}a${radiusPx} ${radiusPx} 0 1 1 0 -${num(2*radius*stroke.r)}`
    const width=Math.max(.55,radius*solar.stroke.core*stroke.weight), style='pathLength="100"'
    const layers=pen(data,broken?ink:sh.colors.glow,Math.max(width*3,radius*solar.stroke.glow),`${style} opacity=".22"`)+pen(data,ink,width,style)
    if(broken)return gate(`pending-${index}`,pen(data,sh.colors.flight,width),1800,2300)+anim(`break-${index}`,layers,[[0,'opacity:0;transform:translateY(0)'],[2210,'opacity:0;transform:translateY(0)'],[2300,'opacity:1;transform:translateY(0)'],[2900,'opacity:1;transform:translateY(0)'],[2900+config.breakMs,`opacity:0;transform:translateY(${num(radius*.2*(index+1)/5)}px)`],[10000,'opacity:0']],10000,'depart','opacity="0"')
    const start=stage<0?window(stroke.reveal[0]):starts[stage],end=stage<0?Math.max(start+1,window(stroke.reveal[1])):start+config.stageMs
    const draw=anim('stroke-'+index,layers,[[0,'stroke-dasharray:100 102;stroke-dashoffset:101'],[start,'stroke-dashoffset:101'],[end,'stroke-dashoffset:0'],[10000,'stroke-dasharray:100 102;stroke-dashoffset:0']],10000,'settle')
    if(stage<1)return draw
    const loop=config.cometSeconds*1000,waiting=gate(`wait-${index}`,pen(data,sh.colors.flight,.8,'opacity=".3" stroke-dasharray="2 4"')+anim(`courier-${index}`,pen(data,sh.colors.flight,1.4,`${style} stroke-dasharray="10 102"`),[[0,'stroke-dashoffset:10'],[loop,'stroke-dashoffset:-100']],loop),starts[stage-1]+config.stageMs,start)
    return draw+waiting
  }).join('')
  if(broken)return at(x,y,pieces)
  const stars=solar.stars.map((star,index)=>{const phase=config.stages.findIndex(stage=>config.stars[stage]===index),start=phase<0?window(star.reveal):starts[phase]+config.stageMs,sz=num(radius*star.size*.32),tip=num(+sz*.21)
    return at(star.x*radius,star.y*radius,anim(`star-${index}`,path(`M0 -${sz} ${tip} -${tip} ${sz} 0 ${tip} ${tip} 0 ${sz} -${tip} ${tip} -${sz} 0 -${tip} -${tip}Z`,sh.colors.star),[[0,'opacity:0'],[start,'opacity:0'],[start+90,'opacity:1'],[10000,'opacity:1']]))}).join('')
  return at(x,y,anim('rest',pieces+stars,[[0,'opacity:0'],[base,'opacity:1'],[ignite+config.igniteMs,'opacity:1'],[ignite+config.igniteMs+510,`opacity:${config.restStrength}`],[9745,`opacity:${config.restStrength}`],[10000,'opacity:0']],10000,'glide',`opacity="${config.restStrength}"`))
}
