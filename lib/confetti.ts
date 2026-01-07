// Lightweight confetti effect using existing CSS animation from globals.css
export function triggerConfetti(origin: { x: number; y: number }) {
  const container = document.createElement('div');
  container.className = 'particle-container';
  container.style.left = `${origin.x}px`;
  container.style.top = `${origin.y}px`;
  document.body.appendChild(container);

  const colors = [
    'oklch(0.7 0.15 250)',
    'oklch(0.65 0.18 145)',
    'oklch(0.75 0.2 50)',
    'oklch(0.6 0.12 280)',
  ];

  for (let i = 0; i < 12; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const angle = (Math.PI * 2 * i) / 12;
    const distance = 40 + Math.random() * 40;
    particle.style.cssText = `
      --tx: ${Math.cos(angle) * distance}px;
      --ty: ${Math.sin(angle) * distance - 30}px;
      --rot: ${Math.random() * 360}deg;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: ${colors[i % colors.length]};
    `;
    container.appendChild(particle);
  }

  setTimeout(() => container.remove(), 700);
}
