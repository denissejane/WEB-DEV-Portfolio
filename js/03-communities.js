/* js/03-communities.js: communities behavior for the portfolio. */

function reorganizeCommunityList() {
  const card = document.querySelector('#checkpoint-2 .checkpoint-card');
  if (!card) return;
  const categories = [
    ['Class Officers', /class officer/i],
    ['Organizations', /pup organizations/i],
    ['Communities', /community/i]
  ];
  const collected = new Map(categories.map(([label]) => [label, new Map()]));
  card.querySelectorAll('.fold-body .group').forEach((group) => {
    const category = categories.find(([, pattern]) => pattern.test(group.querySelector('h4')?.textContent || ''))?.[0];
    if (!category) return;
    const yearText = group.closest('details.fold')?.querySelector('.fold-title')?.textContent || '';
    const classYear = yearText.match(/([1-3])(?:st|nd|rd)\s+Year/i)?.[1] || '';
    const registry = collected.get(category);
    group.querySelectorAll('.org').forEach((item) => {
      const title = item.querySelector('b')?.textContent.trim();
      if (!title) return;
      if (category === 'Class Officers' && classYear) item.dataset.classYear = classYear;
      if (!registry.has(title)) registry.set(title, item);
      else {
        const existing = registry.get(title);
        const roles = existing.querySelector('.roles');
        item.querySelectorAll('.roles > span').forEach((role) => {
          if (![...roles.children].some((known) => known.textContent.trim() === role.textContent.trim())) roles.append(role.cloneNode(true));
        });
      }
    });
  });
  card.querySelectorAll(':scope > details.fold').forEach((fold) => fold.remove());
  const explorer = document.createElement('div'); explorer.className = 'community-explorer';
  const strip = document.createElement('div'); strip.className = 'community-options'; strip.setAttribute('role','tablist'); strip.setAttribute('aria-label','Community experience');
  const panels = document.createElement('div'); panels.className = 'community-panels';
  categories.forEach(([label], index) => {
    const items = [...collected.get(label).values()];
    if (!items.length) return;
    const id = `community-panel-${index}`;
    const button = document.createElement('button'); button.type='button'; button.className='community-option';
    button.setAttribute('role','tab'); button.setAttribute('aria-controls',id); button.setAttribute('aria-selected',String(label === 'Organizations')); button.setAttribute('aria-expanded',String(label === 'Organizations'));
    const periods = { 'Class Officers':'Years 1–3', 'Organizations':'Years 1–3', 'Communities':'Years 1–2' };
    button.innerHTML=`<b>${label}</b><small>${periods[label]}</small>`;
    const panel = document.createElement('section'); panel.id=id; panel.className='community-panel'; panel.setAttribute('role','tabpanel'); panel.hidden=label !== 'Organizations';
    const list = document.createElement('ul'); list.className='org-list'; items.forEach((item) => { decorateCommunityRoles(item, label !== 'Class Officers'); addOrganizationImage(item, label); list.append(item); }); panel.append(list);
    button.addEventListener('click', () => {
      const wasOpen = button.getAttribute('aria-expanded') === 'true';
      strip.querySelectorAll('.community-option').forEach((option) => { option.setAttribute('aria-selected','false'); option.setAttribute('aria-expanded','false'); });
      panels.querySelectorAll('.community-panel').forEach((other) => { other.hidden=true; });
      if (!wasOpen) { button.setAttribute('aria-selected','true'); button.setAttribute('aria-expanded','true'); panel.hidden=false; panels.hidden=false; }
      else panels.hidden=true;
    });
    if (label === 'Organizations') panels.hidden=false;
    strip.append(button); panels.append(panel);
  });
  explorer.append(strip,panels); card.append(explorer);
}

function addOrganizationImage(item, category) {
  const logo = item.querySelector('.logo');
  const title = item.querySelector('b')?.textContent.trim() || '';
  if (!logo) return;

  let file = '';
  let crop = false;
  if (category === 'Class Officers') {
    file = { '1':'2nterstellar.jpg', '2':'cutiepa23.jpg', '3':'31n.jpg' }[item.dataset.classYear] || '';
    crop = true;
  } else if (category === 'Communities') {
    if (/^ARK\b/i.test(title)) file = 'ark.jpg';
  } else {
    const icons = [
      [/aws user group e:novators/i, 'enovators.jpg'],
      [/workflow ph/i, 'workflow.jpg'],
      [/jbecp/i, 'jbecp.jpg'],
      [/for girls who build/i, 'fgwb.jpg'],
      [/aws student builder group pup/i, 'awssbgpup.jpg'],
      [/bukluran sa sikolohiyang/i, 'bsp.jpg'],
      [/angat iskolar/i, 'aip.jpg'],
      [/ibits pup/i, 'ibits.jpg'],
      [/microsoft campus club pup/i, 'mcc.jpg'],
      [/google developers group/i, 'gdg.jpg'],
      [/cisco netconnect/i, 'cncp.jpg']
    ];
    file = icons.find(([pattern]) => pattern.test(title))?.[1] || '';
  }

  if (!file) return;
  const image = document.createElement('img');
  image.src = `org-icons/${file}`;
  image.alt = `${title} icon`;
  image.loading = 'lazy';
  image.decoding = 'async';
  logo.classList.add('image-logo');
  if (crop) logo.classList.add('class-photo-logo');
  logo.replaceChildren(image);
}

