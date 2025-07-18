import React from 'react';

export default function About() {
  return (
    <section id="about" className="py-20 px-4 md:px-0 flex flex-col items-center bg-black/80 text-center">
      <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-neonPink mb-8">À propos de moi</h2>
      <p className="max-w-2xl text-gray-200 text-lg font-poppins">
        Passionné par le développement web, la cybersécurité et les interfaces immersives, je conçois des expériences numériques uniques et performantes. J’aime explorer les univers futuristes, mixer design, animations et code pour créer des projets qui sortent du lot.
      </p>
    </section>
  );
}
