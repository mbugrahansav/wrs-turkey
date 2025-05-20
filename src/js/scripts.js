console.log("JS yüklendi");

let currentLang = localStorage.getItem('selectedLanguage') || "tr";
loadLanguage(currentLang);

document.querySelectorAll('.language-selector').forEach(languageSelector => {
  const languageTrigger = languageSelector.querySelector('.language-trigger');
  const languageOptions = languageSelector.querySelectorAll('.language-option');
  const currentFlag = languageSelector.querySelector('.currentFlag');

  // Dropdown toggle
  languageTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    languageSelector.classList.toggle('active');
  });

  // Option click
  languageOptions.forEach(option => {
    option.addEventListener('click', () => {
      const selectedLang = option.getAttribute('data-lang');
      const selectedFlag = option.querySelector('img').src;
      const selectedLangName = option.querySelector('.language-code').textContent;

      currentFlag.src = selectedFlag;
      languageSelector.classList.remove('active');

      loadLanguage(selectedLang);
      currentLang = selectedLang;
      localStorage.setItem('selectedLanguage', selectedLang);

      const event = new CustomEvent('languageChanged', { detail: { language: selectedLang } });
      document.dispatchEvent(event);
    });
  });
});

// Dışarı tıklanınca dropdown kapanır
document.addEventListener('click', (event) => {
  document.querySelectorAll('.language-selector').forEach(languageSelector => {
    if (!languageSelector.contains(event.target)) {
      languageSelector.classList.remove('active');
    }
  });
});

function updateLanguageSelector(lang) {
  document.querySelectorAll('.language-selector').forEach(languageSelector => {
    const option = languageSelector.querySelector(`.language-option[data-lang="${lang}"]`);
    if (option) {
      const selectedFlag = option.querySelector('img').src;
      const selectedLangName = option.querySelector('.language-code').textContent;
      const currentFlag = languageSelector.querySelector('.currentFlag');

      if (currentFlag) {
        currentFlag.src = selectedFlag;
      }
    }
  });
}

function loadLanguage(lang) {
  fetch(`src/lang/${lang}.json`)
    .then(res => res.json())
    .then(data => {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const elements = document.querySelectorAll(`#${key}, [data-i18n="${key}"]`);
          elements.forEach(element => {
            if (element.tagName === 'BUTTON') {
              element.innerText = data[key];
            } else {
              element.innerHTML = data[key];
            }
          });
        }
      }

      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (data[key]) {
          if (el.tagName === 'BUTTON') {
            el.innerText = data[key];
          } else {
            el.textContent = data[key];
          }
        }
      });

      window.i18nData = data;
    })
    .catch(err => {
      console.error(`Dil dosyası yüklenirken hata oluştu (${lang}):`, err);
    });
}

// Diğer sayfalarda kullanılabilecek public API
window.i18n = {
  changeLanguage: function (lang) {
    loadLanguage(lang);
    currentLang = lang;
    localStorage.setItem('selectedLanguage', lang);
    updateLanguageSelector(lang);
  },
  getCurrentLanguage: function () {
    return currentLang;
  },
  translate: function (key) {
    return window.i18nData && window.i18nData[key] ? window.i18nData[key] : key;
  }
};

