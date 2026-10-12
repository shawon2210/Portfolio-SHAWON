import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await (await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true})).newPage();
await page.goto(process.env.AUDIT_URL ?? 'http://localhost:4183',{waitUntil:'load'});
await page.waitForFunction(()=>document.getElementById('root')?.childElementCount>0);
await page.waitForFunction(()=>!document.querySelector('[class*="preloader"]'),{timeout:15000}).catch(()=>{});
await page.waitForTimeout(2500);
await page.evaluate(()=>{location.hash='#projects';});
await page.waitForTimeout(2200);

const r = await page.evaluate(()=>{
  const out=[];
  for (const el of document.querySelectorAll('[data-tap]')) {
    const b = el.getBoundingClientRect();
    if (b.width===0||b.height===0) continue;
    if (b.top<0||b.top>innerHeight) continue;   // only on-screen
    // probe the 4 corners of the 44x44 hit area around the element
    const cx=b.left+b.width/2, cy=b.top+b.height/2;
    const half=22;
    const pts=[[cx-half,cy],[cx+half,cy],[cx,cy-half],[cx,cy+half]];
    const hits=pts.map(([x,y])=>{
      if(x<0||y<0||x>innerWidth||y>innerHeight) return 'offscreen';
      const top=document.elementFromPoint(x,y);
      return el.contains(top)||top===el||el.contains(top?.parentElement||null)?'hit':'miss';
    });
    out.push({ sel:(el.textContent||'').trim().slice(0,18)||el.getAttribute('title')||'icon',
               box:`${Math.round(b.width)}x${Math.round(b.height)}`, hitHits:hits.filter(h=>h==='hit').length, hits });
  }
  return out;
});
console.log(JSON.stringify(r,null,2));
await browser.close();
