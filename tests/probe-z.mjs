import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport:{width:390,height:844}, hasTouch:true, isMobile:true })).newPage();
await page.goto(process.env.AUDIT_URL ?? 'http://localhost:4183',{waitUntil:'load'});
await page.waitForFunction(()=>document.getElementById('root')?.childElementCount>0);
await page.waitForFunction(()=>!document.querySelector('[class*="preloader"]'),{timeout:15000}).catch(()=>{});
await page.waitForTimeout(2500);
const r = await page.evaluate(()=>{
  const z = {};
  for (const el of document.querySelectorAll('*')) {
    const v = getComputedStyle(el).zIndex;
    if (v && v!=='auto' && parseInt(v)>0) {
      const k = el.getAttribute('data-testid') || el.tagName.toLowerCase()+'.'+(el.className?.toString?.().split(/\s+/)[0]||'');
      z[k] = Math.max(z[k]||0, parseInt(v));
    }
  }
  return { layers: Object.entries(z).sort((a,b)=>b[1]-a[1]) };
});
console.log(JSON.stringify(r,null,2));
await browser.close();
