import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await (await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true})).newPage();
await page.goto(process.env.AUDIT_URL ?? 'http://localhost:4183',{waitUntil:'load'});
await page.waitForFunction(()=>document.getElementById('root')?.childElementCount>0);
await page.waitForFunction(()=>!document.querySelector('[class*="preloader"]'),{timeout:15000}).catch(()=>{});
await page.waitForTimeout(2500);
// scroll the whole page so everything mounts
await page.evaluate(async()=>{ for(let i=0;i<14;i++){window.scrollBy(0,innerHeight*0.8); await new Promise(r=>setTimeout(r,250));} });
await page.waitForTimeout(2000);
const r = await page.evaluate(()=>{
  const all=[...document.querySelectorAll('[data-tap]')];
  return { count: all.length, info: all.slice(0,6).map(e=>{
    const cs=getComputedStyle(e,'::after');
    const b=e.getBoundingClientRect();
    return { txt:(e.textContent||'').trim().slice(0,16)||e.getAttribute('title')||'icon',
             box:`${Math.round(b.width)}x${Math.round(b.height)}`,
             afterMinW:cs.minWidth, afterMinH:cs.minHeight, afterPos:cs.position,
             afterW:cs.width, afterH:cs.height, afterContent:cs.content };
  })};
});
console.log(JSON.stringify(r,null,2));
await browser.close();
