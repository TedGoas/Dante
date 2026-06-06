const STORAGE_KEY = 'site-theme';

function getStoredTheme() {
  try {
    const theme = localStorage.getItem(STORAGE_KEY);
    return theme === 'dark' ? 'dark' : 'light';
  } catch (e) {
    return 'light';
  }
}

function applyTheme(theme) {
  const root = document.documentElement;

  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.removeAttribute('data-theme');
  }
}

function persistTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (e) {}
}

document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('site-theme');

  if (!select) {
    return;
  }

  const theme = getStoredTheme();
  select.value = theme;
  applyTheme(theme);

  select.addEventListener('change', () => {
    const nextTheme = select.value === 'dark' ? 'dark' : 'light';
    applyTheme(nextTheme);
    persistTheme(nextTheme);
  });
});
