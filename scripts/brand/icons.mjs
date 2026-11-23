import {at,arc,circ,group,num,pen,seq} from './art.mjs'

export const iconNames=['custody','open-source','encryption','privacy','wallets','networks','users','rating','step-1','step-2','step-3']

export function animatedIcon(ctx,name){
  const {rest,core,flight}=ctx.sh.colors,step=name.startsWith('step-'),size=step?96:64
  const line=(data,color=rest,width=2.5,extra='')=>pen(data,color,width,extra)
  const ring=(radius,color=rest,width=2)=>circ(0,0,radius,'none',`stroke="${color}" stroke-width="${width}"`)
  const period=8000,move=(key,body,frames,base='')=>ctx.anim(key,body,frames,period,'settle',base)
  const gesture=(body,property,from,to)=>move('gesture',body,[[0,`${property}:${to}`],[360,`${property}:${from}`],[1080,`${property}:${to}`],[period,`${property}:${to}`]])
  const trace=(key,data,delay=0,color=core)=>move(key,line(data,color,2,'pathLength="100" stroke-dasharray="100 101"'),[[0,'stroke-dashoffset:0'],[360,'stroke-dashoffset:101'],[450+delay,'stroke-dashoffset:101'],[1470+delay,'stroke-dashoffset:0'],[period,'stroke-dashoffset:0']])
  const radius=step?37:25,rim=ctx.sh.mirror.rim.map(({cx,cy,r,from,to},index)=>{const point=angle=>`${num(radius*(cx+r*Math.cos(angle)))} ${num(radius*(cy+r*Math.sin(angle)))}`;return `${index?'L':'M'}${point(from)}A${num(radius*r)} ${num(radius*r)} 0 0 1 ${point(to)}`}).join('')+'Z'
  let body
  if(step){const {comets,tailTurn,secondsPerTurn}=ctx.sh.loader;body=line(rim)+ring(radius*ctx.sh.mirror.cusp*.94,core,1)+seq(comets,index=>move(`comet-${index}`,line(rim,flight,3,`pathLength="100" stroke-dasharray="${100*tailTurn} ${100*(1-tailTurn)}"`),[[0,`opacity:0;stroke-dashoffset:${num(index*100/comets)}`],[180,'opacity:1'],[secondsPerTurn*1000-180,'opacity:1'],[secondsPerTurn*1000,`opacity:0;stroke-dashoffset:${num(index*100/comets-100)}`],[period,'opacity:0']], 'opacity="0"'))+move('numeral',ctx.label(name.slice(-1),0,10,30,700,rest,'center'),[[0,'opacity:.55'],[2700,'opacity:.55'],[3060,'opacity:1'],[period,'opacity:1']])}
  if(name==='custody')body=line(rim)+trace('lock',arc(19,0,.5)+arc(19,.5,1))+gesture(at(-6,1,ring(4.5,core))+line('M-2 1H11V-4M6 1V-3',core),'transform','rotate(-48deg)','rotate(0deg)')
  if(name==='open-source')body=line('M-14 -12l-11 12 11 12M14 -12l11 12-11 12')+line('M0 -17V17')+trace('branch','M0 11C0 5 9 7 9 0S0 -5 0 -11')+at(0,-17,ring(2.5,core))+at(0,17,ring(2.5,core))
  if(name==='encryption')body=gesture(line('M-10 -2V-12a10 10 0 0 1 20 0v10'),'transform','translate(4px,-5px) rotate(14deg)','translate(0,0) rotate(0deg)')+line('M-14 -2h28q3 0 3 3v17q0 4-4 4h-26q-4 0-4-4V1q0-3 3-3Z')+at(0,10,ring(6)+trace('dial',arc(6,.03,.36),350))
  if(name==='privacy')body=gesture(line('M-24 0Q0 -26 24 0Q0 26 -24 0Z')+ring(6,core),'transform','scaleY(.08)','scaleY(1)')
  if(name==='wallets'){const card='M-15 -10h30q3 0 3 3v14q0 3-3 3h-30q-3 0-3-3V-7q0-3 3-3Z';body=gesture(at(-1,-6,line(card)),'transform','rotate(-23deg) translateX(-3px)','rotate(-6deg)')+at(2,5,line(card,core)+line('M-13 3h8',rest,2))}
  if(name==='networks')body=ring(19,rest,1.5)+seq(8,index=>{const angle=index*Math.PI/4;return at(19*Math.sin(angle),-19*Math.cos(angle),circ(0,0,3.4,rest)+move(`node-${index}`,circ(0,0,4.1,flight),[[0,'opacity:0'],[360+index*180,'opacity:0'],[450+index*180,'opacity:1'],[705+index*180,'opacity:0'],[period,'opacity:0']],'opacity="0"'))})+ring(3,core)
  if(name==='users')body=seq(3,index=>at((index-1)*16,index===1?-4:3,move(`person-${index}`,at(0,-8,ring(4.5,index===1?core:rest))+line('M-7 10V7a7 7 0 0 1 14 0v3'),[[0,'opacity:1'],[320,'opacity:.12'],[450+index*255,'opacity:.12'],[810+index*255,'opacity:1'],[period,'opacity:1']])))
  if(name==='rating'){const star='M0 -23l6.7 14.2 15.5 2.1-11.4 11 2.8 15.6L0 12.4l-13.6 7.5 2.8-15.6-11.4-11 15.5-2.1Z';body=group(line(star),'opacity=".45"')+trace('star',star)}
  return ctx.svg(size,size,name,at(size/2,size/2,body))
}
