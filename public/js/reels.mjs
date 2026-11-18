export function setupReels(section) {
  if (!section) return;
  const track = section.querySelector('[data-reel-track]');
  const slides = [...track.querySelectorAll('[data-reel-slide]')];
  const videos = slides.map(slide => slide.querySelector('video'));
  const choices = [...section.querySelectorAll('[data-reel-select]')];
  const steps = [...section.querySelectorAll('[data-reel-step]')];
  const number = section.querySelector('[data-reel-number]');
  const status = section.querySelector('[data-reel-status]');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const pausedByCarousel = new WeakSet();
  const pausedByVisitor = new WeakSet();
  let active = 0;
  let target = null;
  let moving = false;
  let visibleRatio = 0;
  let settleTimer;

  const clamp = index => Math.max(0, Math.min(slides.length - 1, index));

  function pause(video) {
    if (video.paused) return;
    pausedByCarousel.add(video);
    video.pause();
  }

  function syncPlayback() {
    const video = videos[active];
    if (document.hidden || visibleRatio < 0.2) {
      pause(video);
      return;
    }
    // A higher threshold to start than to pause avoids flicker at the viewport edge.
    if (visibleRatio < 0.55 || moving || reducedMotion.matches || navigator.connection?.saveData) return;
    if (video.paused && !video.ended && !pausedByVisitor.has(video)) {
      video.play().catch(() => { /* Native controls remain available if autoplay is blocked. */ });
    }
  }

  function showSelection() {
    for (const [index, slide] of slides.entries()) slide.inert = index !== active;
    for (const [index, choice] of choices.entries()) choice.setAttribute('aria-pressed', String(index === active));
    for (const step of steps) {
      const next = active + Number(step.dataset.reelStep);
      step.setAttribute('aria-disabled', String(next !== clamp(next)));
    }
    number.textContent = String(active + 1).padStart(2, '0');
    status.textContent = `Reel ${active + 1} of ${slides.length}: ${slides[active].dataset.reelTitle}`;
  }

  function settlePosition() {
    clearTimeout(settleTimer);
    const next = clamp(Math.round(track.scrollLeft / (track.clientWidth || 1)));
    if (next !== active) {
      pause(videos[active]);
      active = next;
      showSelection();
    }
    target = null;
    moving = false;
    syncPlayback();
  }

  function scheduleSettle() {
    clearTimeout(settleTimer);
    settleTimer = setTimeout(settlePosition, 140);
  }

  function goTo(index) {
    if (index !== clamp(index) || index === (target ?? active)) return;
    target = index;
    moving = true;
    pause(videos[active]);
    track.scrollTo({ left: index * track.clientWidth, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    scheduleSettle();
  }

  track.addEventListener('scroll', () => {
    if (!moving && Math.abs(track.scrollLeft - active * track.clientWidth) <= 3) return;
    moving = true;
    pause(videos[active]);
    scheduleSettle();
  }, { passive: true });
  track.addEventListener('scrollend', () => { if (moving) settlePosition(); });
  track.addEventListener('keydown', event => {
    // Arrows on the player itself navigate; arrows in the native video controls still seek.
    if (event.target !== track) return;
    const from = target ?? active;
    const index = { ArrowLeft: from - 1, ArrowRight: from + 1, Home: 0, End: slides.length - 1 }[event.key];
    if (typeof index !== 'number') return;
    event.preventDefault();
    goTo(index);
  });

  for (const [index, choice] of choices.entries()) choice.addEventListener('click', () => goTo(index));
  for (const step of steps) step.addEventListener('click', () => goTo((target ?? active) + Number(step.dataset.reelStep)));
  for (const [index, video] of videos.entries()) {
    video.addEventListener('play', () => {
      if (index !== active || moving || document.hidden) pause(video);
      else pausedByVisitor.delete(video);
    });
    video.addEventListener('pause', () => {
      if (!pausedByCarousel.delete(video) && !video.ended) pausedByVisitor.add(video);
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause(videos[active]);
    else if (typeof IntersectionObserver !== 'undefined') syncPlayback();
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) pause(videos[active]);
    else if (typeof IntersectionObserver !== 'undefined') syncPlayback();
  });
  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver(([entry]) => {
      visibleRatio = entry.intersectionRatio;
      syncPlayback();
    }, { threshold: [0, 0.2, 0.55] });
    observer.observe(track);
  }
  showSelection();
}
