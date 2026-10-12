import { chromium } from '@playwright/test';
const IDS = ['main-content','section-home','section-projects','section-experience','section-contact',
  'hero','hero-portrait','cta-explore-projects','cta-inspect-resume','cta-schedule-interview',
  'site-header','mobile-dock','nav-home','nav-projects','nav-experience','nav-contact',
  'dock-home','dock-projects','dock-experience','dock-contact','scroll-rail',
  'scene-layer','scene-canvas','scene-pause-toggle','form-contact-name','form-contact-email',
  'form-contact-subject','form-contact-message'];
const browser = await chromium.launch();
for (const vp of [{w:390,h:844,m:true},{w:1440,h:900,m:false}]) {
  const page = await (await browser.newContext({ viewport:{width:vp.w,height:vp.h}, hasTouch:vp.m, isMobile:vp.m })).newPage();
  await page.goto(process.env.AUDIT_URL ?? 'http://localhost:4183', { waitUntil:'load' });
  await page.waitForFunction(()=>document.getElementById('root')?.childElementCount>0);
  await page.waitForFunction(()=>!document.querySelector('[class*="preloader"]'),{timeout:15000}).catch(()=>{});
  await page.waitForTimeout(2500);
  // contact form lives in a lazy section - scroll it in
  await page.evaluate(()=>{location.hash='#contact';});
  await page.waitForTimeout(2000);
  const found = await page.evaluate((ids)=>ids.map(id=>({id, n:document.querySelectorAll('[data-testid="'+id+'"]').length})), IDS);
  const missing = found.filter(f=>f.n===0);
  console.log(`${vp.w}px -> ${found.length-missing.length}/${found.length} resolved` + (missing.length? '  MISSING: '+missing.map(m=>m.id).join(', ') : ''));
  await page.context().close();
}
await browser.close();
