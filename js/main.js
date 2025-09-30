// js/main.js — language switcher, AOS init, lightbox, mobile nav, scroll reveal
(async function(){
  // AOS init
  if(window.AOS) AOS.init({duration:700, once:true, easing:'ease-out-cubic'});

  // load translations
  let translations = {};
  try {
    const resp = await fetch('js/translations.json');
    translations = await resp.json();
  } catch(e) { console.warn('translations.json not loaded', e); }

  // utility to set text by selector with data-i18n; supports nested keys like "hero.title"
  function translateTo(lang){
    const langPack = translations[lang] || translations['en'] || {};
    // elements with data-i18n attribute (key) or data-i18n-attr (for placeholders)
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n').trim();
      const parts = key.split('.');
      let val = langPack;
      for(let p of parts){ if(val) val = val[p]; else break; }
      if(val !== undefined) el.textContent = val;
    });
    // placeholders and attributes
    document.querySelectorAll('[data-i18n-attr]').forEach(el=>{
      const raw = el.getAttribute('data-i18n-attr'); // e.g. "placeholder:hero.search"
      const [attr,key] = raw.split(':').map(s=>s.trim());
      const parts = key.split('.');
      let val = langPack;
      for(let p of parts){ if(val) val = val[p]; else break; }
      if(val !== undefined) el.setAttribute(attr, val);
    });
    // direction
    if(lang === 'ar'){ document.documentElement.setAttribute('dir','rtl'); document.getElementById('html-root').lang='ar'; document.body.style.textAlign='right'; }
    else { document.documentElement.setAttribute('dir','ltr'); document.getElementById('html-root').lang='en'; document.body.style.textAlign='left'; }
  }

  // initial language
  let currentLang = localStorage.getItem('nw_lang') || 'en';
  // set initial content quickly
  window.addEventListener('DOMContentLoaded', () => {
    // fill static items (hero & nav fallback) if translations loaded later
    translateTo(currentLang);
    // set lang button text
    const btn = document.getElementById('lang-switch');
    if(btn) btn.textContent = currentLang === 'en' ? 'EN' : 'AR';
  });

  // language toggle
  document.getElementById('lang-switch')?.addEventListener('click', (e)=>{
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    localStorage.setItem('nw_lang', currentLang);
    translateTo(currentLang);
    e.target.textContent = currentLang === 'en' ? 'EN' : 'AR';
  });

  // mobile nav toggle
  document.getElementById('mobile-toggle')?.addEventListener('click', ()=>{
    document.querySelectorAll('.nav a').forEach(a=>{
      a.style.display = (a.style.display === 'inline-block') ? 'none' : 'inline-block';
    });
  });

  // simple project lightbox
  function createLightbox(src){
    const o = document.createElement('div'); o.className = 'nw-lightbox';
    o.innerHTML = '<div class="nw-lightbox-inner"><img src="'+src+'" alt="preview"><button class="nw-close">✕</button></div>';
    o.addEventListener('click', (ev)=>{ if(ev.target===o) o.remove(); });
    o.querySelector('.nw-close')?.addEventListener('click', ()=> o.remove());
    document.body.appendChild(o);
  }
  document.addEventListener('click', function(e){
    const p = e.target.closest('.project');
    if(p){ e.preventDefault(); const img = p.querySelector('img'); if(img) createLightbox(img.src); }
  });

  // update year
  const y = new Date().getFullYear(); document.getElementById('year') && (document.getElementById('year').textContent = y);

  // run first-time translation if translations already fetched
  if(Object.keys(translations).length) translateTo(currentLang);
})();