function decorateCommunityRoles(item, allowDetails = true) {
  const rolesList = item.querySelector('.roles');
  if (!rolesList) return;
  const content = item.querySelector(':scope > div');
  rolesList.querySelectorAll(':scope > span:not(.community-tenure)').forEach((role) => {
    const roleText = role.textContent.trim();
    if (!roleText) return;
    if (!role.querySelector('.role-details-trigger')) {
      role.replaceChildren();
      const mark = document.createElement('i'); mark.className='role-mark'; mark.setAttribute('aria-hidden','true'); mark.textContent='•';
      const label = document.createElement(allowDetails ? 'button' : 'span');
      label.className = allowDetails ? 'role-details-trigger' : 'role-static';
      if (allowDetails) { label.type='button'; label.setAttribute('aria-expanded','false'); }
      label.textContent=roleText;
      role.append(mark,label);
    }
  });
  const tenure = communityTenure(item.querySelector('b')?.textContent.trim() || '');
  if (tenure && !rolesList.querySelector('.community-tenure')) {
    const meta = document.createElement('span'); meta.className='community-tenure';
    const mark = document.createElement('i'); mark.className='tenure-mark'; mark.setAttribute('aria-hidden','true'); mark.textContent='•';
    const value = document.createElement('span'); value.className='tenure-value'; value.textContent=tenure;
    meta.append(mark,value); rolesList.append(meta);
  }
  if (!allowDetails || !content || content.querySelector('.role-description')) return;
  const description = document.createElement('p'); description.className='role-description'; description.hidden=true;
  description.setAttribute('aria-live','polite');
  rolesList.querySelectorAll('.role-details-trigger').forEach((button) => button.addEventListener('click', () => {
    const opening = description.hidden || description.dataset.role !== button.textContent;
    rolesList.querySelectorAll('.role-details-trigger').forEach((other) => other.setAttribute('aria-expanded','false'));
    if (!opening) { description.hidden=true; description.textContent=''; delete description.dataset.role; return; }
    description.dataset.role = button.textContent;
    description.textContent = roleSummary(button.textContent);
    description.hidden = false;
    button.setAttribute('aria-expanded','true');
  }));
  content.append(description);
}

function roleSummary(roleText) {
  const role = roleText.toLowerCase();
  let contribution = 'I contributed to the team’s shared work and supported its activities.';
  if (/marketing|social media|content|copywrit|creative|caption|communications/.test(role)) contribution = 'I helped the group communicate its work through content, outreach, and creative materials.';
  else if (/operations|logistics|registration|usher|access|production|program/.test(role)) contribution = 'I helped activities run smoothly by supporting logistics, registration, and participant coordination.';
  else if (/finance|fund|budget|treasurer/.test(role)) contribution = 'I supported budgeting and fund tracking so the team could plan and deliver its activities.';
  else if (/development|technology|technical|data science|ai|web development/.test(role)) contribution = 'I contributed to technical work and helped make learning and building opportunities accessible to members.';
  else if (/director|lead|head|vice president|vp for|secretary|beadle|co-lead/.test(role)) contribution = 'I helped coordinate people and plans, keeping the team’s responsibilities moving forward.';
  return `As ${roleText}, ${contribution} I worked with fellow members to support the group’s events and goals.`;
}

function communityTenure(title) {
  const key = title.toLowerCase();
  const entries = [
    [/multimedia class beadle/, 'Year 3 · 1st Semester · Ongoing'],
    [/class secretary/, 'Year 2 · 2nd Semester'], [/cutie pa2-3/, 'Year 2 · 1st Semester'],
    [/2nterstellar/, 'Year 1 · 2024–2025'], [/course beadle/, 'Year 1 · 1st & 2nd Semester'], [/cwts k\.k\.k\./, 'Year 1'],
    [/aws user group e:novators/, 'Nov 2025–present'], [/workflow ph/, 'Feb 2026–present'],
    [/jbecp/, 'Apr 2025–present'], [/for girls who build/, 'Oct 2026'],
    [/aws student builder group pup/, '2024–2026'], [/angat iskolar/, '2024–2026'],
    [/ibits pup/, '2024–2026'], [/bukluran sa sikolohiyang/, '2025–2026'],
    [/microsoft campus club pup/, 'Nov 2025'], [/google developers group/, 'Nov 2025'],
    [/cisco netconnect/, 'Dec 2025'], [/web-community/, '2024–2026'],
    [/ark \(/, '2024–2025']
  ];
  return entries.find(([pattern]) => pattern.test(key))?.[1] || '';
}
