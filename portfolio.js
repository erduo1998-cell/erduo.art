(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.add('js-enabled');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 1025px)');
  const finePointer = window.matchMedia('(pointer: fine)');
  const header = document.querySelector('.header');
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.navigation');
  const motionButton = document.querySelector('.motion-toggle');
  const intro = document.querySelector('.intro');
  const avatar = document.querySelector('[data-avatar]');
  const heroIntro = document.querySelector('.hero-intro');
  const heroRole = document.querySelector('.hero-role');
  const heroBottom = document.querySelector('.hero-bottom');
  const about = document.querySelector('.about-copy');
  const heroVideo = document.querySelector('[data-hero-video]');
  const work = document.querySelector('.work');
  const viewport = document.querySelector('.work-viewport');
  const track = document.querySelector('.work-track');
  const cards = [...document.querySelectorAll('.work-card')];
  const prev = document.querySelector('[data-work-prev]');
  const next = document.querySelector('[data-work-next]');
  const progress = document.querySelector('.work-progress i');
  const counter = document.querySelector('.work-counter');
  const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
  let paused = reduced.matches;
  let maxX = 0;
  let travel = 0;
  let workStart = 0;
  let workFraction = 0;
  let frame = 0;
  let cursorX = -100;
  let cursorY = -100;
  let heroOnScreen = true;
  let heroFailed = false;
  let lastVideoState = null;
  try { if (localStorage.getItem('erduo-motion') === 'paused') paused = true; } catch (_) { /* Preference storage is optional. */ }

  function closeMenu() {
    menu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('open', open);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  function manageHeroVideo() {
    const shouldPlay = !paused && !document.hidden && heroOnScreen && !heroFailed && !navigator.connection?.saveData;
    if (lastVideoState === shouldPlay) return;
    lastVideoState = shouldPlay;
    if (shouldPlay) {
      if (!heroVideo.getAttribute('src')) heroVideo.src = heroVideo.dataset.src;
      heroVideo.play().then(() => heroVideo.classList.add('ready')).catch(() => {
        heroVideo.classList.remove('ready');
      });
    } else {
      heroVideo.pause();
      if (paused) heroVideo.classList.remove('ready');
    }
  }
  heroVideo.addEventListener('error', () => {
    heroFailed = true;
    heroVideo.classList.remove('ready');
  });
  document.addEventListener('visibilitychange', manageHeroVideo);

  function measure() {
    work.classList.toggle('enhanced', !paused && desktop.matches);
    maxX = Math.max(0, track.scrollWidth - viewport.clientWidth);
    travel = maxX * .9;
    work.style.setProperty('--work-height', (window.innerHeight + travel) + 'px');
    workStart = work.getBoundingClientRect().top + window.scrollY;
    render();
  }
  function render() {
    frame = 0;
    const y = window.scrollY;
    const h = window.innerHeight;
    header.classList.toggle('scrolled', y > 30);
    if (!paused && desktop.matches) {
      // Enhanced work uses the page scroll only; native scrolling can remain
      // after a motion/breakpoint switch or when a project receives focus.
      if (viewport.scrollLeft) viewport.scrollLeft = 0;
      const t = clamp((y - intro.offsetTop) / h);
      const phase = t * t * (3 - 2 * t);
      const fade = 1 - clamp(t / .43);
      heroIntro.style.opacity = String(fade);
      heroRole.style.opacity = String(fade);
      heroBottom.style.opacity = String(fade);
      heroIntro.style.transform = 'translateY(' + (-20 - phase * 50) + '%)';
      heroRole.style.transform = 'translateY(' + (-15 - phase * 50) + '%)';
      avatar.style.transform = 'translateX(calc(-50% - ' + (phase * 25) + 'vw)) scale(' + (1 - phase * .08) + ')';
      const show = clamp((t - .25) / .52);
      about.style.opacity = String(show);
      about.style.transform = 'translateY(' + (-35 - show * 12) + '%)';
      about.style.pointerEvents = show > .65 ? 'auto' : 'none';
      about.toggleAttribute('inert', show < .65);
      workFraction = travel ? clamp((y - workStart) / travel) : 0;
      track.style.transform = 'translate3d(' + (-maxX * workFraction) + 'px,0,0)';
    } else {
      workFraction = maxX ? viewport.scrollLeft / maxX : 0;
    }
    const index = Math.min(cards.length - 1, Math.round(workFraction * (cards.length - 1)));
    progress.style.transform = 'translateX(' + (workFraction * 500) + '%)';
    counter.textContent = String(index + 1).padStart(2, '0') + ' / 06';
    prev.disabled = workFraction <= .001;
    next.disabled = workFraction >= .999;
    heroOnScreen = y < intro.offsetTop + intro.offsetHeight && y + h > intro.offsetTop;
    manageHeroVideo();
  }
  function requestRender() {
    if (!frame) frame = requestAnimationFrame(render);
  }
  window.addEventListener('scroll', requestRender, { passive: true });
  viewport.addEventListener('scroll', requestRender, { passive: true });
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(measure, 120);
  });

  function applyMotion() {
    root.classList.toggle('motion-enabled', !paused);
    root.classList.toggle('motion-paused', paused);
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.setAttribute('aria-label', paused ? '开启页面动效' : '暂停页面动效');
    motionButton.querySelector('.motion-symbol').textContent = paused ? '▷' : 'Ⅱ';
    motionButton.querySelector('.motion-label').textContent = paused ? '开启动效' : '暂停动效';
    [heroIntro, heroRole, heroBottom, avatar, about, track].forEach(element => {
      element.style.removeProperty('transform');
      element.style.removeProperty('opacity');
      element.style.removeProperty('pointer-events');
    });
    about.removeAttribute('inert');
    lastVideoState = null;
    measure();
  }
  motionButton.addEventListener('click', () => {
    const section = [...document.querySelectorAll('main > section')].filter(el => el.getBoundingClientRect().top < window.innerHeight * .6).pop();
    paused = !paused;
    try { localStorage.setItem('erduo-motion', paused ? 'paused' : 'playing'); } catch (_) { /* Optional persistence. */ }
    applyMotion();
    if (section && section !== intro) window.scrollTo({ top: section.offsetTop, behavior: 'instant' });
  });
  reduced.addEventListener('change', () => { paused = reduced.matches; applyMotion(); });
  desktop.addEventListener('change', applyMotion);

  function anchorY(id) {
    if (id === 'about' && !paused && desktop.matches) return intro.offsetTop + window.innerHeight * .92;
    if (id === 'work' && !paused && desktop.matches) return work.offsetTop;
    const target = document.getElementById(id);
    return target ? target.getBoundingClientRect().top + window.scrollY - (id === 'top' ? 0 : 80) : null;
  }
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
      const id = anchor.getAttribute('href').slice(1);
      const top = anchorY(id);
      if (top === null) return;
      event.preventDefault();
      closeMenu();
      const isSkipLink = anchor.classList.contains('skip-link');
      window.scrollTo({ top, behavior: paused || isSkipLink ? 'instant' : 'smooth' });
      if (isSkipLink) {
        // Finish the about reveal before focusing it: the enhanced intro
        // otherwise keeps this target inert while it is off screen.
        render();
        const target = document.getElementById(id);
        if (!target.hasAttribute('tabindex')) {
          target.setAttribute('tabindex', '-1');
          target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
        }
        target.focus({ preventScroll: true });
      }
      history.replaceState(null, '', '#' + id);
    });
  });

  function moveWork(direction) {
    const index = clamp(Math.round(workFraction * (cards.length - 1)) + direction, 0, cards.length - 1);
    const fraction = index / (cards.length - 1);
    if (!paused && desktop.matches) window.scrollTo({ top: workStart + travel * fraction, behavior: 'smooth' });
    else viewport.scrollTo({ left: maxX * fraction, behavior: paused ? 'instant' : 'smooth' });
  }
  prev.addEventListener('click', () => moveWork(-1));
  next.addEventListener('click', () => moveWork(1));
  viewport.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      moveWork(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  // A focused offscreen project is brought into view for keyboard navigation.
  track.addEventListener('focusin', event => {
    const card = event.target.closest('.work-card');
    if (!card || paused || !desktop.matches) return;
    const rect = card.getBoundingClientRect();
    if (rect.left < 70 || rect.right > window.innerWidth - 30) {
      const fraction = clamp((card.offsetLeft - 120) / Math.max(1, maxX));
      window.scrollTo({ top: workStart + travel * fraction, behavior: 'instant' });
    }
  });
  document.querySelectorAll('.service').forEach(detail => {
    detail.addEventListener('toggle', () => {
      if (!detail.open) return;
      document.querySelectorAll('.service[open]').forEach(other => { if (other !== detail) other.open = false; });
      measure();
    });
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .1 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  const cursor = document.querySelector('.cursor');
  document.addEventListener('pointermove', event => {
    if (!finePointer.matches || paused) return;
    cursorX = event.clientX;
    cursorY = event.clientY;
    cursor.style.transform = 'translate3d(' + cursorX + 'px,' + cursorY + 'px,0)';
    cursor.style.opacity = '1';
    if (heroOnScreen) {
      avatar.style.setProperty('--pointer-x', ((event.clientX / window.innerWidth - .5) * 12) + 'px');
      avatar.style.setProperty('--pointer-y', ((event.clientY / window.innerHeight - .5) * 8) + 'px');
    }
  }, { passive: true });
  document.addEventListener('pointerover', event => {
    const active = event.target.closest('a,button,summary');
    cursor.classList.toggle('active', !!active);
    cursor.textContent = active?.dataset.cursor || '';
  });
  document.addEventListener('pointerleave', () => { cursor.style.opacity = '0'; });

  const dialog = document.querySelector('.video-dialog');
  const player = dialog.querySelector('video');
  let videoTrigger = null;
  const closeVideo = () => dialog.close();
  document.querySelectorAll('[data-video]').forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      videoTrigger = button;
      dialog.querySelector('h2').textContent = button.dataset.title;
      player.src = button.dataset.video;
      player.poster = button.querySelector('img').src;
      dialog.showModal();
      document.body.style.overflow = 'hidden';
      heroVideo.pause();
      player.play().catch(() => { /* Native controls remain available if autoplay is blocked. */ });
    });
  });
  dialog.querySelector('.close-video').addEventListener('click', closeVideo);
  dialog.addEventListener('click', event => { if (event.target === dialog) closeVideo(); });
  dialog.addEventListener('close', () => {
    player.pause();
    player.removeAttribute('src');
    player.load();
    document.body.style.removeProperty('overflow');
    lastVideoState = null;
    manageHeroVideo();
    if (videoTrigger) videoTrigger.focus({ preventScroll: true });
  });
  document.querySelector('[data-copy-email]').addEventListener('click', async () => {
    const status = document.querySelector('.copy-status');
    try {
      await navigator.clipboard.writeText('erduo1998@gmail.com');
      status.textContent = '邮箱已复制，期待你的来信。';
    } catch (_) {
      status.textContent = '可选中上方邮箱复制，或直接点击发送邮件。';
    }
  });

  applyMotion();
  document.fonts.ready.then(measure);
  window.addEventListener('load', () => {
    measure();
    if (location.hash) {
      const top = anchorY(location.hash.slice(1));
      if (top !== null) window.scrollTo({ top, behavior: 'instant' });
    }
  }, { once: true });
})();
