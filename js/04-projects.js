/* js/04-projects.js: projects behavior for the portfolio. */

function initProjectCovers() {
  const covers = {
    'eGuide': ['photos/eguide.png', 'photos/egovibes.jpg'],
    'ClasSync': ['photos/classync.png'],
    'OutSource': ['photos/netad.png'],
    'OOP e-Portfolio': ['photos/oop.png'],
    'PetMoCo': ['photos/petmoco.png']
  };
  document.querySelectorAll('#checkpoint-4 .proj').forEach((project) => {
    const name = project.querySelector('h3')?.textContent.trim();
    const imagePaths = covers[name];
    const photoSlots = [...project.querySelectorAll('.proj-img')];
    if (!imagePaths) {
      if (name === 'Pip' || name === 'KapitKita') photoSlots.forEach((slot) => slot.remove());
      return;
    }
    imagePaths.forEach((path, index) => {
      let photo = photoSlots[index];
      if (!photo) return;
      const image = document.createElement('img');
      image.className = 'proj-img project-cover';
      image.src = path;
      image.alt = `${name} project${imagePaths.length > 1 ? ` photo ${index + 1}` : ''}`;
      image.loading = 'lazy';
      image.decoding = 'async';
      photo.replaceWith(image);
    });
    photoSlots.slice(imagePaths.length).forEach((slot) => slot.remove());
  });
}

function initProjectIcons() {
  const icons = {
    'eGuide': ['bus', 'eGuide transit project icon'],
    'KapitKita': ['photos/stellar.svg', 'Stellar'],
    'Pip': ['bird', 'Pip bird icon'],
    'ClasSync': ['org-icons/figma.svg', 'Figma'],
    'PetMoCo': ['java', 'Java'],
    'OutSource': ['org-icons/cisco.svg', 'Cisco'],
    'OOP e-Portfolio': ['code', 'Code project icon']
  };
  document.querySelectorAll('#checkpoint-4 .proj-head').forEach((head) => {
    const name = head.querySelector('h3')?.textContent.trim();
    const [source, label] = icons[name] || [];
    const badge = head.querySelector('.logo');
    if (!source || !badge) return;
    badge.replaceChildren();
    if (source.endsWith('.svg')) {
      const image = document.createElement('img');
      image.src = source;
      image.alt = '';
      image.loading = 'lazy';
      image.decoding = 'async';
      badge.append(image);
    } else {
      badge.innerHTML = source === 'bus'
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 16V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10M5 11h14M7 16v3m10-3v3M7.5 8h.01M16.5 8h.01M7 19h10"/></svg>'
        : source === 'bird'
          ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 17.5c2.6-.2 4.2-1.5 5.3-3.4C9.7 11.7 11.1 9 15.2 8c1.9-.5 3.8-.2 5.3.9l-3 .8 3.3 1.1-3.4 1.2c-1 3.1-3.6 5-7.3 5H8.5L5 19l1-2.1c-1 .4-2 .6-3 .6Z"/><path d="M13.5 9.2 12 5.5l3.8 2.7M10.7 14.2h.01"/></svg>'
          : source === 'java'
            ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7.1c2-1.5 4.7-1.3 4.1-3.5M11.6 9c2-1.3 4.2-1.1 3.7-3M7.2 10.3c2.6.9 6.5.9 9.1 0M6.5 12.2c.2 2.1.7 3.8 1.7 4.7h7.5c.9-.9 1.4-2.6 1.6-4.7M9 18.3c1.5.6 4.6.6 6.1 0M5.3 20c3.8 1.1 9.6 1.1 13.4 0"/></svg>'
          : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5-6 7 6 7m8-14 6 7-6 7m-3-15-2 18"/></svg>';
    }
    badge.classList.add('project-icon');
    badge.setAttribute('aria-label', label);
    badge.title = label;
  });
}

