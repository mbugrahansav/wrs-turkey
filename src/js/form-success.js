function handleFormSuccess() {
  if (window.location.hash !== '#form-success') return;

  if (document.getElementById('popup-overlay') && typeof showPopup === 'function') {
    showPopup();
  } else {
    const english = localStorage.getItem('selectedLanguage') === 'en';
    const dialog = document.createElement('dialog');
    dialog.className = 'form-success-dialog';
    dialog.setAttribute('aria-labelledby', 'form-success-title');

    const title = document.createElement('h2');
    title.id = 'form-success-title';
    title.textContent = english ? 'Thank you!' : 'Teşekkür Ederiz!';
    const message = document.createElement('p');
    message.textContent = english
      ? 'Your message has been sent. We will contact you as soon as possible.'
      : 'Mesajınız gönderildi. En kısa sürede sizinle iletişime geçeceğiz.';
    const close = document.createElement('button');
    close.type = 'button';
    close.textContent = english ? 'OK' : 'Tamam';
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => dialog.remove());
    dialog.append(title, message, close);
    document.body.appendChild(dialog);
    dialog.showModal();
  }

  history.replaceState(null, '', window.location.pathname + window.location.search + '#contact');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', handleFormSuccess);
} else {
  handleFormSuccess();
}
window.addEventListener('hashchange', handleFormSuccess);
