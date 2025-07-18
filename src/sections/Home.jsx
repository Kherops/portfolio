import React, { useEffect, useRef } from 'react';

export default function Home() {
  const canvasRef = useRef(null);

  // Fond animé type particules néon
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = Array.from({ length: 36 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 1 + Math.random() * 2.5,
      dx: (Math.random() - 0.5) * 0.8,
      dy: (Math.random() - 0.5) * 0.8,
      color: [
        '#00fff7',
        '#ff00c8',
        '#8f00ff',
        '#ff7a00',
      ][Math.floor(Math.random() * 4)],
    }));
    let running = true;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 18;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.restore();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      }
      if (running) requestAnimationFrame(animate);
    }
    animate();
    return () => { running = false; };
  }, []);

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#18122B] via-black to-[#232946]">
      {/* Fond animé canvas */}
      <canvas
        ref={canvasRef}
        width={1200}
        height={700}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
        style={{ minHeight: 400 }}
        aria-hidden="true"
      />
      {/* Bloc principal */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-4 py-16">
        {/* Avatar très grand, sans cercle */}
        <img
          src="/bright-colorful-acrylic-watercolor-splash-600nw-2450236343-ezgif.com-webp-to-jpg-converter.png"
          alt="Avatar Louis PROTON"
          className="w-60 h-60 md:w-[384px] md:h-[384px] object-cover rounded-full shadow-[0_0_16px_#3de2fc80] mb-4 md:mb-8 animate-float border-4 border-[#232946]"
          style={{ objectPosition: 'center' }}
        />
        {/* Texte */}
        <h1 className="text-4xl md:text-6xl font-inter font-extrabold text-neonCyan drop-shadow-[0_0_8px_#3de2fc80] mb-4 md:mb-6 animate-fade-in">Louis PROTON</h1>
        <div className="flex flex-col items-center justify-center text-center w-full">
          <p className="text-2xl md:text-3xl font-inter text-neonPink mb-4 animate-fade-in">Développeur Web Full Stack & Mastère Cybersécurité</p>
          <p className="text-lg md:text-2xl font-inter text-neonWhite mb-8 animate-fade-in max-w-2xl">
            Étudiant à Epitech (rentrée sept 2025), je recherche une alternance dès janvier 2026 pour 2 ans et demi (Mastère Cybersécurité Epitech).
          </p>
          <a href="/cv.pdf" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-4 text-xl bg-neonViolet rounded-2xl text-white font-bold shadow-neonViolet hover:bg-neonPink transition animate-fade-in">Voir mon CV</a>
        </div>
      </div>
    </section>
  );
}

