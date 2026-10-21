/* js/02-garden-and-skills.js: garden and skills behavior for the portfolio. */

function initFlowerGarden() {
  const flowerButton = document.querySelector('.flower-button');
  const garden = document.querySelector('.garden-flowers');
  const flowerChoices = ['✿', '❀', '✽', '❁', '✾'];
  let flowersLeft = 0;

  if (!flowerButton || !garden) return;

  flowerButton.addEventListener('click', () => {
    if (flowersLeft >= 40) return;

    const flower = document.createElement('span');
    flower.textContent = flowerChoices[flowersLeft % flowerChoices.length];
    flower.setAttribute('aria-hidden', 'true');
    garden.append(flower);
    flowersLeft += 1;

    const flowerLabel = flowersLeft === 1 ? 'flower' : 'flowers';
    flowerButton.setAttribute('aria-label', `${flowersLeft} ${flowerLabel} left. Leave another flower`);
  });
}


/* ================================================================
   SKILL TABS (About me → Skills sub-card)
   ================================================================ */

function initSkillTabs() {
  const tabs = [...document.querySelectorAll('[data-skill-tab]')];
  if (!tabs.length) return;

  function selectTab(tab) {
    tabs.forEach((other) => {
      const isSelected = other === tab;
      other.setAttribute('aria-selected', String(isSelected));
      other.tabIndex = isSelected ? 0 : -1;
      document.getElementById(other.getAttribute('aria-controls')).hidden = !isSelected;
    });
  }

  const initiallySelected = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') || tabs[0];
  tabs.forEach((tab) => {
    tab.tabIndex = tab === initiallySelected ? 0 : -1;
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', (event) => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
      if (!step) return;
      const next = tabs[(index + step + tabs.length) % tabs.length];
      selectTab(next);
      next.focus();
    });
  });
}


/* ================================================================
   START THE PAGE
   ================================================================ */

function initGardenPicker() {
  const garden = document.querySelector('.garden-flowers');
  const button = document.querySelector('.flower-button');
  if (!garden || !button) return;
  const picker = document.createElement('div');
  picker.className = 'garden-picker';
  picker.setAttribute('aria-label', 'Choose a garden decoration');
  [['✿','Flower'],['❀','Blossom'],['✦','Star'],['♡','Heart'],['🍊','Orange']].forEach(([symbol, label]) => {
    const choice = document.createElement('button');
    choice.type = 'button'; choice.textContent = symbol; choice.setAttribute('aria-label', `Add ${label}`);
    choice.addEventListener('click', () => {
      if (garden.children.length >= 50) return;
      const mark = document.createElement('span'); mark.textContent = symbol; mark.setAttribute('aria-hidden', 'true'); garden.append(mark);
    });
    picker.append(choice);
  });
  button.replaceWith(picker);
}

function initToolIcons() {
  const icons = [
    ['Figma','F','#8b5cf6','figma.svg'],['Canva','C','#12a9e8',''],['Notion','N','#242424','notion.svg'],['Meta Business Suite','∞','#0866ff',''],
    ['Google Workspace','G','#4285f4',''],['GitHub','●','#24292f','github.svg'],['VS Code','><','#007acc',''],['MySQL Workbench','🐬','#00758f','mysql.svg'],['Cisco Packet Tracer','●','#049fd9','cisco.svg']
  ];
  document.querySelectorAll('#skill-panel-Tools .detail-chips > span').forEach((chip)=>{
    const match=icons.find(([name])=>chip.textContent.trim()===name);
    if(!match)return;
    const icon=document.createElement('i');icon.className='tool-icon';icon.style.setProperty('--brand',match[2]);icon.setAttribute('aria-hidden','true');
    if(match[3]) { const image=document.createElement('img'); image.src=`org-icons/${match[3]}`; image.alt=''; image.decoding='async'; icon.append(image); }
    else icon.textContent=match[1];
    chip.prepend(icon);
  });
  const brandFiles = new Map([
    ['python','python.svg'], ['c','c.svg'], ['java','java.svg'], ['cobol','cobol.svg'], ['css','css3.svg'],
    ['javascript','javascript.svg'], ['html','html5.svg'], ['next.js','nextdotjs.svg'], ['react','react.svg'],
    ['typescript','typescript.svg'], ['mysql','mysql.svg'], ['figma','figma.svg'], ['github','github.svg'],
    ['cisco packet tracer','cisco.svg'], ['network configuration','cisco.svg'], ['database management','mysql.svg']
  ]);
  document.querySelectorAll('#skill-panel-Technical .detail-chips > span, #checkpoint-4 .proj .tags li').forEach((chip)=>{
    const label=chip.textContent.trim().toLowerCase();
    const file=brandFiles.get(label);
    if(!file || chip.querySelector('img')) return;
    const image=document.createElement('img'); image.className='brand-mark'; image.src=`org-icons/${file}`; image.alt=''; image.setAttribute('aria-hidden','true'); image.decoding='async'; chip.prepend(image);
  });
}
