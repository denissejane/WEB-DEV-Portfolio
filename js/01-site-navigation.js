/* js/01-site-navigation.js: site navigation behavior for the portfolio. */

function initThemeToggle() {
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const themeIcon = document.querySelector('.theme-icon');
  const savedTheme = localStorage.getItem('dens-world-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (!themeButton || !themeIcon) return;

  function setTheme(theme) {
    const isDark = theme === 'dark';
    root.dataset.theme = theme;
    themeIcon.textContent = isDark ? '☀' : '☾';
    themeButton.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
    themeButton.title = `Switch to ${isDark ? 'light' : 'dark'} mode`;
  }

  // Start with the saved choice, or match the visitor's device setting.
  setTheme(savedTheme || (systemPrefersDark ? 'dark' : 'light'));

  themeButton.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('dens-world-theme', nextTheme);
  });
}


/* ================================================================
   CHECKPOINT NAVIGATION
   ================================================================ */

function initCheckpointNavigation() {
  const navLinks = [...document.querySelectorAll('[data-nav]')];
  const observedSections = [...document.querySelectorAll('#home, [data-checkpoint]')];

  if (!navLinks.length) return;

  function setActiveCheckpoint(id) {
    navLinks.forEach((link) => {
      const isActive = link.dataset.nav === id;
      link.classList.toggle('is-active', isActive);

      if (isActive) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  // Keep the navigation highlight in sync while scrolling.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visibleSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

      if (visibleSection) setActiveCheckpoint(visibleSection.target.id);
    }, {
      rootMargin: '-25% 0px -35% 0px',
      threshold: [0, 0.15, 0.35, 0.6]
    });

    observedSections.forEach((section) => observer.observe(section));
  }

  // Jump links still update the selected tab in browsers without IntersectionObserver.
  navLinks.forEach((link) => {
    link.addEventListener('click', () => setActiveCheckpoint(link.dataset.nav));
  });
}


/* ================================================================
   ISLAND CONNECTION PATH
   ================================================================ */

function initIslandTrail() {
  const main = document.querySelector('main');
  const trail = document.querySelector('.pathway');
  const trailLayers = [...document.querySelectorAll('.trail-glow, .trail-base, .trail-center')];
  const islandScenes = [
    document.querySelector('.hero-island'),
    ...document.querySelectorAll('.island-scene')
  ].filter(Boolean);

  if (!main || !trail || islandScenes.length < 2) return;

  function drawIslandTrail() {
    trail.style.width = `${main.clientWidth}px`;
    trail.style.height = `${main.scrollHeight}px`;

    const trailBox = trail.getBoundingClientRect();
    const width = trailBox.width;
    const height = trailBox.height;

    if (!width || !height) return;
    trail.setAttribute('viewBox', `0 0 ${width} ${height}`);

    const islands = islandScenes.map((scene) => {
      const box = scene.getBoundingClientRect();

      return {
        x: box.left - trailBox.left + box.width / 2,
        y: box.top - trailBox.top + box.height / 2,
        halfWidth: box.width / 2,
        halfHeight: box.height / 2,
        isHome: scene.classList.contains('hero-island')
      };
    });

    let route = '';

    // Each curve starts and ends at an island edge, leaving the cards clear.
    for (let index = 0; index < islands.length - 1; index += 1) {
      const fromIsland = islands[index];
      const toIsland = islands[index + 1];
      const direction = Math.sign(toIsland.x - fromIsland.x) || 1;
      const start = fromIsland.isHome
        ? { x: fromIsland.x - fromIsland.halfWidth * 0.12, y: fromIsland.y + fromIsland.halfHeight + 1 }
        : { x: fromIsland.x + direction * (fromIsland.halfWidth - 2), y: fromIsland.y };
      const end = fromIsland.isHome
        ? { x: toIsland.x, y: toIsland.y - toIsland.halfHeight + 2 }
        : { x: toIsland.x - direction * (toIsland.halfWidth - 2), y: toIsland.y };
      const middle = { x: width / 2, y: (start.y + end.y) / 2 };
      const sway = index % 2 === 0 ? 20 : -20;
      const firstControlX = start.x + (middle.x - start.x) * 0.58;
      const lastControlX = end.x + (middle.x - end.x) * 0.58;
      const distanceY = end.y - start.y;

      route += `M ${start.x} ${start.y} C ${firstControlX} ${start.y + distanceY * 0.2}, ${middle.x - sway} ${middle.y - distanceY * 0.14}, ${middle.x} ${middle.y} C ${middle.x + sway} ${middle.y + distanceY * 0.14}, ${lastControlX} ${end.y - distanceY * 0.2}, ${end.x} ${end.y} `;
    }

    trailLayers.forEach((path) => path.setAttribute('d', route.trim()));
  }

  const scheduleTrailDraw = () => window.requestAnimationFrame(drawIslandTrail);
  scheduleTrailDraw();
  window.addEventListener('resize', scheduleTrailDraw, { passive: true });

  if ('ResizeObserver' in window) {
    const trailObserver = new ResizeObserver(scheduleTrailDraw);
    trailObserver.observe(main);
    islandScenes.forEach((scene) => trailObserver.observe(scene));
  }
}


