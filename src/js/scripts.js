window.addEventListener('DOMContentLoaded', event => {

  const hasSeenIntro = localStorage.getItem('hasSeenIntro');
  const videoContainer = document.getElementById('video-container');
  const video = document.getElementById('intro-video');
  const pageTop = document.getElementById('page-top');

  function showPage() {
    videoContainer.classList.add('fade-out');
    setTimeout(() => {
      videoContainer.style.display = 'none';
      pageTop.style.display = 'block';
      document.body.style.overflow = 'auto';
    }, 1000);
  }

  if (hasSeenIntro) {
    videoContainer.style.display = 'none';
    pageTop.style.display = 'block';
    document.body.style.overflow = 'auto';
  } else {
    localStorage.setItem('hasSeenIntro', 'true');
    video.addEventListener('ended', showPage);
    document.body.style.overflow = 'hidden';
  }

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


  const logo = document.getElementById("stickyLogo");
  const footer = document.getElementById("footer");

  function updateLogoPosition() {
    const footerTop = footer.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (footerTop < windowHeight) {
      const overlap = windowHeight - footerTop - 10;
      logo.style.bottom = `${overlap}px`;
    } else {
      logo.style.bottom = '10px';
    }
  }

  window.addEventListener('scroll', updateLogoPosition);
  window.addEventListener('resize', updateLogoPosition);

  updateLogoPosition();

  // Navbar shrink function
  var navbarShrink = function () {
    const navbarCollapsible = document.body.querySelector('#mainNav');
    if (!navbarCollapsible) {
      return;
    }
    if (window.scrollY === 0) {
      navbarCollapsible.classList.remove('navbar-shrink')
    } else {
      navbarCollapsible.classList.add('navbar-shrink')
    }

  };

  // Shrink the navbar 
  navbarShrink();

  // Shrink the navbar when page is scrolled
  document.addEventListener('scroll', navbarShrink);

  //  Activate Bootstrap scrollspy on the main nav element
  const mainNav = document.body.querySelector('#mainNav');
  if (mainNav) {
    new bootstrap.ScrollSpy(document.getElementById('page-top'), {
      target: '#mainNav',
      offset: 70
    });
  };

  // Collapse responsive navbar when toggler is visible
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
    'btn-rent': 'rent-form'
  };

  const popupOverlay = document.getElementById('popup-overlay');
  const closePopupBtn = document.getElementById('close-popup');

  Object.keys(formMap).forEach(buttonId => {
    const button = document.getElementById(buttonId);
    if (button) {
      button.addEventListener('click', () => {
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
