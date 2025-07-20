import React, { useRef, useEffect, useState } from 'react';
import { getScores, saveScore } from '../lib/supabase';

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
  const [ranking, setRanking] = useState([]);
  const [isLoadingScores, setIsLoadingScores] = useState(true);
  const [isSavingScore, setIsSavingScore] = useState(false);
  const [showRank, setShowRank] = useState(false);
  const [confetti, setConfetti] = useState([]);

  // Charger les scores au démarrage
  useEffect(() => {
    const loadScores = async () => {
      setIsLoadingScores(true);
      try {
        const scores = await getScores();
        setRanking(scores);
      } catch (error) {
        console.error('Erreur lors du chargement des scores:', error);
        // En cas d'erreur, utiliser le localStorage comme fallback
        const localScores = JSON.parse(localStorage.getItem('snakeRanking') || '[]');
        setRanking(localScores);
      } finally {
        setIsLoadingScores(false);
      }
    };
    
    loadScores();
  }, []);

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
          // Sauvegarder la position de la pomme avant de la remplacer
          const applePosition = { x: apple.x, y: apple.y };
          setApple(getRandomApple(newSnake));
          setScore((s) => s + 1);
          // Système de particules cyberpunk - explosion depuis la pomme
          const cyberpunkColors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff00', '#ff0000']; // Cyan, Magenta, Jaune, Vert, Rouge
          setConfetti((old) => [
            ...old,
            ...Array.from({ length: 12 }, () => {
              // Angle aléatoire pour une dispersion uniforme dans toutes les directions
              const angle = Math.random() * Math.PI * 2;
              const speed = (0.8 + Math.random() * 1.2) * 1.3; // Vitesse augmentée de 30% : entre 1.04 et 2.6
              const startX = (applePosition.x + 0.5) * 20;
              const startY = (applePosition.y + 0.5) * 20;
              return {
                x: startX, // Partir exactement du centre de la pomme
                y: startY,
                originX: startX, // Position d'origine pour calculer la distance
                originY: startY,
                dx: Math.cos(angle) * speed, // Vitesse horizontale basée sur l'angle
                dy: Math.sin(angle) * speed, // Vitesse verticale basée sur l'angle
                alpha: 1,
                color: cyberpunkColors[Math.floor(Math.random() * cyberpunkColors.length)],
                size: 3 + Math.random() * 5, // Taille variable entre 3 et 8
                birthTime: Date.now(), // Moment de création de la particule
                lifespan: 1000, // Durée de vie en millisecondes (1 seconde)
                maxDistance: 80 + Math.random() * 40, // Distance maximale avant disparition complète (80-120 pixels)
              };
            }),
          ]);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, SPEED);
    return () => clearInterval(interval);
  }, [dir, apple, gameOver]);

  // Gestion des contrôles clavier et tactiles
  const handleDirectionChange = (newDir) => {
    if (gameOver) return;
    if (newDir.x === 0 && newDir.y === -1 && dir.y !== 1) setDir(newDir); // Haut
    if (newDir.x === 0 && newDir.y === 1 && dir.y !== -1) setDir(newDir);  // Bas
    if (newDir.x === -1 && newDir.y === 0 && dir.x !== 1) setDir(newDir);  // Gauche
    if (newDir.x === 1 && newDir.y === 0 && dir.x !== -1) setDir(newDir);  // Droite
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (gameOver) return;
      // Empêcher le scroll de la page avec les flèches directionnelles
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'ArrowUp') handleDirectionChange({ x: 0, y: -1 });
      if (e.key === 'ArrowDown') handleDirectionChange({ x: 0, y: 1 });
      if (e.key === 'ArrowLeft') handleDirectionChange({ x: -1, y: 0 });
      if (e.key === 'ArrowRight') handleDirectionChange({ x: 1, y: 0 });
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [dir, gameOver]);

  // Désactiver le scroll sur desktop uniquement
  useEffect(() => {
    const isDesktop = window.innerWidth >= 768; // md breakpoint de Tailwind
    
    if (isDesktop) {
      // Désactiver le scroll sur desktop
      const preventDefault = (e) => e.preventDefault();
      
      // Empêcher le scroll avec la molette, les flèches, espace, etc.
      window.addEventListener('wheel', preventDefault, { passive: false });
      window.addEventListener('touchmove', preventDefault, { passive: false });
      window.addEventListener('keydown', (e) => {
        // Empêcher les touches de scroll (espace, page up/down, home, end)
        if (['Space', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.code)) {
          e.preventDefault();
        }
      });
      
      // Empêcher le scroll via CSS
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restaurer le scroll au démontage
        window.removeEventListener('wheel', preventDefault);
        window.removeEventListener('touchmove', preventDefault);
        document.body.style.overflow = 'auto';
      };
    }
  }, []);

  // Confetti animation
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    let running = true;
    function drawConfetti() {
      setConfetti((old) => {
        const currentTime = Date.now();
        return old
          .map((c) => {
            const age = currentTime - c.birthTime; // Âge en millisecondes
            const lifeRatio = Math.min(age / c.lifespan, 1); // Ratio entre 0 et 1
            const deltaTime = 16.67; // Approximation pour 60fps (peut varier selon l'écran)
            
            // Nouvelles positions
            const newX = c.x + (c.dx * deltaTime / 16.67);
            const newY = c.y + (c.dy * deltaTime / 16.67);
            
            // Calculer la distance parcourue depuis l'origine
            const distanceFromOrigin = Math.sqrt(
              Math.pow(newX - c.originX, 2) + Math.pow(newY - c.originY, 2)
            );
            
            // Easing pour un ralentissement plus rapide et plus contenu
            const easingFactor = Math.pow(0.94, deltaTime / 16.67); // Ralentissement plus fort
            
            // Calcul d'alpha basé sur le temps ET la distance
            const timeAlpha = 1 - Math.pow(lifeRatio, 3); // Disparition temporelle
            const distanceRatio = Math.min(distanceFromOrigin / c.maxDistance, 1); // Ratio de distance
            const distanceAlpha = 1 - Math.pow(distanceRatio, 2); // Disparition par distance (courbe quadratique)
            
            // Combiner les deux alphas (prendre le minimum pour une disparition plus rapide)
            const combinedAlpha = Math.min(timeAlpha, distanceAlpha);
            
            return {
              ...c,
              x: newX,
              y: newY,
              dx: c.dx * easingFactor, // Ralentissement plus smooth avec easing
              dy: c.dy * easingFactor, // Ralentissement vertical plus smooth
              alpha: Math.max(0, combinedAlpha), // Disparition basée sur temps ET distance
            };
          })
          .filter((c) => (currentTime - c.birthTime) < c.lifespan); // Filtrer par temps réel
      });
      ctx.clearRect(0, 0, 400, 400);
      // Draw cyberpunk particles avec effet smooth
      confetti.forEach((c) => {
        ctx.save();
        ctx.globalAlpha = c.alpha;
        
        // Effet de glow plus doux avec plusieurs couches
        const glowIntensity = c.alpha * 20;
        ctx.shadowColor = c.color;
        ctx.shadowBlur = glowIntensity;
        
        // Particule principale avec coins légèrement arrondis pour plus de douceur
        ctx.fillStyle = c.color;
        const x = c.x - c.size / 2; // Centrer la particule
        const y = c.y - c.size / 2;
        
        // Dessiner un carré avec effet de glow progressif
        ctx.fillRect(x, y, c.size, c.size);
        
        // Ajouter un effet de core plus brillant au centre
        ctx.shadowBlur = glowIntensity / 2;
        ctx.globalAlpha = c.alpha * 0.8;
        ctx.fillRect(x + c.size * 0.25, y + c.size * 0.25, c.size * 0.5, c.size * 0.5);
        
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
  }, [apple, snake]);

  // Classement avec Supabase
  const saveRank = async () => {
    const name = pseudo.trim() || getDefaultPseudo();
    setIsSavingScore(true);
    
    try {
      // Sauvegarder le score en ligne
      await saveScore(name, score);
      
      // Recharger les scores pour avoir la liste à jour
      const updatedScores = await getScores();
      setRanking(updatedScores);
      
      // Aussi sauvegarder localement comme backup
      localStorage.setItem('snakeRanking', JSON.stringify(updatedScores));
      
      setShowRank(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      
      // En cas d'erreur, utiliser le localStorage comme fallback
      const newRank = [...ranking, { player_name: name, score }].sort((a, b) => b.score - a.score).slice(0, 10);
      setRanking(newRank);
      localStorage.setItem('snakeRanking', JSON.stringify(newRank));
      setShowRank(false);
      
      // Optionnel: afficher une notification d'erreur à l'utilisateur
      alert('Erreur lors de la sauvegarde en ligne. Score sauvegardé localement.');
    } finally {
      setIsSavingScore(false);
    }
  };
  
  function closeRankModal() {
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
    <section className="flex flex-col pt-8 md:pt-12 pb-24 bg-gradient-to-br from-[#18122B] via-black to-[#232946] min-h-screen">
      {/* Titre en haut - Visibilité garantie */}
      <div className="w-full flex justify-center items-center mb-8 px-4 mt-4">
        <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-neonPink text-center relative z-20 leading-tight">
          Snake 2077
        </h2>
      </div>
      
      {/* Zone de jeu - Layout mobile */}
      <div className="flex flex-col items-center justify-center gap-4 px-4 mb-6">
        {/* Canvas du jeu */}
        <div className="flex-shrink-0">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="rounded-2xl shadow-neonCyan border-4 border-neonCyan bg-black"
            style={{ 
              maxWidth: '280px', 
              width: '100%', 
              height: 'auto', 
              aspectRatio: '1/1'
            }}
          />
        </div>
        
        {/* Score et Restart - Juste sous le snake */}
        <div className="flex flex-row items-center justify-between gap-4 w-full max-w-xs">
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-neonPink rounded-xl text-white font-bold shadow-neonPink hover:bg-neonCyan transition text-sm"
          >
            Restart
          </button>
          <div className="text-neonCyan font-orbitron text-lg">Score : {score}</div>
        </div>
        
        {/* Contrôles tactiles - Visible uniquement sur mobile */}
        <div className="flex md:hidden flex-col items-center justify-center mt-2 mb-4">
          <div className="grid grid-cols-3 gap-2 w-48 h-48">
            {/* Ligne du haut */}
            <div></div>
            <button
              onTouchStart={() => handleDirectionChange({ x: 0, y: -1 })}
              onClick={() => handleDirectionChange({ x: 0, y: -1 })}
              className="bg-neonCyan/20 border-2 border-neonCyan rounded-xl flex items-center justify-center text-neonCyan text-2xl font-bold hover:bg-neonCyan/40 active:bg-neonCyan/60 transition-all duration-150 h-14 w-14"
              disabled={gameOver}
            >
              ↑
            </button>
            <div></div>
            
            {/* Ligne du milieu */}
            <button
              onTouchStart={() => handleDirectionChange({ x: -1, y: 0 })}
              onClick={() => handleDirectionChange({ x: -1, y: 0 })}
              className="bg-neonCyan/20 border-2 border-neonCyan rounded-xl flex items-center justify-center text-neonCyan text-2xl font-bold hover:bg-neonCyan/40 active:bg-neonCyan/60 transition-all duration-150 h-14 w-14"
              disabled={gameOver}
            >
              ←
            </button>
            <div></div>
            <button
              onTouchStart={() => handleDirectionChange({ x: 1, y: 0 })}
              onClick={() => handleDirectionChange({ x: 1, y: 0 })}
              className="bg-neonCyan/20 border-2 border-neonCyan rounded-xl flex items-center justify-center text-neonCyan text-2xl font-bold hover:bg-neonCyan/40 active:bg-neonCyan/60 transition-all duration-150 h-14 w-14"
              disabled={gameOver}
            >
              →
            </button>
            
            {/* Ligne du bas */}
            <div></div>
            <button
              onTouchStart={() => handleDirectionChange({ x: 0, y: 1 })}
              onClick={() => handleDirectionChange({ x: 0, y: 1 })}
              className="bg-neonCyan/20 border-2 border-neonCyan rounded-xl flex items-center justify-center text-neonCyan text-2xl font-bold hover:bg-neonCyan/40 active:bg-neonCyan/60 transition-all duration-150 h-14 w-14"
              disabled={gameOver}
            >
              ↓
            </button>
            <div></div>
          </div>
        </div>
      </div>
      
      {/* Hall of Fame - En bas, scrollable sur mobile */}
      <div className="flex-1 px-4 pb-8">
        <h3 className="text-neonViolet font-bold text-xl mb-4 text-center">Hall of Fame</h3>
        <div className="max-w-md mx-auto">
          {isLoadingScores ? (
            <div className="text-center text-gray-400 text-lg">Chargement des scores...</div>
          ) : (
            <ul className="space-y-2 text-center">
              {ranking.map((rank, index) => (
                <li key={rank.id || index} className="font-orbitron text-neonCyan text-lg">
                  {index + 1}. {rank.player_name || rank.name} <span className="text-neonPink font-bold">{rank.score}</span>
                </li>
              ))}
              {ranking.length === 0 && (
                <li className="text-gray-400 text-lg">Aucun score enregistré</li>
              )}
            </ul>
          )}
        </div>
      </div>
      
      {/* Modal classement */}
      {showRank && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={closeRankModal}>
          <div className="bg-[#18122B] rounded-2xl shadow-2xl p-8 max-w-sm w-full relative animate-fade-in" onClick={(e) => e.stopPropagation()}>
            {/* Croix de fermeture */}
            <button 
              onClick={closeRankModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-neonPink transition-colors duration-200 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/30"
            >
              ×
            </button>
            <h3 className="text-2xl font-orbitron font-bold text-neonCyan mb-2">Bravo&nbsp;!</h3>
            <p className="text-gray-100 mb-4 text-center">Votre score&nbsp;: <span className="text-neonPink font-bold">{score}</span></p>
            <input
              type="text"
              placeholder="Votre pseudo (facultatif)"
              value={pseudo}
              onChange={e => setPseudo(e.target.value)}
              className="w-full mb-4 px-3 py-2 rounded bg-black/60 border border-neonCyan text-white font-poppins focus:outline-none focus:ring-2 focus:ring-neonCyan"
            />
            <button 
              onClick={saveRank} 
              disabled={isSavingScore}
              className={`px-6 py-2 rounded-xl text-white font-bold transition w-full ${
                isSavingScore 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-neonViolet shadow-neonViolet hover:bg-neonPink'
              }`}
            >
              {isSavingScore ? 'Sauvegarde en cours...' : 'Enregistrer mon score'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
