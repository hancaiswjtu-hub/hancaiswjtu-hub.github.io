const menuButton = document.querySelector('[data-menu-toggle]');
const navigation = document.querySelector('[data-nav]');
const searchInput = document.querySelector('[data-collaborator-search]');
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const records = [...document.querySelectorAll('[data-collaborator-list] li')];
const resultCount = document.querySelector('[data-result-count]');
const noResults = document.querySelector('[data-no-results]');
let activeFilter = 'all';

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

navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

const updateRecords = () => {
  const query = searchInput.value.trim().toLocaleLowerCase();
  let visibleCount = 0;

  records.forEach((record) => {
    const nameMatches = record.dataset.name.includes(query);
    const count = Number(record.dataset.count);
    const filterMatches = activeFilter === 'all'
      || (activeFilter === 'frequent' && count >= 3)
      || (activeFilter === 'single' && count === 1);
    const isVisible = nameMatches && filterMatches;
    record.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  resultCount.textContent = visibleCount;
  noResults.hidden = visibleCount !== 0;
};

searchInput.addEventListener('input', updateRecords);
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));
    updateRecords();
  });
});

document.querySelector('[data-year]').textContent = new Date().getFullYear();
