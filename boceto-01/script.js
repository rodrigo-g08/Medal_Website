const video = document.querySelector('.hero__video');
const fallback = document.querySelector('.hero__fallback');
const logo = document.querySelector('.logo-lockup');

video?.addEventListener('canplay', () => {
  fallback.style.opacity = '0';
  fallback.style.transition = 'opacity .5s ease';
});

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (!logo) return;
  const progress = Math.min(y / window.innerHeight, 1);
  logo.style.transform = `translateY(${progress * -7}vh) scale(${1 - progress * 0.06})`;
  logo.style.opacity = String(1 - progress * 0.35);
});
