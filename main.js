(() => {
  'use strict';
  document.documentElement.classList.add('js-enabled');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const revealNodes = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealNodes.forEach(node => revealObserver.observe(node));
  } else {
    revealNodes.forEach(node => node.classList.add('is-visible'));
  }

  // Continuously animated CONCEPT loading status, not connected to a printer.
  // Begins at 82% (the artwork's reference value), reaches 100%, then loops.
  const progressNodes = document.querySelectorAll('[data-progress]');
  const progressTrack = document.querySelector('.print-progress__track');
  const progressFill = document.querySelector('.print-progress__fill');
  const CYCLE_MS = 14000;
  const HOLD_MS = 850;
  let animationFrame = null;
  let progressStart = performance.now() - CYCLE_MS * 0.82;
  let lastDisplayed = -1;

  function showProgress(value) {
    const percent = Math.max(0, Math.min(100, value));
    if (progressFill) progressFill.style.setProperty('--progress-width', `${percent.toFixed(2)}%`);
    const rounded = Math.round(percent);
    if (rounded !== lastDisplayed) {
      progressNodes.forEach(node => { node.textContent = String(rounded); });
      if (progressTrack) progressTrack.setAttribute('aria-valuenow', String(rounded));
      lastDisplayed = rounded;
    }
  }

  function updateProgress(now) {
    if (document.hidden || reducedMotion.matches) return;
    const elapsed = (now - progressStart) % (CYCLE_MS + HOLD_MS);
    const value = elapsed >= CYCLE_MS ? 100 : 100 * elapsed / CYCLE_MS;
    showProgress(value);
    animationFrame = window.requestAnimationFrame(updateProgress);
  }

  function setProgressMotion() {
    if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    if (reducedMotion.matches) {
      showProgress(82);
      return;
    }
    if (!document.hidden) {
      progressStart = performance.now() - CYCLE_MS * 0.82;
      animationFrame = window.requestAnimationFrame(updateProgress);
    }
  }

  setProgressMotion();
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    if (!document.hidden) setProgressMotion();
  });
  reducedMotion.addEventListener?.('change', setProgressMotion);

  const scene = document.getElementById('scene');
  const canvas = document.getElementById('particle-field');
  if (!scene || !canvas) return;

  // Pointer-responsive artwork adds dimensionality without shifting content.
  if (window.matchMedia('(pointer: fine)').matches && !reducedMotion.matches) {
    scene.addEventListener('pointermove', event => {
      const bounds = scene.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      scene.style.setProperty('--parallax-x', `${(x * 11).toFixed(1)}px`);
      scene.style.setProperty('--parallax-y', `${(y * 8).toFixed(1)}px`);
    }, { passive: true });
    scene.addEventListener('pointerleave', () => {
      scene.style.setProperty('--parallax-x', '0px');
      scene.style.setProperty('--parallax-y', '0px');
    });
  }

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;
  let width = 0, height = 0, particles = [], frame;
  const rand = (min, max) => min + Math.random() * (max - min);

  const resize = () => {
    const bounds = canvas.getBoundingClientRect();
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.min(54, Math.max(20, Math.round(width / 23)));
    particles = Array.from({ length: count }, () => ({
      x: rand(width * .19, width * .81), y: rand(height * .14, height * .90),
      radius: rand(.4, 1.65), speed: rand(.10, .44), phase: rand(0, Math.PI * 2),
      tint: Math.random() > .83 ? '255,126,74' : '63,179,255'
    }));
  };

  const render = time => {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      if (!reducedMotion.matches) {
        p.y -= p.speed;
        p.x += Math.sin(time / 1100 + p.phase) * .095;
        if (p.y < height * .13) { p.y = height * .90; p.x = rand(width * .2, width * .8); }
      }
      const alpha = .15 + .38 * (.5 + .5 * Math.sin(time / 1100 + p.phase));
      ctx.fillStyle = `rgba(${p.tint},${alpha.toFixed(3)})`;
      ctx.shadowBlur = p.radius * 6;
      ctx.shadowColor = `rgba(${p.tint},.5)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    if (!reducedMotion.matches && !document.hidden) frame = requestAnimationFrame(render);
  };

  resize();
  render(0);
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(scene);
  else window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(frame);
    else if (!reducedMotion.matches) frame = requestAnimationFrame(render);
  });
  reducedMotion.addEventListener?.('change', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(render);
  });
})();
