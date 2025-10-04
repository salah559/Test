// main.js - canvas particles, scroll reveal, language toggle, testimonial slider, nav toggle
(function(){
  // Language Management
  let currentLang = localStorage.getItem('preferredLanguage') || 'en';
  
  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('preferredLanguage', lang);
    document.documentElement.lang = lang;
    
    if (lang === 'ar') {
      document.body.style.direction = 'rtl';
      document.body.style.textAlign = 'right';
    } else {
      document.body.style.direction = 'ltr';
      document.body.style.textAlign = 'left';
    }
    
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        element.textContent = translations[lang][key];
      }
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      if (translations[lang] && translations[lang][key]) {
        element.placeholder = translations[lang][key];
      }
    });
    
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle && languageNames[lang]) {
      langToggle.textContent = languageNames[lang];
    }
    
    const dropdown = document.querySelector('.lang-dropdown');
    if (dropdown) dropdown.classList.remove('active');
  }
  
  // Language dropdown toggle
  document.getElementById('lang-toggle')?.addEventListener('click', () => {
    const dropdown = document.querySelector('.lang-dropdown');
    dropdown?.classList.toggle('active');
  });
  
  // Language selection
  document.querySelectorAll('.lang-option').forEach(option => {
    option.addEventListener('click', (e) => {
      const lang = e.target.getAttribute('data-lang');
      if (lang) setLanguage(lang);
    });
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    const langToggle = document.getElementById('lang-toggle');
    const dropdown = document.querySelector('.lang-dropdown');
    if (!langToggle?.contains(e.target) && !dropdown?.contains(e.target)) {
      dropdown?.classList.remove('active');
    }
  });
  
  window.addEventListener('load', () => setLanguage(currentLang));

  // Canvas particles for hero
  const canvas = document.getElementById('hero-canvas');
  if(canvas){
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    const opts = { count: 100, size: 2.5, speed: 0.5, color: '#00a3ff' };

    function resize(){ w = canvas.width = canvas.clientWidth || window.innerWidth; h = canvas.height = canvas.clientHeight || Math.max(window.innerHeight*0.6, 400); init(); }
    function rand(a,b){ return Math.random()*(b-a)+a; }
    function init(){
      particles = [];
      for(let i=0;i<opts.count;i++){
        particles.push({ x: rand(0,w), y: rand(0,h), vx: rand(-opts.speed, opts.speed), vy: rand(-opts.speed, opts.speed), r: rand(1, opts.size) });
      }
    }
    function step(){
      ctx.clearRect(0,0,w,h);
      for(let i=0;i<particles.length;i++){
        const p=particles[i]; p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>w) p.vx*=-1; if(p.y<0||p.y>h) p.vy*=-1;
        ctx.beginPath(); ctx.fillStyle=opts.color; ctx.globalAlpha=0.8; ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      }
      for(let i=0;i<particles.length;i++){
        for(let j=i+1;j<particles.length;j++){
          const a=particles[i], b=particles[j];
          const dx=a.x-b.x, dy=a.y-b.y, dist=Math.sqrt(dx*dx+dy*dy);
          if(dist < 120){
            ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.strokeStyle=opts.color;
            ctx.globalAlpha = 0.05 + (0.3*(1 - dist/120)); ctx.lineWidth = 1.2; ctx.stroke();
          }
        }
      }
      requestAnimationFrame(step);
    }
    window.addEventListener('resize', resize); resize(); step();
  }

  // scroll reveal with enhanced animation
  const reveal = ()=>{
    document.querySelectorAll('.section, .hero-inner, .card, .project, .testimonial, .team-member').forEach((el,i)=>{
      const r = el.getBoundingClientRect();
      if(r.top < window.innerHeight - 80){
        el.style.transform = 'translateY(0)'; el.style.opacity = 1; el.style.transition = 'all .8s cubic-bezier(0.22, 1, 0.36, 1) '+(i*60)+'ms';
      } else {
        el.style.transform = 'translateY(30px)'; el.style.opacity = 0;
      }
    });
  };
  window.addEventListener('scroll', reveal); window.addEventListener('load', reveal);

  // testimonial slider with smooth transition
  (function(){
    const wrap=document.getElementById('testimonial-slider'); if(!wrap) return;
    const slides = Array.from(wrap.children); let idx=0;
    slides.forEach((s,i)=> {
      s.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
      s.style.transform='translateX('+(i*110)+'%)';
    });
    setInterval(()=>{ 
      idx = (idx+1)%slides.length; 
      slides.forEach((s,i)=> s.style.transform='translateX('+((i-idx)*110)+'%)'); 
    }, 4000);
  }());

  // Mobile navigation toggle
  const navToggle = document.getElementById('nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  
  function toggleMobileNav() {
    const isActive = mobileNav?.classList.toggle('active');
    navToggle?.classList.toggle('active');
    mobileOverlay?.classList.toggle('active');
    document.body.style.overflow = isActive ? 'hidden' : '';
    navToggle?.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    mobileOverlay?.setAttribute('aria-hidden', isActive ? 'false' : 'true');
  }
  
  function closeMobileNav() {
    navToggle?.classList.remove('active');
    mobileNav?.classList.remove('active');
    mobileOverlay?.classList.remove('active');
    document.body.style.overflow = '';
    navToggle?.setAttribute('aria-expanded', 'false');
    mobileOverlay?.setAttribute('aria-hidden', 'true');
  }
  
  navToggle?.addEventListener('click', toggleMobileNav);
  mobileOverlay?.addEventListener('click', closeMobileNav);
  
  // Close mobile nav when clicking a link
  document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });
  
  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav?.classList.contains('active')) {
      closeMobileNav();
    }
  });

  // Enhanced project hover effect
  document.querySelectorAll('.project').forEach(project => {
    project.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
    });
  });
})();
