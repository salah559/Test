
async function loadTranslations(lang) {
  const response = await fetch('translations.json');
  const translations = await response.json();
  document.querySelectorAll('[data-translate]').forEach(el => {
    const key = el.getAttribute('data-translate');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const switcher = document.getElementById('languageSwitcher');
  switcher.addEventListener('change', () => {
    loadTranslations(switcher.value);
  });
  loadTranslations('en');
});
