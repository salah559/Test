// main.js - canvas particles, scroll reveal, language toggle, testimonial slider, nav toggle
(function(){
  // Language Management
  let currentLang = localStorage.getItem('preferredLanguage') || 'en';
  
  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('preferredLanguage', lang);
    document.documentElement.lang = lang;
    
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
      document.body.style.direction = 'rtl';
      document.body.style.textAlign = 'right';
    } else {
      document.documentElement.dir = 'ltr';
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
    
    closeLangDropdown();
  }
  
  function closeLangDropdown() {
    const dropdown = document.querySelector('.lang-dropdown');
    const langToggle = document.getElementById('lang-toggle');
    if (dropdown) dropdown.classList.remove('active');
    if (langToggle) langToggle.setAttribute('aria-expanded', 'false');
  }
  
  function openLangDropdown() {
    const dropdown = document.querySelector('.lang-dropdown');
    const langToggle = document.getElementById('lang-toggle');
    if (dropdown) dropdown.classList.add('active');
    if (langToggle) langToggle.setAttribute('aria-expanded', 'true');
  }
  
  // Language dropdown toggle with keyboard support
  const langToggle = document.getElementById('lang-toggle');
  const dropdown = document.querySelector('.lang-dropdown');
  
  if (langToggle && dropdown) {
    langToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = langToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeLangDropdown();
      } else {
        openLangDropdown();
        dropdown.querySelector('.lang-option')?.focus();
      }
    });
    
    langToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        langToggle.click();
      }
    });
  }
  
  // Language selection with keyboard support
  document.querySelectorAll('.lang-option').forEach((option, index, options) => {
    option.addEventListener('click', (e) => {
      const lang = e.target.getAttribute('data-lang');
      if (lang) setLanguage(lang);
    });
    
    option.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const lang = e.target.getAttribute('data-lang');
        if (lang) setLanguage(lang);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeLangDropdown();
        langToggle?.focus();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = options[index + 1] || options[0];
        next.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = options[index - 1] || options[options.length - 1];
        prev.focus();
      }
    });
  });
  
  // Close dropdown when clicking outside or pressing Escape
  document.addEventListener('click', (e) => {
    if (!langToggle?.contains(e.target) && !dropdown?.contains(e.target)) {
      closeLangDropdown();
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLangDropdown();
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

  // Back to Top Button
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });
    
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Reading Progress Bar
  const progressBar = document.getElementById('reading-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    });
  }

  // Loading Screen
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 500);
      }, 800);
    });
  }

  // Lazy Loading Images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
})();
