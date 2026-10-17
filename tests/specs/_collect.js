/* Phase 0 responsive collector. Exists as a standalone source string so the same
   measurement logic can run on the page directly AND be eval'd per-section after
   a hash change. Returns structured, machine-readable findings. */
(() => {
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const de = document.documentElement;

  const sel = (el) => {
    if (!el || el === de || el === document.body) return el?.tagName?.toLowerCase?.() ?? 'unknown';
    const tag = el.tagName ? el.tagName.toLowerCase() : 'unknown';
    const testid = el.getAttribute && el.getAttribute('data-testid');
    const id = el.id ? `#${CSS.escape(el.id)}` : '';
    const td = testid ? `[data-testid="${testid}"]` : '';
    const cls = (el.className && el.className.toString ? el.className.toString() : '')
      .split(/\s+/).filter(Boolean).slice(0, 2).map((c) => '.' + c).join('');
    return `${tag}${id}${td}${cls}`;
  };

  const visible = (el) => {
    if (!el || !el.getBoundingClientRect) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    if (parseFloat(cs.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  const all = Array.from(document.body.querySelectorAll('*')).filter(visible);

  /* 1 — horizontal overflow + offenders */
  const horizontalOverflow = de.scrollWidth - de.clientWidth;
  const offenders = [];
  for (const el of all) {
    const r = el.getBoundingClientRect();
    if (!r.width) continue;
    const overRight = r.right - vw;
    const overLeft = -r.left;
    if (overRight > 1 || overLeft > 1) {
      const cs = getComputedStyle(el);
      offenders.push({
        selector: sel(el),
        overRight: Math.round(overRight),
        overLeft: Math.round(overLeft),
        width: Math.round(r.width),
        left: Math.round(r.left),
        position: cs.position,
        fullBleed: /w-screen|100vw|marquee|translate-x|inset-x/i.test(cs.width + ' ' + (el.className.toString?.() ?? '')),
      });
    }
  }

  /* 2 — text smaller than 14px body / 12px caption */
  const tinyText = [];
  const tinySeen = new Set();
  for (const el of all) {
    const text = Array.from(el.childNodes)
      .filter((n) => n.nodeType === 3 && n.textContent.trim().length > 1)
      .map((n) => n.textContent.trim()).join(' ');
    if (!text) continue;
    const cs = getComputedStyle(el);
    const px = parseFloat(cs.fontSize) || 0;
    if (!px) continue;
    const isCaption = /caption|label|eyebrow|meta|badge|mono/i.test(el.className.toString?.() ?? '');
    const floor = isCaption ? 12 : 14;
    if (px < floor - 0.01) {
      const key = sel(el) + '|' + px;
      if (tinySeen.has(key)) continue;
      tinySeen.add(key);
      tinyText.push({ selector: sel(el), px: Math.round(px * 10) / 10, floor, text: text.slice(0, 40) });
    }
  }

  /* 3 — interactive targets under 44x44 (box + own padding) */
  const smallTargets = [];
  for (const el of all) {
    const tag = el.tagName.toLowerCase();
    const role = el.getAttribute('role');
    const interactive =
      tag === 'button' || tag === 'summary' ||
      (tag === 'a' && el.hasAttribute('href')) ||
      tag === 'input' || tag === 'select' || tag === 'textarea' ||
      role === 'button' || role === 'link' || role === 'tab' || role === 'checkbox';
    if (!interactive) continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const cs = getComputedStyle(el);
    /* Tailwind sets a global `border-box`, so `getBoundingClientRect()` already
       contains the padding. Only content-box elements need it added back —
       adding it unconditionally inflated every target and masked real gaps. */
    const contentBox = cs.boxSizing === 'content-box';
    let effW = r.width + (contentBox ? (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0) : 0);
    let effH = r.height + (contentBox ? (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0) : 0);
    /* `[data-tap]::after` (see index.css) extends the hit area past the visual
       box. A pseudo-element has no bounding rect, so read its declared minimums;
       otherwise a genuinely 44x44 target is reported at its 14x14 visual size. */
    const tap = getComputedStyle(el, '::after');
    if (tap.content && tap.content !== 'none') {
      effW = Math.max(effW, parseFloat(tap.minWidth) || 0);
      effH = Math.max(effH, parseFloat(tap.minHeight) || 0);
    }
    if (effW < 43.5 || effH < 43.5) {
      smallTargets.push({
        selector: sel(el),
        label: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 32),
        w: Math.round(effW), h: Math.round(effH),
        need: `${Math.max(0, Math.ceil(44 - effW))}w x ${Math.max(0, Math.ceil(44 - effH))}h`,
      });
    }
  }

  /* 4 — fixed/sticky chrome overlapping interactive content.
     A `pointer-events: none` layer is pointer-transparent: it renders behind/over
     content but can never receive or intercept a tap, so it cannot "cover" an
     interactive element. The full-screen decorative background scene
     ([data-testid="scene-layer"]) is such a layer and, being viewport-sized, its
     centre coincides with whatever content is centred — reporting it would be a
     structural false positive, not a finding. Verified separately: a real click on
     the email input under that layer lands and accepts input. */
  const chrome = all.filter((el) => {
    const cs = getComputedStyle(el);
    const p = cs.position;
    if (p !== 'fixed' && p !== 'sticky') return false;
    if (cs.pointerEvents === 'none') return false;
    const r = el.getBoundingClientRect();
    return r.width >= 24 && r.height >= 4;
  }).map((el) => ({ el, rect: el.getBoundingClientRect(), z: getComputedStyle(el).zIndex, selector: sel(el) }));

  const collisions = [];
  for (const c of chrome) {
    if (c.rect.width * c.rect.height < 400) continue;
    const cx = c.rect.left + c.rect.width / 2;
    const cy = c.rect.top + c.rect.height / 2;
    if (cy < 0 || cy > vh) continue;
    const stack = document.elementsFromPoint(cx, cy);
    for (const node of stack) {
      const tag = node.tagName && node.tagName.toLowerCase();
      if (!tag || !['button', 'a', 'input', 'select', 'textarea'].includes(tag)) continue;
      if (chrome.some((x) => x.el.contains(node) || x.el === node)) continue;
      collisions.push({
        chrome: c.selector, chromeZ: c.z,
        covering: sel(node),
        coveringLabel: (node.getAttribute('aria-label') || node.textContent || '').trim().slice(0, 30),
      });
      break;
    }
  }

  /* 5 — profile portrait */
  const portraitEl =
    document.querySelector('[data-testid="hero-portrait"]') ||
    Array.from(document.querySelectorAll('img, picture')).find((i) =>
      /avatar|portrait|mdshawon|profile|photo/i.test(
        i.getAttribute?.('src') || i.querySelector?.('img')?.getAttribute('src') || ''));

  let portrait = null;
  if (portraitEl) {
    const img = portraitEl.tagName === 'IMG' ? portraitEl : portraitEl.querySelector('img');
    const box = portraitEl.tagName === 'IMG' ? portraitEl.getBoundingClientRect() : portraitEl.getBoundingClientRect();
    const r = img ? img.getBoundingClientRect() : box;
    portrait = {
      selector: sel(portraitEl),
      displayedW: Math.round(r.width), displayedH: Math.round(r.height),
      pctOfViewport: Math.round((r.width / vw) * 1000) / 10,
      displayedAreaPx: Math.round(r.width * r.height),
      ratio: r.height ? Math.round((r.width / r.height) * 1000) / 1000 : null,
      naturalW: img?.naturalWidth || null,
      naturalH: img?.naturalHeight || null,
      currentSrcFile: (img?.currentSrc || img?.src || '').split('/').pop(),
      hasSrcset: !!img?.getAttribute('srcset'),
      hasSizes: !!img?.getAttribute('sizes'),
      hasWHattrs: !!(img?.getAttribute('width') && img?.getAttribute('height')),
      fetchpriority: img?.getAttribute('fetchpriority') || null,
      loading: img?.getAttribute('loading') || null,
      decoding: img?.getAttribute('decoding') || null,
      // pixels of source consumed per CSS px => sharpness at this DPR
      effectiveDpr: img?.naturalWidth ? Math.round((img.naturalWidth / r.width) * 100) / 100 : null,
      sourceAspect: img?.naturalWidth ? Math.round((img.naturalWidth / img.naturalHeight) * 1000) / 1000 : null,
      objectFit: img ? getComputedStyle(img).objectFit : null,
      altLen: img?.getAttribute('alt')?.length || 0,
    };
  }

  /* 6 — z-index inventory */
  const zIndex = all.filter((el) => {
    const z = getComputedStyle(el).zIndex;
    return z && z !== 'auto' && parseInt(z, 10) > 0;
  }).map((el) => ({ selector: sel(el), z: parseInt(getComputedStyle(el).zIndex, 10), pos: getComputedStyle(el).position }))
    .sort((a, b) => b.z - a.z);

  /* 7 — form controls under 16px (iOS zoom-on-focus) */
  const smallInputs = [];
  for (const el of all) {
    const tag = el.tagName.toLowerCase();
    if (!['input', 'textarea', 'select'].includes(tag)) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize) || 0;
    if (fs < 16) {
      smallInputs.push({
        selector: sel(el), name: el.getAttribute('name') || el.id || '',
        px: Math.round(fs * 10) / 10, type: el.getAttribute('type'),
        inputmode: el.getAttribute('inputmode'), autocomplete: el.getAttribute('autocomplete'),
      });
    }
  }

  /* 8 — section heights */
  const sections = {};
  for (const id of ['home', 'projects', 'experience', 'contact']) {
    const el = document.querySelector('#' + id) || document.querySelector(`[data-testid="section-${id}"]`);
    if (el) {
      const r = el.getBoundingClientRect();
      sections[id] = { height: Math.round(r.height), top: Math.round(r.top + window.scrollY) };
    } else sections[id] = null;
  }

  return {
    vw, vh,
    scrollW: de.scrollWidth, clientW: de.clientWidth, scrollH: de.scrollHeight,
    horizontalOverflow: Math.round(horizontalOverflow),
    offenders: offenders.slice(0, 12),
    tinyText: tinyText.slice(0, 16),
    smallTargets: smallTargets.slice(0, 20),
    collisions: collisions.slice(0, 10),
    smallInputs: smallInputs.slice(0, 10),
    portrait, zIndex: zIndex.slice(0, 14), sections,
    cls: Math.round((window.__auditCLS || 0) * 1000) / 1000,
    uses100vw: Array.from(document.querySelectorAll('*')).filter((e) => /100vw/.test(getComputedStyle(e).width)).length,
  };
})()