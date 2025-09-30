// main.js - canvas particles, scroll reveal, lightbox, testimonial slider, nav toggle
(function(){
  // Canvas particles for hero
  const canvas = document.getElementById('hero-canvas');
  if(canvas){
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    const opts = { count: 80, size: 2.2, speed: 0.6, color: '#00a3ff' };

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
        ctx.beginPath(); ctx.fillStyle=opts.color; ctx.globalAlpha=0.9; ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      }
      // connections
      for(let i=0;i<particles.length;i++){
        for(let j=i+1;j<particles.length;j++){
          const a=particles[i], b=particles[j];
          const dx=a.x-b.x, dy=a.y-b.y, dist=Math.sqrt(dx*dx+dy*dy);
          if(dist < 110){
            ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.strokeStyle=opts.color;
            ctx.globalAlpha = 0.04 + (0.35*(1 - dist/110)); ctx.lineWidth = 1; ctx.stroke();
          }
        }
      }
      requestAnimationFrame(step);
    }
    window.addEventListener('resize', resize); resize(); step();
  }

  // scroll reveal
  const reveal = ()=>{
    document.querySelectorAll('.section, .hero-inner, .card, .project, .testimonial, .team-member').forEach((el,i)=>{
      const r = el.getBoundingClientRect();
      if(r.top < window.innerHeight - 80){
        el.style.transform = 'translateY(0)'; el.style.opacity = 1; el.style.transition = 'all .6s cubic-bezier(.22,.9,.29,1) '+(i*40)+'ms';
      } else {
        el.style.transform = 'translateY(20px)'; el.style.opacity = 0;
      }
    });
  };
  window.addEventListener('scroll', reveal); window.addEventListener('load', reveal);

  // lightbox
  function createLightbox(src){ const o=document.createElement('div'); o.className='nw-lightbox'; o.innerHTML='<img src="'+src+'" alt="preview"><button class="nw-close">✕</button>'; o.addEventListener('click', e=>{ if(e.target===o) o.remove(); }); o.querySelector('.nw-close').addEventListener('click', ()=>o.remove()); document.body.appendChild(o); }
  document.addEventListener('click', function(e){
    const p = e.target.closest('.project');
    if(p){ e.preventDefault(); const img = p.querySelector('img'); createLightbox(img.src); }
  });

  // testimonial slider simple
  (function(){
    const wrap=document.getElementById('testimonial-slider'); if(!wrap) return;
    const slides = Array.from(wrap.children); let idx=0;
    slides.forEach((s,i)=> s.style.transform='translateX('+(i*110)+'%)');
    setInterval(()=>{ idx = (idx+1)%slides.length; slides.forEach((s,i)=> s.style.transform='translateX('+((i-idx)*110)+'%)'); }, 3500);
  }());

  // nav toggle for small screens
  document.getElementById('nav-toggle')?.addEventListener('click', ()=>{
    document.querySelectorAll('.nav a').forEach(a=> a.style.display = a.style.display === 'inline-block' ? 'none' : 'inline-block');
  });
})();
