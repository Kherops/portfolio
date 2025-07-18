import React, { useRef, useEffect, useState } from 'react';

const GRID_SIZE = 20;
const SPEED = 100;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];
const INITIAL_DIR = { x: 1, y: 0 };

function getRandomApple(snake) {
  let apple;
  do {
    apple = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some((s) => s.x === apple.x && s.y === apple.y));
  return apple;
}

function getDefaultPseudo() {
  const animals = ['CyberFox', 'NeonWolf', 'PixelCat', 'BitSnake', 'GlitchOwl', 'NovaDog', 'VaporBear', 'SynthLion'];
  return animals[Math.floor(Math.random() * animals.length)] + Math.floor(Math.random() * 1000);
}

export default function Snake() {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [dir, setDir] = useState(INITIAL_DIR);
  const [apple, setApple] = useState(getRandomApple(INITIAL_SNAKE));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [pseudo, setPseudo] = useState('');
  const [ranking, setRanking] = useState(() => JSON.parse(localStorage.getItem('snakeRanking') || '[]'));
  const [showRank, setShowRank] = useState(false);
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setSnake((prev) => {
        const newHead = { x: prev[0].x + dir.x, y: prev[0].y + dir.y };
        // Collision
        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE ||
          prev.some((s) => s.x === newHead.x && s.y === newHead.y)
        ) {
          setGameOver(true);
          setShowRank(true);
          return prev;
        }
        let newSnake = [newHead, ...prev];
        if (newHead.x === apple.x && newHead.y === apple.y) {
          setApple(getRandomApple(newSnake));
          setScore((s) => s + 1);
          // Confetti
          setConfetti((old) => [
            ...old,
            ...Array.from({ length: 18 }, () => ({
              x: (newHead.x + 0.5) * 20,
              y: (newHead.y + 0.5) * 20,
              dx: (Math.random() - 0.5) * 6,
              dy: (Math.random() - 1.2) * 6,
              alpha: 1,
              color: '#00fff7',
              size: 6 + Math.random() * 4,
            })),
          ]);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, SPEED);
    return () => clearInterval(interval);
  }, [dir, apple, gameOver]);

  useEffect(() => {
    const handleKey = (e) => {
      if (gameOver) return;
      if (e.key === 'ArrowUp' && dir.y !== 1) setDir({ x: 0, y: -1 });
      if (e.key === 'ArrowDown' && dir.y !== -1) setDir({ x: 0, y: 1 });
      if (e.key === 'ArrowLeft' && dir.x !== 1) setDir({ x: -1, y: 0 });
      if (e.key === 'ArrowRight' && dir.x !== -1) setDir({ x: 1, y: 0 });
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [dir, gameOver]);

  // Confetti animation
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    let running = true;
    function drawConfetti() {
      setConfetti((old) =>
        old
          .map((c) => ({ ...c, x: c.x + c.dx, y: c.y + c.dy, dy: c.dy + 0.15, alpha: c.alpha - 0.02 }))
          .filter((c) => c.alpha > 0)
      );
      ctx.clearRect(0, 0, 400, 400);
      // Draw confetti
      confetti.forEach((c) => {
        ctx.save();
        ctx.globalAlpha = c.alpha;
        ctx.fillStyle = c.color;
        ctx.shadowColor = c.color;
        ctx.shadowBlur = 12;
        ctx.fillRect(c.x, c.y, c.size, c.size);
        ctx.restore();
      });
      // Draw game
      // Grid
      ctx.strokeStyle = '#232946';
      ctx.lineWidth = 1;
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 20, 0);
        ctx.lineTo(i * 20, 400);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * 20);
        ctx.lineTo(400, i * 20);
        ctx.stroke();
      }
      // Apple
      ctx.save();
      ctx.shadowColor = '#00fff7';
      ctx.shadowBlur = 16;
      ctx.fillStyle = '#00fff7';
      ctx.fillRect(apple.x * 20, apple.y * 20, 20, 20);
      ctx.restore();
      // Snake
      snake.forEach((s, i) => {
        ctx.save();
        ctx.shadowColor = '#00fff7';
        ctx.shadowBlur = 12;
        ctx.fillStyle = i === 0 ? '#ff00c8' : '#00fff7';
        ctx.fillRect(s.x * 20, s.y * 20, 20, 20);
        ctx.restore();
      });
      if (running) requestAnimationFrame(drawConfetti);
    }
    drawConfetti();
    return () => {
      running = false;
    };
    // eslint-disable-next-line
  }, [apple, snake, confetti]);

  // Classement
  function saveRank() {
    const name = pseudo.trim() || getDefaultPseudo();
    const newRank = [...ranking, { name, score }].sort((a, b) => b.score - a.score).slice(0, 10);
    setRanking(newRank);
    localStorage.setItem('snakeRanking', JSON.stringify(newRank));
    setShowRank(false);
  }
  function resetGame() {
    setSnake(INITIAL_SNAKE);
    setDir(INITIAL_DIR);
    setApple(getRandomApple(INITIAL_SNAKE));
    setScore(0);
    setGameOver(false);
    setPseudo('');
    setConfetti([]);
  }

  return (
    <section className="flex flex-col items-center py-16 min-h-[80vh] bg-gradient-to-br from-[#18122B] via-black to-[#232946]">
      <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-neonPink mb-6">Snake Cyberpunk 2077</h2>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="rounded-2xl shadow-neonCyan border-4 border-neonCyan bg-black mb-6"
        style={{ maxWidth: 360, width: '100%', height: 'auto', aspectRatio: '1/1' }}
      />
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-2xl justify-center items-start">
        <div className="flex-1 text-center">
          <div className="text-neonCyan font-orbitron text-xl mb-2">Score : {score}</div>
          <button onClick={resetGame} className="mt-2 px-5 py-2 bg-neonPink rounded-xl text-white font-bold shadow-neonPink hover:bg-neonCyan transition">Restart</button>
        </div>
        <div className="flex-1">
          <h3 className="text-neonViolet font-bold text-lg mb-2 text-center">Hall of Fame</h3>
          <ul className="space-y-1 text-center">
            {ranking.map((r, i) => (
              <li key={i} className="font-orbitron text-neonCyan">
                {i + 1}. {r.name} <span className="text-neonPink">{r.score}</span>
              </li>
            ))}
            {ranking.length === 0 && <li className="text-gray-400">Aucun score enregistré</li>}
          </ul>
        </div>
      </div>
      {/* Modal classement */}
      {showRank && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#18122B] rounded-2xl shadow-2xl p-8 max-w-sm w-full relative animate-fade-in">
            <h3 className="text-2xl font-orbitron font-bold text-neonCyan mb-2">Bravo&nbsp;!</h3>
            <p className="text-gray-100 mb-4 text-center">Votre score&nbsp;: <span className="text-neonPink font-bold">{score}</span></p>
            <input
              type="text"
              placeholder="Votre pseudo (facultatif)"
              value={pseudo}
              onChange={e => setPseudo(e.target.value)}
              className="w-full mb-4 px-3 py-2 rounded bg-black/60 border border-neonCyan text-white font-poppins focus:outline-none focus:ring-2 focus:ring-neonCyan"
            />
            <button onClick={saveRank} className="px-6 py-2 bg-neonViolet rounded-xl text-white font-bold shadow-neonViolet hover:bg-neonPink transition w-full">Enregistrer mon score</button>
          </div>
        </div>
      )}
    </section>
  );
}
