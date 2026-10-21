/* js/05-portfolio-content.js: portfolio content behavior for the portfolio. */

function initContactLinks() {
  const container = document.querySelector('#checkpoint-5 .contact-links');
  if (!container || container.dataset.rebuilt) return;
  const links = [...container.querySelectorAll('a.tile')];
  const details = document.createElement('div'); details.className = 'contact-details';
  const socials = document.createElement('div'); socials.className = 'social-links'; socials.setAttribute('aria-label', 'Social profiles');
  links.forEach((link) => {
    if (link.href.startsWith('mailto:') || link.href.startsWith('tel:')) {
      const label = link.querySelector('small');
      if (link.href.startsWith('mailto:')) {
        const schoolEmail = link.href.includes('iskolarngbayan');
        if (label) label.textContent = schoolEmail ? 'School Email' : 'Personal Email';
        link.classList.add(schoolEmail ? 'email-school' : 'email-personal');
        const icon = link.querySelector('i');
        if (icon) {
          icon.innerHTML = schoolEmail
            ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m2 9 10-5 10 5-10 5L2 9Z"/><path d="M6 11v5c4 2.2 8 2.2 12 0v-5M22 9v6"/></svg>'
            : '<img src="org-icons/gmail.svg" alt="" aria-hidden="true">';
        }
      } else if (label) label.textContent = 'Phone';
      details.append(link);
    }
    else {
      const name = link.querySelector('small')?.textContent.trim() || 'Social profile';
      const icon = name === 'LinkedIn' ? 'in' : name === 'Facebook' ? 'f' : '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.08c-3.1.68-3.76-1.32-3.76-1.32-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 .1 1.66-.76 2.06-1.08.1-.73.39-1.22.71-1.5-2.48-.28-5.1-1.24-5.1-5.52 0-1.22.44-2.22 1.16-3-.12-.29-.5-1.44.11-3 0 0 .95-.3 3.1 1.15a10.8 10.8 0 0 1 5.64 0c2.15-1.45 3.1-1.15 3.1-1.15.62 1.56.23 2.71.12 3 .72.78 1.15 1.78 1.15 3 0 4.3-2.62 5.23-5.12 5.5.4.35.76 1.02.76 2.06v3.04c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z"/></svg>';
      link.classList.add('social-icon', `social-${name.toLowerCase()}`);
      link.setAttribute('aria-label', name); link.title = name;
      link.innerHTML = `<i aria-hidden="true">${icon}</i>`;
      socials.append(link);
    }
  });
  container.replaceChildren(details, socials); container.dataset.rebuilt = 'true';
}

