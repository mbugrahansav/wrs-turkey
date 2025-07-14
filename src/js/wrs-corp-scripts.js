// Popup --------------------------------------------------------------------------

/* function showPopup() {
  const overlay = document.getElementById('popup-overlay');
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function hidePopup() {
  const overlay = document.getElementById('popup-overlay');
  overlay.classList.remove('show');
  document.body.style.overflow = 'auto';
}

document.getElementById('popup-overlay').addEventListener('click', function (e) {
  if (e.target === this) {
    hidePopup();
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    hidePopup();
  }
});

function openThankYouPopup() {
  const popup = document.querySelector('#thank-you-popup');
  if (popup) {
    popup.style.display = 'block';
  }
} */


document.addEventListener("DOMContentLoaded", function () {
  const track = document.getElementById('logoTrack');

  const logoNames = [
    'agrotv.jpg',
    'alfa-tohum.jpg',
    'allied-minerals.png',
    'artmar.jpg',
    'donas.jpg',
    'ertanlar.jpg',
    'fantom.png',
    'hilleshog.png',
    'indigo.jpg',
    'kayseri-seker.jpg',
    'kilicoglu-kiremit.jpg',
    'kuzey-tohumculuk.jpg',
    'KWS.jpg',
    'lgtohum.jpg',
    'likrom.jpg',
    'limagrein.jpg',
    'maribo.jpg',
    'marka-tarim.png',
    'netafim.jpg',
    'safi-smart.jpg',
    'sevanderhave.jpg',
    'syngenta.jpg',
    'taegu-tec.jpg',
    'tessenderlo.jpg',
    'ziraat-bankasi.jpg'
  ];

  track.innerHTML = '';

  logoNames.forEach((logoName, index) => {
    const img = document.createElement('img');
    img.src = `../src/assets/img/references-logos/${logoName}`;
    img.alt = `Reference Logo ${index + 1}`;
    img.loading = 'lazy';

    img.onerror = function () {
      this.style.display = 'none';
      console.warn(`Logo yüklenemedi: ${logoName}`);
    };

    track.appendChild(img);
  });

  const originalContent = track.innerHTML;
  track.innerHTML = originalContent + originalContent;

  track.addEventListener('animationiteration', function () {
    console.log('Animation completed one cycle');
  });
});



// card animations ----------------------------------------------------------------

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

// Tüm cardları observe et
document.querySelectorAll('.card').forEach(card => {
  observer.observe(card);
});



// Lang --------------------------------------------------------------------------

let currentLang = localStorage.getItem('selectedLanguage') || "tr";
loadLanguage(currentLang);

document.querySelectorAll('.language-selector').forEach(languageSelector => {
  const languageTrigger = languageSelector.querySelector('.language-trigger');
  const languageOptions = languageSelector.querySelectorAll('.language-option');
  const currentFlag = languageSelector.querySelector('.currentFlag');

  languageTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    languageSelector.classList.toggle('active');
  });

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
  fetch(`/src/lang/wrs-corp/${lang}.json`)
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








const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

navLinks.forEach(link => {
  link.addEventListener('click', function () {
    setTimeout(function () {
      document.querySelector('.navbar-toggler').click();
    }, 50);
  });
});

document.addEventListener('click', function (event) {
  const navbarCollapse = document.getElementById('navbarResponsive');
  const navbarToggler = document.querySelector('.navbar-toggler');

  if (navbarCollapse.classList.contains('show') &&
    !navbarCollapse.contains(event.target) &&
    event.target !== navbarToggler &&
    !navbarToggler.contains(event.target)) {

    setTimeout(function () {
      navbarToggler.click();
    }, 10);
  }
});

document.addEventListener('DOMContentLoaded', () => {

  const dropdown = document.querySelector('.dropdown');
  const dropdownToggle = document.querySelector('.dropdown-toggle');

  const popupOverlay = document.getElementById('form-popup-overlay');
  const closePopupBtn = document.getElementById('close-popup');
  const forms = document.querySelectorAll('.popup-form');

  document.addEventListener('click', function (event) {
    if (!dropdown.contains(event.target)) {
      dropdown.classList.remove('dropdown-open');
    }
  });

  const dropdownItems = document.querySelectorAll('.dropdown-item');
  dropdownItems.forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();

      dropdown.classList.remove('dropdown-open');

      const formId = this.getAttribute('data-form');

      forms.forEach(form => {
        form.classList.add('d-none');
      });

      const selectedForm = document.getElementById(formId);
      if (selectedForm) {
        selectedForm.classList.remove('d-none');
        popupOverlay.classList.remove('d-none');
      }
    });
  });


  closePopupBtn.addEventListener('click', function () {
    popupOverlay.classList.add('d-none');

    forms.forEach(form => {
      form.classList.add('d-none');
    });
  });

  popupOverlay.addEventListener('click', function (e) {
    if (e.target === popupOverlay) {
      popupOverlay.classList.add('d-none');

      forms.forEach(form => {
        form.classList.add('d-none');
      });
    }
  });

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

});