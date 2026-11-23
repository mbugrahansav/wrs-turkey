const returnLink = document.getElementById('return-to-site');
const source = new URLSearchParams(window.location.search).get('from');
const destinations = {
  'wrs-corp': { href: '/wrs-corp/', label: '← WRS CORP' },
  'car-rental': { href: '/car-rental/', label: '← ARAÇ KİRALAMA' }
};
let destination = destinations[source];
if (!destination && document.referrer) {
  const referrer = new URL(document.referrer);
  if (referrer.origin === window.location.origin) {
    destination = destinations[referrer.pathname.split('/')[1]];
  }
}
if (destination && returnLink) {
  returnLink.href = destination.href;
  returnLink.textContent = destination.label;
}