function initProjectGalleryRail() {
  const rail = document.querySelector('#checkpoint-4 .project-gallery');
  if (!rail || rail.dataset.scrollReady) return;
  rail.dataset.scrollReady='true'; rail.classList.add('is-infinite');
  const originals=[...rail.children];
  const feature=originals.find((card)=>card.classList.contains('project-gallery-feature'));
  if (!originals.length || !feature) return;
  const cloneCard=(card)=>{
    const clone=card.cloneNode(true); clone.setAttribute('aria-hidden','true'); clone.tabIndex=-1;
    clone.querySelectorAll('a,button,input,select,textarea,summary,[tabindex]').forEach((node)=>node.tabIndex=-1);
    clone.querySelectorAll('[id]').forEach((node)=>node.removeAttribute('id'));
    return clone;
  };
  const before=document.createDocumentFragment(); originals.forEach((card)=>before.append(cloneCard(card)));
  const after=document.createDocumentFragment(); originals.forEach((card)=>after.append(cloneCard(card)));
  rail.prepend(before); rail.append(after);
  const firstOriginal=originals[0];
  let setWidth=0, middleStart=0, middleEnd=0;
  const measureRail=()=>{
    const gap=parseFloat(getComputedStyle(rail).columnGap)||0;
    setWidth=originals.reduce((width,card)=>width+card.getBoundingClientRect().width,0)+gap*originals.length;
    middleStart=firstOriginal.getBoundingClientRect().left-rail.getBoundingClientRect().left+rail.scrollLeft;
    middleEnd=middleStart+setWidth;
  };
  const centerFeature=()=>{
    const featureLeft=feature.getBoundingClientRect().left-rail.getBoundingClientRect().left+rail.scrollLeft;
    rail.scrollLeft=featureLeft-(rail.clientWidth-feature.offsetWidth)/2;
  };
  measureRail();
  centerFeature();
  window.addEventListener('resize',()=>{ centerFeature(); measureRail(); });
  rail.addEventListener('wheel', (event) => {
    if (event.target.closest('.project-gallery-card') && Math.abs(event.deltaY) > Math.abs(event.deltaX)) return;
    pauseUntil=performance.now()+1800;
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) { rail.scrollLeft += event.deltaY; event.preventDefault(); }
  }, { passive:false });
  let dragging=false, startX=0, initialScroll=0, pauseUntil=0, lastFrame=0;
  rail.addEventListener('pointerdown', (event) => {
    pauseUntil=performance.now()+1800;
    if (event.pointerType==='touch' || event.button!==0 || event.target.closest('a,button,summary,input')) return;
    dragging=true; startX=event.clientX; initialScroll=rail.scrollLeft;
    rail.classList.add('is-dragging');
  });
  window.addEventListener('pointermove', (event) => { if (dragging) rail.scrollLeft=initialScroll-(event.clientX-startX); });
  ['pointerup','pointercancel'].forEach((type) => window.addEventListener(type, () => { dragging=false; pauseUntil=performance.now()+500; rail.classList.remove('is-dragging'); }));
  rail.addEventListener('keydown', (event) => {
    if (event.key!=='ArrowLeft' && event.key!=='ArrowRight') return;
    event.preventDefault(); pauseUntil=performance.now()+1800; rail.scrollBy({ left:event.key==='ArrowRight'?300:-300, behavior:'smooth' });
  });
  const advance=(time)=>{
    if (lastFrame && !dragging && time>pauseUntil) rail.scrollLeft+=Math.min(40,time-lastFrame)*.025;
    if (rail.scrollLeft<middleStart) rail.scrollLeft+=setWidth;
    else if (rail.scrollLeft>=middleEnd) rail.scrollLeft-=setWidth;
    lastFrame=time; requestAnimationFrame(advance);
  };
  requestAnimationFrame(advance);
}

function initProjectDetailsDialog() {
  const gallery=document.querySelector('#checkpoint-4 .project-gallery');
  if (!gallery) return;
  const dialog=document.createElement('dialog');
  dialog.className='project-details-dialog';
  dialog.setAttribute('aria-labelledby','project-details-title');
  dialog.innerHTML='<div class="project-dialog-header"><div class="project-dialog-heading"><span class="project-dialog-icon"></span><h2 id="project-details-title"></h2></div><button type="button" class="project-dialog-close" aria-label="Close project details" autofocus>×</button></div><div class="project-dialog-content"></div>';
  document.body.append(dialog);
  const title=dialog.querySelector('#project-details-title');
  const content=dialog.querySelector('.project-dialog-content');
  const dialogIcon=dialog.querySelector('.project-dialog-icon');
  dialog.querySelector('.project-dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',(event)=>{ if (event.target===dialog) dialog.close(); });
  gallery.querySelectorAll('.project-gallery-card.proj,.project-stack-item').forEach((card)=>{
    card.tabIndex=0;
    card.setAttribute('aria-label',`Open project details: ${card.querySelector('h3')?.textContent.trim() || 'project'}`);
  });
  const showProject=(project)=>{
    if(!project) return;
    const heading=project.querySelector('h3')?.textContent.trim() || 'Project details';
    title.textContent=heading;
    const expanded=project.cloneNode(true);
    expanded.classList.remove('project-gallery-card','project-gallery-feature','project-stack-item');
    expanded.removeAttribute('aria-hidden');
    expanded.querySelectorAll('details').forEach((item)=>{
      [...item.childNodes].forEach((child)=>{
        if(child.nodeType===1 && child.tagName==='SUMMARY') child.remove();
        else item.before(child);
      });
      item.remove();
    });
    expanded.querySelectorAll('[id]').forEach((node)=>node.removeAttribute('id'));
    const logo=expanded.querySelector('.proj-head > .logo');
    dialogIcon.replaceChildren();
    if(logo) dialogIcon.append(logo.cloneNode(true));
    expanded.querySelector('.proj-head')?.remove();
    content.replaceChildren(expanded);
    if(!dialog.open) dialog.showModal();
  };
  dialog.addEventListener('wheel',(event)=>{ if(event.target===dialog) dialog.close(); },{passive:true});
  gallery.addEventListener('click',(event)=>{
    const summary=event.target.closest('details > summary');
    if(summary && gallery.contains(summary)) { event.preventDefault(); showProject(summary.closest('.proj')); return; }
    const card=event.target.closest('.project-gallery-card.proj,.project-stack-item');
    if(card && gallery.contains(card)) { event.preventDefault(); showProject(card); }
  }, true);
  gallery.addEventListener('keydown',(event)=>{
    if(event.key!=='Enter' && event.key!==' ') return;
    const card=event.target.closest('.project-gallery-card.proj,.project-stack-item');
    if(card && event.target===card) { event.preventDefault(); showProject(card); }
  });
}

