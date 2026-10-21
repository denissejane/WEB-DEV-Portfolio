/* js/06-motion-and-progress.js: motion and progress behavior for the portfolio. */

function initScrollReveal() {
  const targets = document.querySelectorAll('.checkpoint-card, .hero-copy, .avatar-hero');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('motion-visible'); observer.unobserve(entry.target); }
  }), { threshold:.12, rootMargin:'0px 0px -8% 0px' });
  targets.forEach((target) => { target.classList.add('motion-ready'); observer.observe(target); });
}

function initScrollProgress() {
  const root=document.documentElement;
  let queued=false;
  const update=()=>{
    queued=false;
    const range=root.scrollHeight-window.innerHeight;
    root.style.setProperty('--scroll-progress',range>0?String(Math.min(1,window.scrollY/range)):'0');
  };
  const schedule=()=>{ if (!queued) { queued=true; requestAnimationFrame(update); } };
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  update();
}

function initHeroPointerGlow() {
  const root=document.documentElement;
  if (!window.matchMedia('(pointer:fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const move=(event)=>{
    root.style.setProperty('--cursor-light-x',`${event.clientX}px`);
    root.style.setProperty('--cursor-light-y',`${event.clientY}px`);
  };
  window.addEventListener('pointermove',move,{passive:true});
  document.documentElement.addEventListener('pointerleave',()=>{
    root.style.setProperty('--cursor-light-x','-1000px');
    root.style.setProperty('--cursor-light-y','-1000px');
  },{passive:true});
}
