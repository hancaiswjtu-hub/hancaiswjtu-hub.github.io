const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-toggle]');
const navigation = document.querySelector('[data-nav]');
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const sections = [...document.querySelectorAll('main section[id]')];
const showMoreButton = document.querySelector('[data-show-more]');
const extraPublications = [...document.querySelectorAll('.extra-publication')];
const tickerTrack = document.querySelector('[data-ticker-track]');

if (tickerTrack) {
  const tickerGroup = tickerTrack.querySelector('.ticker-group');
  if (tickerGroup) {
    const duplicateGroup = tickerGroup.cloneNode(true);
    duplicateGroup.setAttribute('aria-hidden', 'true');
    duplicateGroup.querySelectorAll('a').forEach((link) => link.setAttribute('tabindex', '-1'));
    tickerTrack.append(duplicateGroup);
  }
}

const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 24);
const closeMenu = () => {
  navigation.classList.remove('open');
  document.body.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
};

menuButton.addEventListener('click', () => {
  const isOpen = !navigation.classList.contains('open');
  navigation.classList.toggle('open', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
navLinks.forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -60% 0px' });
sections.forEach((section) => sectionObserver.observe(section));

showMoreButton.addEventListener('click', () => {
  const expanded = showMoreButton.getAttribute('aria-expanded') === 'true';
  showMoreButton.setAttribute('aria-expanded', String(!expanded));
  showMoreButton.querySelector('span').textContent = expanded
    ? showMoreButton.dataset.moreLabel
    : showMoreButton.dataset.lessLabel;
  extraPublications.forEach((publication) => {
    publication.hidden = expanded;
    if (!expanded) requestAnimationFrame(() => publication.classList.add('visible'));
  });
});

const portrait = document.querySelector('[data-portrait]');
portrait.addEventListener('error', () => portrait.remove());
document.querySelector('[data-year]').textContent = new Date().getFullYear();
