import {num,seq,group,at,pen,circ,rect,icon,coin,arc} from './art.mjs'
import {ambient,status} from './home.mjs'
import {dial,loader,seal} from './figures.mjs'

export function feature(ctx,name){
  const {svg,sh,colors,text,textMuted,gold,label,panel,tick,gate,anim,pulse}=ctx, cyan=sh.colors.flight, fail=sh.colors.failure
  const left=(str,x,y)=>label(str,x,y,13,500,textMuted), right=(str,x,y,color=text)=>label(str,x,y,14,700,color,'right')
  const chip=(str,x,y,w,selected=false)=>panel(x,y,w,26,13,selected?'#562045':'#24153B')+label(str,x+w/2,y+17,12,700,selected?'#FFDDED':textMuted,'center')
  const button=(str,y,disabled=false)=>rect(16,y,343,42,14,disabled?'#332642':ctx.pink())+label(str,187.5,y+27,16,700,disabled?textMuted:'white','center')
  const base=ambient(ctx,375,430)+status(ctx),header=title=>circ(33,61,16,ctx.glass(),`stroke="${ctx.rim()}"`)+icon('back',33,61,text,15)+label(title,60,69,24,700)
  const field=(title,value,y,token)=>panel(16,y,343,58)+left(title,31,y+20)+(token?coin(token,41,y+40,10):'')+label(value,token?58:31,y+45,17,700)
  const brand=title=>label(title,346,65,12,700,textMuted,'right')
  let art,description
  if(name==='networks'){
    const counts=Array.from({length:12},(_,index)=>index+3),step=360
    art=header('Networks')+panel(257,46,102,29,15)+dial(ctx,274,61,counts,step)+panel(16,84,343,34,16)+icon('search',34,101,textMuted,14)+left('Search networks',51,106)+chip('All',16,126,43,true)+chip('Popular',65,126,75)+chip('Favourite',146,126,86)+panel(16,161,343,263,17)
    const list=[['ALL','All networks'],['BTC','Bitcoin'],['ETH','Ethereum'],['SOL','Solana'],['TON','TON'],['DOT','Polkadot'],['XOR','SORA']]
    art+=list.map(([key,title],index)=>{const y=181+index*37,when=index===0?counts.length*step:(index+1)*step
      return coin(key,39,y,13)+label(title,63,y+5,15,700)+circ(303,y,2.8,colors.line)+gate('live-'+index,circ(303,y,3,gold),when,10000,true)+icon(index===0?'check':'star',333,y,index<3?gold:textMuted,15)+(index<6?pen(`M63 ${y+18}H342`,colors.line,.7,'opacity=".35"'):'')}).join('');description='Network answers arrive in sequence and the wallet settles to Live'
  }else if(name==='send'){
    art=header('Send')+brand('USDC')+field('Recipient','Demo recipient',82)+panel(16,146,343,82)+coin('USDC',42,166,12)+label('10 USDC',63,172,18,700)+right('$10.00',342,172)+left('Network',31,196)+right('Ethereum',343,196)+left('Network fee',31,217)+loader(ctx,331,212,2200)+gate('estimated',right('0.0005 USDC',343,217),2200,10000,true)
    const steps=sh.seal.stages.map((word,index)=>[word[0].toUpperCase()+word.slice(1),index?2500+index*1020:0])
    art+=panel(16,236,343,150,17)+seal(ctx,90,300,59)+coin('USDC',90,300,13)+left('Transfer status',170,292)+steps.map(([word,start],index)=>gate('status-'+index,label(word,170,321,24,700,index===3?gold:text),start,steps[index+1]?.[1]??10000,index===3)).join('');description='Illustrative USDC transfer: fee estimate, signature, dispatch and acceptance'
  }else if(name==='scam-warning'){
    art=panel(16,85,343,61)+left('Recipient',31,106)+gate('entry-empty',left('Enter an address',31,132),0,1250)+gate('entry-paste',label('0xDEMO…FLAGGED',31,132,17,700),1250,10000,true)
    const warning=rect(16,156,343,154,16,'#30162D',`stroke="${fail}" stroke-opacity=".75"`)+icon('warn',38,179,fail,20)+pulse('warn-once',38,179,10,2020)+label('Warning',58,185,17,700,'#FF978C')+left('This address is associated with fraudulent activity.',31,208)+left('For your security, do not send funds to this account.',31,226)+pen('M31 237H343',fail,.7,'opacity=".45"')+[['Name','Seed Stealer'],['Reason','Scam'],['Additional','Phishing']].map(([key,val],index)=>left(key,31,256+index*21)+right(val,343,256+index*21)).join('')+seal(ctx,319,180,20,true)
    art+=anim('warning-card',warning,[[0,'opacity:0;transform:scale(.88)'],[1470,'opacity:0;transform:scale(.88)'],[1725,'opacity:1;transform:scale(1)'],[9872,'opacity:1;transform:scale(1)'],[10000,'opacity:0;transform:scale(.94)']],10000,'settle')+['Scan QR','History','Paste'].map((word,index)=>{const x=16+index*117;return panel(x,321,109,33,13)+icon(['scan','clock','paste'][index],x+21,337,textMuted,14)+label(word,x+37,342,13,600)}).join('')+button('Continue',370,true);description='A pasted sample address is flagged for phishing; Continue remains disabled'
  }else if(name==='swap'){
    const until=2860
    art=header('Swap')+brand('Polkaswap')+panel(16,85,343,83)+left('From',32,108)+coin('ETH',48,140,15)+label('ETH',73,146,17,700)+right('0.02',342,143)+panel(16,179,343,87)+left('To',32,204)+coin('DAI',48,238,15)+label('DAI',73,244,17,700)+loader(ctx,330,234,until)+gate('first-quote',right('69.002714',342,244),until,4000)+gate('quoted',tick('quote','69.002714','69.006899',342,244,22,4000,{width:104}),4000,10000,true)
    art+=circ(188,174,18,ctx.glass(),`stroke="${ctx.rim()}"`)+at(188,174,anim('exchange',icon('swap',0,0,gold,17),[[0,'transform:rotate(0deg)'],[until,'transform:rotate(0deg)'],[until+510,'transform:rotate(180deg)'],[10000,'transform:rotate(180deg)']],10000,'settle'))+panel(16,279,343,75)+left('Min received',32,304)+right('68.73 DAI',343,304)+left('Route',32,337)
    ;['ETH','→','XOR','→','DAI'].forEach((word,index)=>{const x=[197,231,263,294,328][index],start=4100+index*180;art+=label(word,x,337,13,700,textMuted,'center')+gate('leg-work-'+index,label(word,x,337,13,700,cyan,'center'),start,start+720)+gate('leg-done-'+index,label(word,x,337,13,700,gold,'center'),start+720,10000,true)})
    art+=button('Swap',370);description='Polkaswap quote calculation, revised DAI amount and confirmed two-leg route'
  }else{
    art=header('Earn')+brand('Staking')+chip('Staking',16,86,74,true)+panel(16,124,343,107,17)+coin('DOT',46,157,18)+label('Polkadot',76,155,18,700)+left('Validator set',76,174)+pen('M32 188H342',colors.line,.7,'opacity=".5"')+left('Active nominations',32,213)+right('8 validators',342,213)+panel(16,242,343,116,17)+left('Total staked',32,268)+label('690 DOT',32,303,29,700)+left('Estimated rewards',32,336)+tick('rewards','2.34 DOT','2.48 DOT',342,336,17,6700,{color:cyan,width:73})
    const radius=24;art+=at(309,287,seq(sh.dial.segments,index=>{const data=arc(radius,index/8+sh.dial.gapTurn,(index+1)/8-sh.dial.gapTurn);return pen(data,colors.line,3)+gate(`era-${index}`,pen(data,gold,3),1000+index*720,10000,true)})+icon('earn',0,0,gold,17))+pulse('payout',309,287,radius,6700)+panel(16,370,343,43,14)+left('Unstaking period',32,397)+right('28 days',343,397);description='Polkadot staking era completes and the illustrative reward increases'
  }
  return svg(375,430,description,base+art)
}
