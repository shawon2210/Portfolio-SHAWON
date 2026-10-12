import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await (await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true})).newPage();
await page.goto(process.env.AUDIT_URL ?? 'http://localhost:4183',{waitUntil:'load'});
await page.waitForFunction(()=>document.getElementById('root')?.childElementCount>0);
await page.waitForFunction(()=>!document.querySelector('[class*="preloader"]'),{timeout:15000}).catch(()=>{});
await page.waitForTimeout(2500);
await page.evaluate(async()=>{ for(let i=0;i<10;i++){window.scrollBy(0,innerHeight*0.8); await new Promise(r=>setTimeout(r,250));} });
await page.waitForTimeout(1500);
const r = await page.evaluate(()=>{
  const res=[];
  for (const el of document.querySelectorAll('[data-tap]')) {
    const b=el.getBoundingClientRect();
    if(!b.width||b.top<0||b.top>innerHeight) continue;
    const cx=b.left+b.width/2, cy=b.top+b.height/2;
    // probe 18px outside the visual box on each side: should still hit the link
    const probes=[[cx-18,cy],[cx+18,cy],[cx,cy-18],[cx,cy+18]];
    const ok=probes.filter(([x,y])=>{
      if(x<0||y<0||x>innerWidth||y>innerHeight) return false;
      const t=document.elementFromPoint(x,y);
      return t && (t===el||el.contains(t));
    }).length;
    res.push({ txt:(el.textContent||'').trim().slice(0,14)||el.getAttribute('title'),
               visual:`${Math.round(b.width)}x${Math.round(b.height)}`, hitRegionPx: ok===4?'44x44 ✅':`only ${ok}/4` });
  }
  return res;
});
console.log(JSON.stringify(r,null,2));
await browser.close();