/* ================================================================
   VISITOR FLOWER GARDEN
   ================================================================ */

function initEntryLoader() {
  const loader = document.querySelector('.entry-loader');
  if (!loader) return;
  const dismiss = () => {
    loader.classList.add('is-gone');
    document.body.classList.remove('is-loading');
  };
  document.body.classList.add('is-loading');
  window.addEventListener('load', () => window.setTimeout(dismiss, 1100), { once: true });
  window.setTimeout(dismiss, 2600);
}

function initSingleOpenSections() {
  document.querySelectorAll('.checkpoint').forEach((checkpoint) => {
    const folds = checkpoint.id === 'checkpoint-4' ? [] : [...checkpoint.querySelectorAll(':scope > .checkpoint-card > details.fold:not(.always-open)')];
    folds.forEach((fold) => fold.addEventListener('toggle', () => {
      if (!fold.open) return;
      folds.forEach((other) => { if (other !== fold && !other.classList.contains('always-open')) other.open = false; });
    }));
  });
  const about = document.querySelector('#checkpoint-1 .checkpoint-card');
  if (about) {
    const sections = [...about.querySelectorAll(':scope > details.fold')];
    const byTitle = (word) => sections.find((item) => item.querySelector('.fold-title')?.textContent.trim().toLowerCase().includes(word));
    const education = byTitle('education'), skills = byTitle('skills'), loves = byTitle('enjoy');
    const intro = about.querySelector('.about-top');
    if (education && skills && loves && intro) {
      education.classList.add('education-fold');
      loves.classList.add('enjoyment-fold');
      [education, loves].forEach((item) => { item.open = true; item.classList.add('always-open'); });
      skills.open = true;
      about.querySelector('.card-head').after(intro, education, skills, loves);
    }
  }
  const contact = document.querySelector('#checkpoint-5 .checkpoint-card');
  if (contact) contact.querySelectorAll('details.fold').forEach((fold) => { fold.open = true; fold.classList.add('always-open'); });
}

function initCheckpointFocus() {
  const sections = [...document.querySelectorAll('#home, [data-checkpoint]')];
  const links = [...document.querySelectorAll('.journey-rail a')];
  if (!sections.length) return;
  let queued = false;
  const update = () => {
    queued = false;
    const focusY = window.innerHeight * .48;
    const active = sections.map((section) => ({ section, rect: section.getBoundingClientRect() }))
      .filter(({ rect }) => rect.bottom > 0 && rect.top < window.innerHeight)
      .sort((a, b) => Math.abs((a.rect.top + a.rect.bottom) / 2 - focusY) - Math.abs((b.rect.top + b.rect.bottom) / 2 - focusY))[0]?.section;
    sections.filter((section) => section.matches('[data-checkpoint]')).forEach((section) => section.classList.toggle('is-current', section === active));
    links.forEach((link) => link.classList.toggle('is-active', link.hash === `#${active?.id}`));
  };
  const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  update();
}