function arrangeProjects() {
  const card = document.querySelector('#checkpoint-4 .checkpoint-card');
  if (!card) return;
  const groups = [...card.querySelectorAll(':scope > details.fold')];
  const hackathon = groups.find((item) => item.querySelector('.fold-title')?.textContent.trim().toLowerCase() === 'hackathon');
  const sideQuests = groups.find((item) => item.querySelector('.fold-title')?.textContent.trim().toLowerCase() === 'side quests');
  const academics = groups.find((item) => item.querySelector('.fold-title')?.textContent.trim().toLowerCase() === 'academic builds');
  const feature = hackathon?.querySelector('.proj');
  if (!feature || !sideQuests || !academics) return;
  const firstPhoto = feature.querySelector('.proj-img');
  if (firstPhoto && !feature.querySelector('.project-photo-placeholder-secondary')) {
    const secondPhoto = document.createElement('div'); secondPhoto.className = 'proj-img project-photo-placeholder-secondary'; secondPhoto.textContent = '[Add project photo]'; secondPhoto.setAttribute('aria-label','Add another eGuide project photo'); firstPhoto.after(secondPhoto);
  }
  const photos = [...feature.querySelectorAll(':scope > .proj-img')];
  if (photos.length && !feature.querySelector(':scope > .project-photo-pair')) {
    const pair = document.createElement('div'); pair.className='project-photo-pair';
    photos.forEach((photo) => pair.append(photo));
    feature.prepend(pair);
  }
  const gallery = document.createElement('div'); gallery.className='project-gallery';
  gallery.setAttribute('role','region'); gallery.setAttribute('aria-label','Project gallery. Scroll sideways to browse projects.'); gallery.tabIndex=0;
  const side = [...sideQuests.querySelectorAll('.proj')];
  const academic = [...academics.querySelectorAll('.proj')];
  const prepareProject = (project) => {
    const name = project.querySelector('h3')?.textContent.trim();
    const category = name === 'eGuide' ? 'Hackathon' : ['KapitKita','Pip'].includes(name) ? 'Side quest' : 'Academic';
    const categoryPill = project.querySelector(':scope > .pill');
    if (categoryPill && categoryPill.textContent.trim().toLowerCase() === category.toLowerCase()) categoryPill.remove();
    const badge = document.createElement('span'); badge.className='project-category'; badge.textContent=category;
    const heading = project.querySelector('.proj-head');
    if (heading && !project.querySelector(':scope > .project-category')) project.insertBefore(badge, heading);
    return project;
  };
  const pip = side.find((project) => project.querySelector('h3')?.textContent.trim() === 'Pip');
  const kapitKita = side.find((project) => project.querySelector('h3')?.textContent.trim() === 'KapitKita');
  const sideStack = document.createElement('div');
  sideStack.className='project-gallery-card project-side-stack';
  sideStack.setAttribute('aria-label','Side quests: Pip and KapitKita');
  [pip, kapitKita].filter(Boolean).forEach((project) => {
    project.classList.add('project-stack-item');
    sideStack.append(prepareProject(project));
  });
  feature.classList.add('project-gallery-card','project-gallery-feature');
  gallery.append(sideStack, prepareProject(feature), ...academic.map((project) => {
    project.classList.add('project-gallery-card');
    return prepareProject(project);
  }));
  hackathon.remove(); sideQuests.remove(); academics.remove();
  card.append(gallery);
  const featureCard = gallery.querySelector('.project-gallery-feature');
  requestAnimationFrame(() => {
    if (!featureCard) return;
    const left = featureCard.getBoundingClientRect().left - gallery.getBoundingClientRect().left + gallery.scrollLeft;
    gallery.scrollLeft = left - (gallery.clientWidth - featureCard.offsetWidth) / 2;
  });
}