function initMemoryRail() {
  const rail = document.querySelector('#memory-grid');
  if (!rail || rail.dataset.scrollReady) return;
  rail.dataset.scrollReady = 'true'; rail.tabIndex = 0;
  rail.addEventListener('wheel', (event) => {
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) { rail.scrollLeft += event.deltaY; event.preventDefault(); }
  }, { passive:false });
  let dragging = false, startX = 0, initialScroll = 0;
  rail.addEventListener('pointerdown', (event) => { if (event.pointerType === 'touch' || event.button!==0) return; dragging = true; startX = event.clientX; initialScroll = rail.scrollLeft; rail.classList.add('is-dragging'); });
  window.addEventListener('pointermove', (event) => { if (dragging) rail.scrollLeft = initialScroll - (event.clientX - startX); });
  ['pointerup','pointercancel'].forEach((type) => window.addEventListener(type, () => { dragging = false; rail.classList.remove('is-dragging'); }));
  const originals = [...rail.children];
  originals.forEach((tile) => { const clone = tile.cloneNode(true); clone.setAttribute('aria-hidden','true'); clone.tabIndex=-1; clone.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id')); clone.querySelectorAll('a,button,input,select,textarea,summary,[tabindex]').forEach((node)=>node.tabIndex=-1); rail.append(clone); });
  rail.classList.add('is-auto');
  let lastFrame = 0;
  const loopWidth = () => originals.reduce((width, tile) => width + tile.getBoundingClientRect().width, 0) + (parseFloat(getComputedStyle(rail).columnGap) || 0) * originals.length;
  const advance = (time) => {
    if (lastFrame && !dragging) rail.scrollLeft += Math.min(40, time - lastFrame) * .025;
    const width = loopWidth(); if (width > 0 && rail.scrollLeft >= width) rail.scrollLeft -= width;
    lastFrame = time; requestAnimationFrame(advance);
  };
  requestAnimationFrame(advance);
}

function makeMemoryWallAlwaysVisible() {
  const fold = [...document.querySelectorAll('#checkpoint-3 details.fold')].find((item) => item.querySelector('.fold-title')?.textContent.trim().toLowerCase() === 'memory wall');
  if (!fold) return;
  const grid = fold.querySelector('.memory-grid');
  if (grid) {
    grid.setAttribute('aria-label', 'Memory photo gallery');
    grid.replaceChildren(...Array.from({ length: 12 }, (_, index) => {
      const number = index + 1;
      const tile = document.createElement('figure');
      tile.className = `memory-photo${number % 3 === 0 ? ' memory-yellow' : number % 2 ? ' memory-blue' : ''}`;
      const image = document.createElement('img');
      image.src = `photos/${number}.jpg`;
      image.alt = `Memory photo ${number}`;
      image.loading = number <= 4 ? 'eager' : 'lazy';
      image.decoding = 'async';
      tile.append(image);
      return tile;
    }));
    const meta = fold.querySelector('.fold-meta');
    if (meta) meta.textContent = '12 photos';
    const heading = document.createElement('h3'); heading.className = 'memory-wall-title'; heading.textContent = 'MEMORY WALL';
    fold.before(heading, grid); fold.remove();
  }
}

function initPortfolioPhotos() {
  const portrait = document.querySelector('#checkpoint-1 .photo-slot');
  if (portrait) {
    const image = document.createElement('img');
    image.src = 'photos/denisse.jpg';
    image.alt = 'Denisse Jane Karim';
    image.loading = 'eager';
    image.decoding = 'async';
    portrait.replaceChildren(image);
    portrait.setAttribute('aria-label', 'Photo of Denisse Jane Karim');
    portrait.classList.add('has-photo');
  }

  const schoolIcons = [
    [/^Polytechnic University of the Philippines$/i, 'org-icons/pup.jpg'],
    [/^Mataas na Paaralang Neptali A\. Gonzales$/i, 'org-icons/mpnag.jpg']
  ];
  document.querySelectorAll('#checkpoint-1 .fold .org').forEach((item) => {
    const title = item.querySelector('b')?.textContent.trim() || '';
    const icon = schoolIcons.find(([pattern]) => pattern.test(title))?.[1];
    const logo = item.querySelector('.logo');
    if (icon && logo) {
      const image = document.createElement('img');
      image.src = icon;
      image.alt = `${title} seal`;
      image.loading = 'lazy';
      image.decoding = 'async';
      logo.classList.add('image-logo');
      logo.replaceChildren(image);
    }
  });
}

function arrangeAdventures() {
  const card = document.querySelector('#checkpoint-3 .checkpoint-card');
  if (!card) return;
  const sourceFolds = [...card.querySelectorAll(':scope > details.fold')];
  const organized = [], attended = [];
  sourceFolds.forEach((fold) => {
    fold.querySelectorAll('.fold-body .group').forEach((group) => {
      const destination = /organiz/i.test(group.querySelector('h4')?.textContent || '') ? organized : attended;
      group.querySelectorAll('.ev-list > .ev').forEach((event) => destination.push(event));
    });
    fold.remove();
  });
  const monthOrder = { jan:0, feb:1, mar:2, apr:3, may:4, jun:5, jul:6, aug:7, sep:8, oct:9, nov:10, dec:11 };
  const sortEvents = (items) => items.sort((a,b) => {
    const date = (item) => {
      const text = (item.querySelector('em')?.textContent || '').toLowerCase();
      const match=text.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b[^\d]*(20\d{2})/);
      const month=match ? monthOrder[match[1]] : 0;
      const year=Number(match?.[2] || 0);
      return year ? year * 12 + month : -Infinity;
    };
    const priority=(item)=>/hack with the flow|aws build over nights/i.test(item.querySelector('b')?.textContent || '') ? 1 : 0;
    if(priority(b)!==priority(a)) return priority(b)-priority(a);
    return date(b) - date(a);
  });
  const explorer = document.createElement('section'); explorer.className='adventure-explorer';
  const options = document.createElement('div'); options.className='adventure-options'; options.setAttribute('role','tablist'); options.setAttribute('aria-label','Adventure events');
  const panel = document.createElement('div'); panel.className='adventure-panel';
  const content = new Map();
  [['Organized',organized],['Attended',attended]].forEach(([label,items],index) => {
    const button = document.createElement('button'); button.type='button'; button.className='adventure-option'; button.setAttribute('role','tab');
    button.setAttribute('aria-selected',String(index===0)); button.setAttribute('aria-expanded',String(index===0)); button.setAttribute('aria-controls',`adventure-panel-${index}`);
    button.innerHTML=`<span aria-hidden="true">${index===0?'✦':'➜'}</span><b>${label}</b><small>${items.length} events</small>`;
    const section=document.createElement('div'); section.className='adventure-events'; section.id=`adventure-panel-${index}`; section.setAttribute('role','tabpanel'); section.hidden=index!==0;
    const list=document.createElement('ul'); list.className='ev-list'; sortEvents(items).forEach((item)=>list.append(item)); section.append(list); content.set(button,section);
    button.addEventListener('click',()=>{
      const wasOpen=button.getAttribute('aria-expanded')==='true';
      options.querySelectorAll('.adventure-option').forEach((other)=>{other.setAttribute('aria-selected','false');other.setAttribute('aria-expanded','false');content.get(other).hidden=true;});
      if(!wasOpen){button.setAttribute('aria-selected','true');button.setAttribute('aria-expanded','true');section.hidden=false;}
    });
    options.append(button);
  });
  content.forEach((section)=>panel.append(section)); explorer.append(options,panel);
  const memoryTitle=card.querySelector('.memory-wall-title');
  if(memoryTitle) memoryTitle.before(explorer); else card.append(explorer);
}
