const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

function initials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

function externalLink(href, label, className = '') {
  const link = document.createElement('a');
  link.href = href;
  link.target = '_blank';
  link.rel = 'noopener';
  link.className = className;
  link.innerHTML = `${label} <span aria-hidden="true">↗</span>`;
  return link;
}

function makeZoomable(image, src, alt) {
  image.src = src;
  image.alt = alt || '';
  image.loading = 'lazy';
  image.tabIndex = 0;
  image.classList.add('zoomable-image');
  const open = () => openLightbox(src, alt || 'Research image');
  image.addEventListener('click', open);
  image.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      open();
    }
  });
}

function createMemberCard(member) {
  const card = document.createElement('article');
  card.className = 'person-card';
  const media = document.createElement('div');
  media.className = 'person-photo';
  if (member.image) {
    const image = document.createElement('img');
    image.src = member.image;
    image.alt = `Portrait of ${member.name}`;
    image.loading = 'lazy';
    image.addEventListener('error', () => {
      media.classList.add('person-placeholder');
      media.textContent = initials(member.name);
    });
    media.appendChild(image);
  } else {
    media.classList.add('person-placeholder');
    media.textContent = initials(member.name);
  }
  const body = document.createElement('div');
  body.className = 'person-body';
  const category = document.createElement('p');
  category.className = 'person-category';
  category.textContent = member.category || 'Group member';
  const heading = document.createElement('h3');
  heading.textContent = member.name;
  const role = document.createElement('p');
  role.className = 'person-role';
  role.textContent = member.role;
  body.append(category, heading, role);
  if (member.email || member.profile) {
    const links = document.createElement('div');
    links.className = 'person-links';
    if (member.email) {
      const email = document.createElement('a');
      email.href = `mailto:${member.email}`;
      email.textContent = 'Email';
      links.appendChild(email);
    }
    if (member.profile) links.appendChild(externalLink(member.profile, 'Profile'));
    body.appendChild(links);
  }
  card.append(media, body);
  return card;
}

function createResearchCard(item) {
  const card = document.createElement('article');
  card.className = 'research-card';
  const media = document.createElement('div');
  media.className = `card-image ${item.imageClass || ''}`.trim();
  const image = document.createElement('img');
  makeZoomable(image, item.image, item.alt);
  media.appendChild(image);
  const body = document.createElement('div');
  body.className = 'card-body';
  body.innerHTML = `<p class="card-kicker">${item.kicker}</p><h3>${item.title}</h3><p>${item.description}</p>`;
  body.appendChild(externalLink(item.link, item.linkLabel || 'Read more'));
  card.append(media, body);
  return card;
}


function createEventCard(item) {
  const card = document.createElement('article');
  card.className = 'event-card';
  const date = document.createElement('div');
  date.className = 'event-date';
  date.innerHTML = `<span>${item.label || 'Event'}</span><strong>${item.date}</strong>${item.time ? `<small>${item.time}</small>` : ''}`;
  const body = document.createElement('div');
  body.className = 'event-body';
  body.innerHTML = `<h3>${item.title}</h3><p>${item.description}</p>`;
  if (item.link) body.appendChild(externalLink(item.link, item.linkLabel || 'Details'));
  else { const note=document.createElement('span'); note.className='event-note'; note.textContent=item.linkLabel || ''; body.appendChild(note); }
  card.append(date, body);
  return card;
}

function createPressCard(item) {
  const card = document.createElement('article');
  card.className = 'press-card';
  const media = document.createElement('div');
  media.className = 'press-image';
  const image = document.createElement('img');
  makeZoomable(image, item.image, item.alt);
  media.appendChild(image);
  const body = document.createElement('div');
  body.className = 'press-body';
  body.innerHTML = `<p class="press-meta">${item.source}</p><h3>${item.title}</h3><p>${item.description}</p>`;
  body.appendChild(externalLink(item.link, item.linkLabel || 'Read more'));
  card.append(media, body);
  return card;
}

function createInfrastructureCard(item) {
  const card = document.createElement('article');
  card.className = item.featured ? 'instrument-card instrument-card-featured' : item.image ? 'instrument-card instrument-card-visual' : 'instrument-card';
  if (item.image) {
    const image = document.createElement('img');
    image.className = 'instrument-photo';
    makeZoomable(image, item.image, item.alt);
    card.appendChild(image);
  }
  const body = document.createElement('div');
  body.className = item.image ? 'instrument-copy' : '';
  body.innerHTML = `<div class="instrument-icon" aria-hidden="true">${item.badge}</div><h3>${item.title}</h3><p>${item.description}</p>`;
  card.appendChild(body);
  return card;
}

function createResourceLink(item) {
  const link = document.createElement('a');
  link.className = 'resource-link';
  link.href = item.link;
  link.target = '_blank';
  link.rel = 'noopener';
  link.innerHTML = `<span><strong>${item.title}</strong><small>${item.subtitle}</small></span><b aria-hidden="true">↗</b>`;
  return link;
}

const peopleGrid = document.querySelector('#people-grid');
const members = Array.isArray(window.GROUP_MEMBERS) ? window.GROUP_MEMBERS : [];
if (peopleGrid) members.forEach((member) => peopleGrid.appendChild(createMemberCard(member)));

const featuredGrid = document.querySelector('#featured-grid');
if (featuredGrid) (window.FEATURED_RESEARCH || []).forEach((item) => featuredGrid.appendChild(createResearchCard(item)));

const publicationLinks = document.querySelector('#publication-links');
if (publicationLinks) (window.PUBLICATION_LINKS || []).forEach((item) => publicationLinks.appendChild(createResourceLink(item)));

const eventGrid = document.querySelector('#event-grid');
if (eventGrid) (window.EVENT_ITEMS || []).forEach((item) => eventGrid.appendChild(createEventCard(item)));

const pressGrid = document.querySelector('#press-grid');
if (pressGrid) (window.PRESS_ITEMS || []).forEach((item) => pressGrid.appendChild(createPressCard(item)));

const infrastructureGrid = document.querySelector('#infrastructure-grid');
if (infrastructureGrid) (window.INFRASTRUCTURE_ITEMS || []).forEach((item) => infrastructureGrid.appendChild(createInfrastructureCard(item)));

function openLightbox(src, alt) {
  let dialog = document.querySelector('#image-lightbox');
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.id = 'image-lightbox';
    dialog.className = 'image-lightbox';
    dialog.innerHTML = '<button type="button" class="lightbox-close" aria-label="Close image">×</button><img alt=""><p></p>';
    document.body.appendChild(dialog);
    dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  }
  dialog.querySelector('img').src = src;
  dialog.querySelector('img').alt = alt;
  dialog.querySelector('p').textContent = alt;
  dialog.showModal();
}
