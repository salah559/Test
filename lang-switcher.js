
/*!
 Lightweight Language Switcher v1
 Non-destructive: scans visible text nodes and lets you store translations (ar/en) in localStorage.
 Adds a floating button to toggle language and open a small editor.
*/
(function(){
  const TRANSLATION_KEY = "site_translations_v1";
  const DEFAULT_LANG = localStorage.getItem("site_lang") || "ar";
  let translations = {};
  // load translations.json bundled with site if present, then override with localStorage
  async function loadBundled(){
    try{
      const resp = await fetch('/translations.json');
      if(resp.ok){
        const j = await resp.json();
        translations = j || {};
      }
    }catch(e){}
    // override with stored
    try{
      const stored = JSON.parse(localStorage.getItem(TRANSLATION_KEY) || "{}");
      translations = Object.assign({}, translations, stored);
    }catch(e){}
  }

  function saveLocal(){
    localStorage.setItem(TRANSLATION_KEY, JSON.stringify(translations));
  }

  // get visible text nodes under body
  function getTextNodes(root){
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function(node){
        if(!node.nodeValue) return NodeFilter.FILTER_REJECT;
        const txt = node.nodeValue.trim();
        if(!txt) return NodeFilter.FILTER_REJECT;
        // ignore script/style and hidden elements
        const p = node.parentElement;
        if(!p) return NodeFilter.FILTER_REJECT;
        const style = window.getComputedStyle(p);
        if(style && (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0')) return NodeFilter.FILTER_REJECT;
        if(['SCRIPT','STYLE','NOSCRIPT'].includes(p.tagName)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    let n;
    while(n = walker.nextNode()){
      nodes.push(n);
    }
    return nodes;
  }

  function buildInitialTranslations(){
    const nodes = getTextNodes(document.body);
    nodes.forEach(node=>{
      const key = node.nodeValue.trim();
      if(!(key in translations)){
        translations[key] = { ar: key, en: "" };
      } else {
        // ensure ar exists
        translations[key].ar = translations[key].ar || key;
      }
    });
    saveLocal();
  }

  function applyLang(lang){
    const nodes = getTextNodes(document.body);
    nodes.forEach(node=>{
      const orig = node.nodeValue.trim();
      const entry = translations[orig];
      if(entry && entry[lang]){
        node.nodeValue = node.nodeValue.replace(orig, entry[lang]);
      } else {
        // if no translation for target, keep original (ar)
        node.nodeValue = node.nodeValue.replace(orig, entry ? entry.ar : orig);
      }
    });
    document.documentElement.lang = lang === 'ar' ? 'ar' : 'en';
    if(lang === 'ar'){
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
    localStorage.setItem("site_lang", lang);
  }

  // UI: floating button and editor modal
  function createUI(){
    const btn = document.createElement('button');
    btn.id = 'lang-toggle-btn';
    btn.title = 'تبديل اللغة / Open editor';
    btn.style.position = 'fixed';
    btn.style.zIndex = 99999;
    btn.style.right = '14px';
    btn.style.bottom = '14px';
    btn.style.padding = '8px 12px';
    btn.style.borderRadius = '8px';
    btn.style.border = 'none';
    btn.style.cursor = 'pointer';
    btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
    btn.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))';
    btn.style.backdropFilter = 'blur(6px)';
    btn.style.fontSize = '13px';
    btn.innerText = DEFAULT_LANG === 'ar' ? 'EN' : 'AR';
    document.body.appendChild(btn);

    btn.addEventListener('click', ()=>{
      // open editor modal
      openEditor();
    });

    // small switch on double-click
    btn.addEventListener('dblclick', ()=>{
      const current = localStorage.getItem("site_lang") || DEFAULT_LANG;
      const next = current === 'ar' ? 'en' : 'ar';
      applyLang(next);
      btn.innerText = next === 'ar' ? 'EN' : 'AR';
    });

    // modal
    const modal = document.createElement('div');
    modal.id = 'lang-editor-modal';
    modal.style.position = 'fixed';
    modal.style.zIndex = 99999;
    modal.style.left = 0;
    modal.style.top = 0;
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.display = 'none';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.background = 'rgba(0,0,0,0.45)';
    document.body.appendChild(modal);

    const panel = document.createElement('div');
    panel.style.maxWidth = '900px';
    panel.style.width = '92%';
    panel.style.maxHeight = '80%';
    panel.style.overflow = 'auto';
    panel.style.background = 'white';
    panel.style.borderRadius = '12px';
    panel.style.padding = '14px';
    panel.style.boxShadow = '0 8px 40px rgba(0,0,0,0.4)';
    modal.appendChild(panel);

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '8px';
    panel.appendChild(header);

    const title = document.createElement('div');
    title.innerText = 'Language editor — محرر الترجمات';
    title.style.fontWeight = '700';
    header.appendChild(title);

    const closeBtn = document.createElement('button');
    closeBtn.innerText = 'إغلاق';
    closeBtn.style.cursor = 'pointer';
    header.appendChild(closeBtn);
    closeBtn.addEventListener('click', ()=>{ modal.style.display = 'none'; });

    const info = document.createElement('div');
    info.innerText = 'Double-click the floating button to toggle language quickly. Use the editor to add English translations, then click Save.';
    info.style.margin = '8px 0 12px 0';
    info.style.fontSize = '13px';
    panel.appendChild(info);

    const table = document.createElement('div');
    panel.appendChild(table);

    function buildTable(){
      table.innerHTML = '';
      const keys = Object.keys(translations);
      keys.forEach(k=>{
        const row = document.createElement('div');
        row.style.display = 'grid';
        row.style.gridTemplateColumns = '1fr 1fr auto';
        row.style.gap = '8px';
        row.style.marginBottom = '8px';
        const arbox = document.createElement('div');
        arbox.innerText = translations[k].ar;
        arbox.style.padding = '8px';
        arbox.style.background = '#f5f5f5';
        arbox.style.borderRadius = '6px';
        row.appendChild(arbox);
        const input = document.createElement('input');
        input.value = translations[k].en || '';
        input.style.padding = '8px';
        input.style.borderRadius = '6px';
        input.style.border = '1px solid #ddd';
        input.addEventListener('input', (e)=>{ translations[k].en = e.target.value; });
        row.appendChild(input);
        const saveOne = document.createElement('button');
        saveOne.innerText = 'حفظ';
        saveOne.style.cursor = 'pointer';
        saveOne.addEventListener('click', ()=>{
          saveLocal();
        });
        row.appendChild(saveOne);
        table.appendChild(row);
      });
    }

    const saveAll = document.createElement('button');
    saveAll.innerText = 'Save All';
    saveAll.style.marginTop = '12px';
    saveAll.style.cursor = 'pointer';
    saveAll.addEventListener('click', ()=>{
      saveLocal();
      alert('Saved to localStorage. Use export/import in console if you need a JSON file.');
    });
    panel.appendChild(saveAll);

    modal.addEventListener('click', (e)=>{
      if(e.target === modal) modal.style.display = 'none';
    });

    // open editor builder
    window.openEditor = function(){
      buildTable();
      modal.style.display = 'flex';
    };
  }

  // initialize
  window.addEventListener('DOMContentLoaded', async ()=>{
    await loadBundled();
    buildInitialTranslations();
    createUI();
    applyLang(localStorage.getItem("site_lang") || DEFAULT_LANG);
  });

})();