document.addEventListener('DOMContentLoaded', () => {

  // Önceki seçilen dil varsa, dil seçicisini güncelle
  updateLanguageSelector(currentLang);

  // Dil dosyasını yükle ve içeriği güncelle
  loadLanguage(currentLang);

  console.log("DOM yüklendi");

  const hasSeenIntro = localStorage.getItem('hasSeenIntro');
  const videoContainer = document.getElementById('video-container');
  const video = document.getElementById('intro-video');
  const landing = document.getElementById('landing');

  function showPage() {
    videoContainer.classList.add('fade-out');
    setTimeout(() => {
      videoContainer.style.display = 'none';
      landing.style.display = 'block';
      document.body.style.overflow = 'auto';
    }, 1000);
  }

  if (hasSeenIntro) {
    videoContainer.style.display = 'none';
    landing.style.display = 'block';
    document.body.style.overflow = 'hidden';
    enableNavbarShrink();
  } else {
    localStorage.setItem('hasSeenIntro', 'true');
    video.addEventListener('ended', () => {
      showPage();
      enableNavbarShrink();
    });
    document.body.style.overflow = 'hidden';
  }

  document.getElementById('btn-management').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('landing').style.display = 'none';
    document.getElementById('page-top').style.display = 'block';
    setTimeout(() => {
      window.location.hash = 'management';
    }, 50);
  });

  document.getElementById('btn-contact').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('landing').style.display = 'none';
    document.getElementById('page-top').style.display = 'block';
    setTimeout(() => {
      window.location.hash = 'contact';
    }, 50);
  });

  // Navbar dropdown için gerekli elementler
  const dropdown = document.querySelector('.dropdown');
  const dropdownToggle = document.querySelector('.dropdown-toggle');

  // Form popup için gerekli elementler
  const popupOverlay = document.getElementById('popup-overlay');
  const closePopupBtn = document.getElementById('close-popup');
  const forms = document.querySelectorAll('.popup-form');

  // Dropdown açılıp kapanması
  dropdownToggle.addEventListener('click', function (e) {
    e.preventDefault();
    dropdown.classList.toggle('dropdown-open');
  });

  // Dropdown dışına tıklandığında menüyü kapat
  document.addEventListener('click', function (event) {
    if (!dropdown.contains(event.target)) {
      dropdown.classList.remove('dropdown-open');
    }
  });

  // Dropdown öğelerine tıklandığında ilgili formu aç
  const dropdownItems = document.querySelectorAll('.dropdown-item');
  dropdownItems.forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();

      // Önce dropdown'ı kapat
      dropdown.classList.remove('dropdown-open');

      // İlgili form ID'sini al
      const formId = this.getAttribute('data-form');

      // Tüm formları gizle
      forms.forEach(form => {
        form.classList.add('d-none');
      });

      // İlgili formu göster
      const selectedForm = document.getElementById(formId);
      if (selectedForm) {
        selectedForm.classList.remove('d-none');
        popupOverlay.classList.remove('d-none');
      }
    });
  });

  // Popup kapatma tuşu
  closePopupBtn.addEventListener('click', function () {
    popupOverlay.classList.add('d-none');

    // Tüm formları gizle
    forms.forEach(form => {
      form.classList.add('d-none');
    });
  });

  // Popup dışına tıklandığında kapat
  popupOverlay.addEventListener('click', function (e) {
    if (e.target === popupOverlay) {
      popupOverlay.classList.add('d-none');

      // Tüm formları gizle
      forms.forEach(form => {
        form.classList.add('d-none');
      });
    }
  });

  const input = document.querySelector("#phone");
  if (!input) return;

  const iti = window.intlTelInput(input, {
    initialCountry: "auto",
    geoIpLookup: callback => {
      fetch('https://ipapi.co/json')
        .then(res => res.json())
        .then(data => callback(data.country_code))
        .catch(() => callback("us"));
    },
    separateDialCode: true,
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js"
  });

  // Navbar Shrink Function
  function navbarShrink() {
    const navbar = document.getElementById('mainNav');
    const pageTop = document.getElementById('page-top');

    if (!navbar || !pageTop) return;

    if (pageTop.scrollTop === 0) {
      navbar.classList.remove('navbar-shrink');
    } else {
      navbar.classList.add('navbar-shrink');
    }
  }

  function enableNavbarShrink() {
    const pageTop = document.getElementById('page-top');
    if (!pageTop) return;

    pageTop.addEventListener('scroll', navbarShrink);
    navbarShrink();
  }

  navbarShrink();

  document.getElementById('page-top').addEventListener('scroll', navbarShrink);

  const mainNav = document.body.querySelector('#mainNav');
  if (mainNav) {
    new bootstrap.ScrollSpy(document.getElementById('page-top'), {
      target: '#mainNav',
      offset: 70
    });
  };

  const navbarToggler = document.body.querySelector('.navbar-toggler');
  const responsiveNavItems = [].slice.call(
    document.querySelectorAll('#navbarResponsive .nav-link')
  );
  responsiveNavItems.map(function (responsiveNavItem) {
    responsiveNavItem.addEventListener('click', () => {
      if (window.getComputedStyle(navbarToggler).display !== 'none') {
        navbarToggler.click();
      }
    });
  });

});