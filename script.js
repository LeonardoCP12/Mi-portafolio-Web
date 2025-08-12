// Set current year in the element with id 'year'
document.getElementById('year').textContent = new Date().getFullYear();

// THEME: toggle class 'light-mode' on body and store preference
const themeToggleBtn = document.getElementById('theme-toggle-btn'); // This button should be added in your HTML

// Load saved theme preference and apply light mode if needed
const savedTheme = localStorage.getItem('site-theme');
if (savedTheme === 'light') {
  document.body.classList.add('light-mode');
}

// Function to update the icon according to the current theme
function updateThemeIcon() {
  if (document.body.classList.contains('light-mode')) {
    themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>'; // sun icon for light mode
  } else {
    themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>'; // moon icon for dark mode
  }
}

updateThemeIcon(); // Show the correct icon when page loads

// On click, toggle light/dark mode and save preference
themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  localStorage.setItem('site-theme', isLight ? 'light' : 'dark');
  updateThemeIcon();
});

// NAV TOGGLE (for mobile)
const navToggle = document.querySelector('.nav-toggle');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    document.body.classList.toggle('nav-open');
  });
}

// SKILL BARS: animate when visible on viewport
const skillSpans = document.querySelectorAll('.skill-bar span');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const span = entry.target;
      span.style.width = span.datasetWidth || span.style.width;
      span.classList.add('animate');
    }
  });
}, { threshold: 0.25 });

skillSpans.forEach(span => {
  span.datasetWidth = span.style.width || '';
  span.style.width = '0%';
  observer.observe(span);
});

// LANGUAGE SELECT: change language on selection and load translations
const langSelect = document.getElementById("lang-select");
const textsToChange = document.querySelectorAll("[data-section]");

// Load language JSON and update page text
function loadLanguage(lang) {
  fetch(`lang/${lang}.json`)
    .then(res => res.json())
    .then(data => {
      textsToChange.forEach(el => {
        const section = el.dataset.section;
        const value = el.dataset.value;
        el.innerHTML = data[section][value];
      });
      localStorage.setItem("selectedLang", lang); // Save selection
    })
    .catch(err => console.error("Error loading language:", err));
}

// Change language when user selects a new option
langSelect.addEventListener("change", (e) => {
  loadLanguage(e.target.value);
});

// Load saved language or default to Spanish
const savedLang = localStorage.getItem("selectedLang") || "es";
langSelect.value = savedLang;
loadLanguage(savedLang);

// FORM SUBMISSION: send contact form using fetch and show messages
const form = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const formData = new FormData(form);

  fetch('https://formsubmit.co/ajax/leonardo.cardenas.p@uni.pe', {
    method: 'POST',
    body: formData,
    headers: { 'Accept': 'application/json' }
  })
  .then(response => {
    if (response.ok) {
      formMessage.textContent = "Thank you for contacting me! I will respond soon.";
      form.reset();
    } else {
      response.json().then(data => {
        if (Object.hasOwn(data, 'errors')) {
          formMessage.textContent = data["errors"].map(error => error.message).join(", ");
        } else {
          formMessage.textContent = "Error submitting the form.";
        }
      });
    }
  })
  .catch(() => {
    formMessage.textContent = "Error submitting the form.";
  });

});
