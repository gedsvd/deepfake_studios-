import confetti from 'canvas-confetti';

/**
 * Emulates Streamlit's st.balloons() using canvas-confetti with upward floating particle physics
 */
export function fireBalloons() {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      colors: ['#00f0ff', '#7b61ff', '#00e68c', '#ff4d6d', '#38bdf8'],
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      colors: ['#00f0ff', '#7b61ff', '#00e68c', '#ff4d6d', '#38bdf8'],
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };

  frame();
}
