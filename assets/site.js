/* Veritas Marketing Solutions — shared interactions */
(function(){
  const fine = matchMedia('(pointer:fine)').matches;
  const still = matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* custom cursor */
  if (fine && !still) {
    document.body.classList.add('has-cursor');
    const dot = document.createElement('div'); dot.className = 'cur-dot';
    const ring = document.createElement('div'); ring.className = 'cur-ring'; ring.innerHTML = '<span></span>';
    document.body.append(dot, ring);
    let x = -100, y = -100, rx = x, ry = y;
    addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; dot.style.transform = `translate3d(${x}px,${y}px,0)`; }, {passive:true});
    (function loop(){ rx += (x - rx) * .18; ry += (y - ry) * .18; ring.style.transform = `translate3d(${rx}px,${ry}px,0)`; requestAnimationFrame(loop); })();
    document.addEventListener('mouseover', e => {
      const t = e.target.closest('a,button,[data-cur],input,select,textarea,label');
      ring.classList.toggle('big', !!t && !t.matches('input,select,textarea'));
      ring.querySelector('span').textContent = t ? (t.dataset.cur || '') : '';
    });
  }

  /* nav */
  const nav = document.querySelector('.nav');
  nav && nav.querySelector('.burger')?.addEventListener('click', () => nav.classList.toggle('open'));
  nav && nav.querySelectorAll('.links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

  /* reveal on scroll */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), {threshold:.12, rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* spotlight cards */
  document.addEventListener('pointermove', e => {
    const c = e.target.closest && e.target.closest('.spot'); if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, {passive:true});

  if (fine && !still) {
    /* magnetic buttons */
    document.querySelectorAll('[data-magnet]').forEach(b => {
      b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width/2) * .25}px,${(e.clientY - r.top - r.height/2) * .35}px)`; });
      b.addEventListener('mouseleave', () => b.style.transform = '');
    });
    /* 3D tilt */
    document.querySelectorAll('[data-tilt]').forEach(c => {
      const k = parseFloat(c.dataset.tilt) || 8;
      c.addEventListener('mousemove', e => { const r = c.getBoundingClientRect(); const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        c.style.transform = `perspective(900px) rotateY(${px * k}deg) rotateX(${-py * k}deg)`; });
      c.addEventListener('mouseleave', () => c.style.transform = '');
    });
  }

  /* count-up numbers */
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, to = parseFloat(el.dataset.count), dec = (el.dataset.count.split('.')[1] || '').length, t0 = performance.now(), d = 1600;
    (function step(t){ const p = Math.min(1, (t - t0) / d), v = to * (1 - Math.pow(1 - p, 3)); el.textContent = v.toFixed(dec); if (p < 1) requestAnimationFrame(step); })(t0);
  }), {threshold:.5});
  document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

  /* year */
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();
