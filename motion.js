(() => {
  'use strict';
  const root = document.documentElement;
  const fine = matchMedia('(pointer: fine)');
  const wide = matchMedia('(min-width: 1025px)');
  const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
  const moving = () => !root.classList.contains('motion-paused');
  const intro = document.querySelector('.intro');
  const cursor = document.querySelector('.cursor');
  const avatar = document.querySelector('[data-avatar-control]');
  const timeline = document.querySelector('.timeline');
  let pointer = { x: innerWidth / 2, y: innerHeight / 2, seen: false };
  let cursorX = pointer.x, cursorY = pointer.y;
  let scrollTarget = scrollY, smoothScrolling = false, modal = false;
  let dragAvatar = null, lookX = 0, lookY = 0, targetX = 0, targetY = 0;
  let magnetic = null, magnetX = 0, magnetY = 0;

  // Split visual text without changing its accessible name or line breaks.
  function splitText(element) {
    if (element.dataset.split) return;
    element.dataset.split = 'true';
    element.classList.add('motion-title');
    element.setAttribute('aria-label', element.textContent.trim());
    let index = 0;
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const fragment = document.createDocumentFragment();
      const parts = node.textContent.split(/(\s+|(?=[\p{Script=Han}])|(?<=[\p{Script=Han}]))/u);
      for (const word of parts) {
        if (!word || /^\s+$/.test(word)) { fragment.append(word); continue; }
        const mask = document.createElement('span');
        mask.className = 'word-mask';
        mask.setAttribute('aria-hidden', 'true');
        for (const char of [...word]) {
          const glyph = document.createElement('span');
          glyph.className = 'glyph'; glyph.textContent = char;
          glyph.style.setProperty('--glyph-delay', Math.min(index++ * 25, 600) + 'ms');
          mask.append(glyph);
        }
        fragment.append(mask);
      }
      node.replaceWith(fragment);
    }
  }
  document.querySelectorAll('.hero-intro .hello,.hero-name,.hero-role>.hello,.about-copy h2,.english-heading,.section-heading h2,.work-heading h2,.knowledge-copy h2,.method-title,.contact-hero h2').forEach(splitText);
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) entry.target.classList.add('visible', 'in-view');
      else if (entry.boundingClientRect.top > innerHeight * .9) entry.target.classList.remove('visible', 'in-view');
    }
  }, { threshold: .12 });
  document.querySelectorAll('.reveal,.motion-title').forEach(el => observer.observe(el));
  document.fonts.ready.then(() => root.classList.add('motion-started'));

  const roleLayers = [document.querySelector('.role-echo'), document.querySelector('.role-window')];
  const rolePairs = [['DIRECTOR', 'CREATOR'], ['CREATOR', 'BUILDER'], ['BUILDER', 'DIRECTOR']];
  let roleIndex = 0;
  function roleWord(word) {
    const el = document.createElement('span'); el.className = 'role-word';
    [...word].forEach((letter, i) => {
      const span = document.createElement('span'); span.className = 'role-letter';
      span.textContent = letter; span.style.setProperty('--letter-index', i); el.append(span);
    });
    return el;
  }
  roleLayers.forEach((layer, i) => layer.replaceChildren(roleWord(rolePairs[0][i])));
  function cycleRoles() {
    if (moving() && !document.hidden && intro.getBoundingClientRect().bottom > 0 && scrollY < innerHeight * .6) {
      roleIndex = (roleIndex + 1) % rolePairs.length;
      roleLayers.forEach((layer, layerIndex) => {
        const old = layer.querySelector('.role-word');
        const next = roleWord(rolePairs[roleIndex][layerIndex]);
        next.classList.add('role-incoming'); layer.append(next);
        const outLetters = [...old.children], inLetters = [...next.children];
        outLetters.forEach((el, i) => el.animate([{transform:'translateY(0)'},{transform:'translateY(-115%)'}], {duration:850,delay:i*65,easing:'cubic-bezier(.76,0,.24,1)',fill:'forwards'}));
        const animations = inLetters.map((el, i) => el.animate([{transform:'translateY(115%)'},{transform:'translateY(0)'}], {duration:950,delay:i*65,easing:'cubic-bezier(.76,0,.24,1)',fill:'both'}));
        Promise.all(animations.map(a => a.finished.catch(() => {}))).then(() => { old.remove(); next.classList.remove('role-incoming'); animations.forEach(a => a.cancel()); });
      });
    }
    setTimeout(cycleRoles, 4400);
  }
  setTimeout(cycleRoles, 4200);

  // A real pose sequence gives the portrait a directional head turn.
  const poseCanvas = document.querySelector('.avatar-poses');
  let context = null;
  try { context = poseCanvas?.getContext('2d', {alpha: false}); } catch (_) { /* Keep the image/video fallback when Canvas is unavailable. */ }
  const atlas = new Image();
  let poseReady = false, poseFrame = -1, atlasLoading = false, poseFailed = false;
  let lastPointerTime = performance.now(), blinkTime = 0, nextBlink = performance.now() + 5500;
  const POSES = 36, COLUMNS = 6, TILE = 640;
  function failPoses() {
    const wasReady = poseReady;
    poseReady = false; poseFailed = true; poseFrame = -1;
    root.classList.remove('poses-ready');
    // The existing listener reads the class to select the image/video fallback.
    if (wasReady) document.dispatchEvent(new Event('avatar-poses-ready'));
  }
  function drawPose(index) {
    if (!context) return false;
    try {
      context.drawImage(atlas,(index%COLUMNS)*TILE,Math.floor(index/COLUMNS)*TILE,TILE,TILE,0,0,TILE,TILE);
      poseFrame = index; avatar.dataset.pose = String(index);
      return true;
    } catch (_) { failPoses(); return false; }
  }
  function loadPoses() {
    if (!context || poseFailed || atlasLoading || !moving() || !fine.matches || navigator.connection?.saveData) return;
    atlasLoading = true;
    atlas.onload = () => {
      if (atlas.naturalWidth !== COLUMNS * TILE || atlas.naturalHeight < Math.ceil((POSES + 6) / COLUMNS) * TILE) { failPoses(); return; }
      if (!drawPose(Math.round((POSES - 1) / 2))) return;
      poseReady = true; root.classList.add('poses-ready');
      document.dispatchEvent(new Event('avatar-poses-ready'));
    };
    atlas.onerror = failPoses;
    atlas.src = '/assets/portfolio/erduo-look-atlas.webp?v=20260907-2';
  }
  loadPoses();
  fine.addEventListener('change', loadPoses);
  function setPointer(event) {
    pointer = {x: event.clientX, y: event.clientY, seen: true};
    lastPointerTime = performance.now();
    if (!dragAvatar) {
      targetX = clamp((event.clientX / innerWidth - .5) * 2, -1, 1);
      targetY = clamp((event.clientY / innerHeight - .5) * 2, -1, 1);
    }
  }
  document.addEventListener('pointermove', setPointer, {passive:true});
  document.addEventListener('pointerover', event => {
    if (!fine.matches) return;
    const active = event.target.closest('a,button,summary');
    cursor.classList.toggle('active', !!active);
    cursor.classList.toggle('over-avatar', !!event.target.closest('[data-avatar-control]'));
    cursor.textContent = active?.dataset.cursor || '';
    const nextMagnetic = event.target.closest('.social-rail a');
    if (magnetic !== nextMagnetic) {
      if (magnetic) magnetic.style.removeProperty('transform');
      magnetic = nextMagnetic; magnetX = 0; magnetY = 0;
    }
  });
  document.addEventListener('pointerleave', () => { pointer.seen = false; targetX = targetY = 0; });
  avatar.addEventListener('pointerdown', event => {
    if (!moving() || event.button !== 0) return;
    dragAvatar = {x:event.clientX, look:targetX};
    avatar.setPointerCapture(event.pointerId); avatar.classList.add('dragging');
    smoothScrolling = false;
  });
  avatar.addEventListener('pointermove', event => {
    if (!dragAvatar) return;
    targetX = clamp(dragAvatar.look + (event.clientX - dragAvatar.x) / (innerWidth * .25), -1, 1);
    targetY = clamp((event.clientY / innerHeight - .5) * 2, -1, 1);
  });
  function releaseAvatar() { dragAvatar = null; avatar.classList.remove('dragging'); }
  avatar.addEventListener('pointerup', releaseAvatar);
  avatar.addEventListener('pointercancel', releaseAvatar);
  avatar.addEventListener('lostpointercapture', releaseAvatar);

  // Native details remain available without JS; enhanced details animate on
  // hover, focus and click, with one expanded service at a time.
  const services = [...document.querySelectorAll('.service')];
  const serviceAnimations = new Map();
  function expandService(detail, expanded) {
    const start = detail.getBoundingClientRect().height;
    const previous = serviceAnimations.get(detail);
    if (previous) { previous.onfinish = null; previous.cancel(); }
    detail.dataset.expanded = String(expanded);
    detail.classList.toggle('is-expanded', expanded);
    const summary = detail.querySelector('summary');
    summary.setAttribute('aria-expanded', String(expanded));
    detail.open = true;
    detail.style.height = '';
    const end = expanded ? detail.getBoundingClientRect().height : summary.getBoundingClientRect().height + 2;
    if (!moving()) { detail.open = expanded; detail.style.height = ''; return; }
    detail.style.overflow = 'hidden';
    const animation = detail.animate({height:[start+'px',end+'px']}, {duration:500,easing:'cubic-bezier(.4,0,.2,1)',fill:'both'});
    serviceAnimations.set(detail, animation);
    animation.onfinish = () => {
      detail.open = expanded; detail.style.height = ''; detail.style.overflow = '';
      animation.cancel(); serviceAnimations.delete(detail);
      window.dispatchEvent(new Event('portfolio-layout'));
    };
  }
  function selectService(detail, force = true) {
    const expanded = force || detail.dataset.expanded !== 'true';
    services.forEach(other => {
      const next = other === detail && expanded;
      if ((other.dataset.expanded === 'true') !== next) expandService(other, next);
    });
  }
  services.forEach(detail => {
    detail.dataset.expanded = String(detail.open);
    detail.classList.toggle('is-expanded', detail.open);
    detail.querySelector('summary').addEventListener('click', event => {event.preventDefault();selectService(detail,false);});
    detail.addEventListener('pointerenter', event => {if(fine.matches && event.pointerType !== 'touch')selectService(detail);});

  });

  // Wheel easing follows real input. Keyboard, scrollbar and touch retain
  // native control, and nested dialogs/scroll areas are not intercepted.
  document.addEventListener('wheel', event => {
    if (!moving() || !wide.matches || !fine.matches || modal || event.ctrlKey || event.metaKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    if (event.target.closest('dialog,textarea,input,select')) return;
    if (!event.deltaY) return;
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
    if (!smoothScrolling) scrollTarget = scrollY;
    scrollTarget = clamp(scrollTarget + delta, 0, document.documentElement.scrollHeight - innerHeight);
    smoothScrolling = true;
    event.preventDefault();
  }, {passive:false});
  document.addEventListener('keydown', () => {smoothScrolling = false;});
  document.addEventListener('pointerdown', () => {smoothScrolling = false;}, {passive:true});
  document.querySelectorAll('a[href^="#"],.work-controls button').forEach(el => el.addEventListener('click', () => {smoothScrolling = false;}));
  document.addEventListener('portfolio-modal', event => {modal=event.detail;smoothScrolling=false;});

  // Drag anywhere in the work strip to scrub the pinned exhibition. A drag
  // threshold preserves ordinary links and click-to-play videos.
  const workViewport = document.querySelector('.work-viewport');
  const work = document.querySelector('.work');
  let workDrag = null, suppressWorkClick = false;
  workViewport.addEventListener('pointerdown', event => {
    if (event.button !== 0 || !fine.matches) return;
    workDrag = {x:event.clientX,y:scrollY,left:workViewport.scrollLeft,active:false,target:event.target};
  });
  workViewport.addEventListener('pointermove', event => {
    if (!workDrag) return;
    const dx = event.clientX - workDrag.x;
    if (!workDrag.active && Math.abs(dx) < 7) return;
    if (!workDrag.active) { workDrag.active=true; workViewport.setPointerCapture(event.pointerId);workViewport.classList.add('dragging'); }
    suppressWorkClick = true;
    if (work.classList.contains('enhanced')) {
      const maxX = document.querySelector('.work-track').scrollWidth - workViewport.clientWidth;
      const travel = work.offsetHeight - innerHeight;
      window.scrollTo({top:clamp(workDrag.y-dx*(travel/Math.max(1,maxX)),work.offsetTop,work.offsetTop+travel),behavior:'instant'});
    } else workViewport.scrollLeft=workDrag.left-dx;
  });
  function releaseWork() {workDrag=null;workViewport.classList.remove('dragging');setTimeout(()=>{suppressWorkClick=false;},0);}
  workViewport.addEventListener('pointerup',releaseWork);
  workViewport.addEventListener('pointercancel',releaseWork);
  workViewport.addEventListener('lostpointercapture',releaseWork);
  workViewport.addEventListener('click',event=>{if(suppressWorkClick){event.preventDefault();event.stopImmediatePropagation();}},true);
  workViewport.addEventListener('dragstart',event=>event.preventDefault());

  const deskVideos = [...document.querySelectorAll('[data-desk-video]')];
  const deskState = new WeakMap();
  const mobileDeskImage = document.querySelector('.services-visual>img');
  const mobileDeskVideo = document.querySelector('.mobile-workstation-video');
  function alignMobileDesk() {
    if (!mobileDeskImage || !mobileDeskVideo || wide.matches) return;
    const r=mobileDeskImage.getBoundingClientRect(), parent=mobileDeskImage.parentElement.getBoundingClientRect();
    Object.assign(mobileDeskVideo.style,{left:(r.left-parent.left)+'px',top:(r.top-parent.top)+'px',width:r.width+'px',height:r.height+'px'});
  }
  mobileDeskImage.addEventListener('load',alignMobileDesk);
  window.addEventListener('resize',alignMobileDesk);
  document.fonts.ready.then(alignMobileDesk);
  function updateDeskVideos() {
    const phase=Number(intro.dataset.phase || 0);
    const r=mobileDeskImage.getBoundingClientRect();
    for(const video of deskVideos){
      const mobile=video===mobileDeskVideo;
      const onScreen=mobile ? !wide.matches && r.bottom>0 && r.top<innerHeight : wide.matches && phase>1.25 && intro.getBoundingClientRect().bottom>0;
      if (!moving()) {
        if (!video.paused) video.pause();
        video.classList.remove('ready');
        deskState.set(video, false);
        continue;
      }
      const playing=onScreen && moving() && !document.hidden && !modal && !navigator.connection?.saveData;
      if(deskState.get(video)===playing)continue;
      deskState.set(video,playing);
      if(playing){if(!video.src)video.src=video.dataset.src;video.play().then(()=>video.classList.add('ready')).catch(()=>{});}
      else {video.pause();if(!moving())video.classList.remove('ready');}
    }
  }
  document.addEventListener('visibilitychange', updateDeskVideos);
  document.addEventListener('portfolio-modal', updateDeskVideos);
  let lastTime = 0;
  function tick(time) {
    const dt = Math.min((time-lastTime)/1000 || 1/60,.05);lastTime=time;
    if (moving() && !document.hidden) {
      if (smoothScrolling) {
        const difference = scrollTarget-scrollY;
        if (Math.abs(difference)<.8) {window.scrollTo({top:scrollTarget,behavior:'instant'});smoothScrolling=false;}
        else window.scrollTo({top:scrollY+difference*(1-Math.exp(-dt*11)),behavior:'instant'});
      }
      if (fine.matches && pointer.seen) {
        const ease = 1-Math.exp(-dt*10);
        cursorX+=(pointer.x-cursorX)*ease;cursorY+=(pointer.y-cursorY)*ease;
        cursor.style.transform=`translate3d(${cursorX}px,${cursorY}px,0)`;
        cursor.style.opacity='1';
        if(magnetic){
          const r=magnetic.getBoundingClientRect();
          magnetX+=(clamp(pointer.x-r.left-r.width/2,-24,24)-magnetX)*.13;
          magnetY+=(clamp(pointer.y-r.top-r.height/2,-24,24)-magnetY)*.13;
          magnetic.style.transform=`translate(${magnetX}px,${magnetY}px)`;
        }
      } else cursor.style.opacity='0';
      const phase = Number(intro.dataset.phase || 0);
      if (intro.getBoundingClientRect().bottom>0 && !modal) {
        const yaw = wide.matches && phase>.25 ? .65 : targetX;
        const pitch = wide.matches && phase>.25 ? .15 : targetY;
        lookX+=(yaw-lookX)*(1-Math.exp(-dt*10));lookY+=(pitch-lookY)*(1-Math.exp(-dt*8));
        avatar.style.setProperty('--look-pitch',(lookY*-3.5)+'deg');
        avatar.style.setProperty('--look-roll',(lookX*-1.2)+'deg');
        avatar.dataset.lookX=lookX.toFixed(3);avatar.dataset.lookY=lookY.toFixed(3);
        if(poseReady){
          let index=Math.round(clamp((lookX+1)/2)*(POSES-1));
          if (Math.abs(lookX)<.2 && time-lastPointerTime>1300 && time>nextBlink && !blinkTime) blinkTime=time;
          if (blinkTime) {
            const b=Math.floor((time-blinkTime)/45);
            if (b<6 && Math.abs(lookX)<.2) index=POSES+b;
            else {blinkTime=0;nextBlink=time+5200;}
          }
          if(index!==poseFrame) drawPose(index);
        }
      }
      if(timeline){
        const r=timeline.getBoundingClientRect();
        const fraction=clamp((innerHeight*.65-r.top)/Math.max(1,r.height));
        timeline.style.setProperty('--timeline-progress',fraction);
      }
    } else {smoothScrolling=false;cursor.style.opacity='0';}
    updateDeskVideos();
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  new MutationObserver(() => {
    if(moving())loadPoses();
    else {
      targetX=targetY=0;avatar.style.removeProperty('--look-pitch');avatar.style.removeProperty('--look-roll');
      document.getAnimations().forEach(animation => {
        if (animation.effect?.target?.closest('.role-stack,.service')) { try { animation.finish(); } catch (_) { /* Infinite CSS decorations are paused by the stylesheet. */ } }
      });
    }
    updateDeskVideos();
  }).observe(root,{attributes:true,attributeFilter:['class']});
  root.classList.add('motion-ready');
})();
