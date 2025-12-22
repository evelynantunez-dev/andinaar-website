// gracias.js — micro animación suave de entrada + parallax mínimo (opcional)
(function () {
  const card = document.querySelector('.ty__card');
  if (!card) return;

  // Entrada
  requestAnimationFrame(() => card.classList.add('in'));

  // Parallax MUY leve solo si hay mouse y no es reduced motion
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  const a = document.querySelector('.ty__deco--a');
  const b = document.querySelector('.ty__deco--b');
  if (!a || !b) return;

  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    const dx = (e.clientX - cx) / cx; // -1..1
    const dy = (e.clientY - cy) / cy;

    a.style.transform = `translate(${dx * 14}px, ${dy * 10}px)`;
    b.style.transform = `translate(${dx * -12}px, ${dy * -8}px)`;
  }, { passive: true });
})();
