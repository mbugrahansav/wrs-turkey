console.log("JS yüklendi");
let currentLang = localStorage.getItem('selectedLanguage') || "tr";

loadLanguage(currentLang);

        const languageSelector = document.querySelector('.language-selector');
        const languageTrigger = document.querySelector('.language-trigger');
        const languageOptions = document.querySelectorAll('.language-option');
        const currentFlag = document.getElementById('currentFlag');
        const currentLangCode = document.getElementById('currentLangCode');

        // Dropdown toggle
        languageTrigger.addEventListener('click', () => {
            languageSelector.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (event) => {
            if (!languageSelector.contains(event.target)) {
                languageSelector.classList.remove('active');
            }
        });

        // Dil seçicisini güncelleme fonksiyonu
        function updateLanguageSelector(lang) {
            const option = document.querySelector(`.language-option[data-lang="${lang}"]`);
            if (option) {
                const selectedFlag = option.querySelector('img').src;
                const selectedLangName = option.querySelector('.language-code').textContent;
                
                currentFlag.src = selectedFlag;
                currentLangCode.textContent = selectedLangName;
            }
        }

        // Language selection
        languageOptions.forEach(option => {
            option.addEventListener('click', () => {
                const selectedLang = option.getAttribute('data-lang');
                const selectedFlag = option.querySelector('img').src;
                const selectedLangName = option.querySelector('.language-code').textContent;

                // Update current language display
                currentFlag.src = selectedFlag;
                currentLangCode.textContent = selectedLangName;

                // Close dropdown
                languageSelector.classList.remove('active');

                // Dil değiştirme
                loadLanguage(selectedLang);
                currentLang = selectedLang;
                
                // Tarayıcı hafızasına kaydet
                localStorage.setItem('selectedLanguage', selectedLang);
                
                // Landing page dil değişimi için custom event yayınla
                const event = new CustomEvent('languageChanged', { detail: { language: selectedLang } });
                document.dispatchEvent(event);
            });
        });

        function loadLanguage(lang) {
            fetch(`src/lang/${lang}.json`)
                .then(res => res.json())
                .then(data => {
                    // ID'ye göre metinleri güncelle
                    for (const key in data) {
                        if (data.hasOwnProperty(key)) {
                            const elements = document.querySelectorAll(`#${key}, [data-i18n="${key}"]`);
                            elements.forEach(element => {
                                if (element) {
                                    // Button için innerText, diğerleri için innerHTML kullan
                                    if (element.tagName === 'BUTTON') {
                                        element.innerText = data[key];
                                    } else {
                                        element.innerHTML = data[key];
                                    }
                                }
                            });
                        }
                    }
                    
                    // data-i18n özniteliğine göre güncelle
                    document.querySelectorAll('[data-i18n]').forEach(el => {
                        const key = el.getAttribute('data-i18n');
                        if (data[key]) {
                            // Button için innerText, diğerleri için textContent kullan
                            if (el.tagName === 'BUTTON') {
                                el.innerText = data[key];
                            } else {
                                el.textContent = data[key];
                            }
                        }
                    });
                    
                    // Globale kaydet (başka scriptler kullanabilir)
                    window.i18nData = data;
                })
                .catch(err => {
                    console.error(`Dil dosyası yüklenirken hata oluştu (${lang}):`, err);
                });
        }
        
        // Diğer sayfalarda kullanılabilecek public API
        window.i18n = {
            changeLanguage: function(lang) {
                loadLanguage(lang);
                currentLang = lang;
                localStorage.setItem('selectedLanguage', lang);
                updateLanguageSelector(lang);
            },
            getCurrentLanguage: function() {
                return currentLang;
            },
            translate: function(key) {
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

  const formMap = {
    'btn-broker': 'broker-form',
    'btn-subagency': 'subagency-form',
    'btn-fleet': 'fleet-form',
  };

  const popupOverlay = document.getElementById('popup-overlay');
  const closePopupBtn = document.getElementById('close-popup');

  Object.keys(formMap).forEach(buttonId => {
    const button = document.getElementById(buttonId);
    if (button) {
      button.addEventListener('click', () => {
        console.log("selam");
        document.querySelectorAll('.popup-form').forEach(el => el.classList.add('d-none'));
        const formId = formMap[buttonId];
        document.getElementById(formId).classList.remove('d-none');
        document.body.classList.add("overflow-hidden");
        popupOverlay.classList.remove('d-none');
      });
    }
  });

  closePopupBtn.addEventListener('click', () => {
    popupOverlay.classList.add('d-none');
    document.body.classList.remove("overflow-hidden");
  });

});