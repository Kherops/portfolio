import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const projects = [
  {
    title: 'Snake Cyberpunk 2077',
    description: 'Faites votre meilleur score et entrez dans le hall of fame.',
    stack: ['React', 'Canvas', 'JavaScript'],
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    link: '/snake',
    screenshots: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    title: 'Shop-Seadoo.com',
    description: 'Site e-commerce de pièces détachées et accessoires pour motomarines.',
    stack: ['Next.js', 'Shopify', 'Custom API'],
    image: '/portfolio/shopseadoo.png',
    link: 'https://shop-seadoo.com',
    screenshots: [
      '/portfolio/shopseadoo.png',
    ],
  },
  {
    title: 'Seadoo.fr',
    description: 'Site vitrine officiel de Seadoo France. Présentation de la marque et de la gamme motomarines.',
    stack: ['WordPress', 'Custom Design'],
    image: '/portfolio/seadooproshop.png',
    link: 'https://seadoo.fr',
    screenshots: [
      '/portfolio/seadooproshop.png',
    ],
  },
  {
    title: '3D Portfolio',
    description: 'Portfolio interactif avec animations 3D et navigation immersive.',
    stack: ['React', 'Three.js', 'TailwindCSS'],
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
    link: '', // Bientôt disponible
    screenshots: [
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
    ],
  },
];

export default function Projects() {
  const [selected, setSelected] = useState(null);

  return (
    <section id="projects" className="relative py-20 bg-gradient-to-br from-[#18122B] via-black to-[#232946]">
      <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-neonPink mb-10 text-center">Projets</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {projects.map((proj, idx) => (
          <div
            key={proj.title}
            className="group bg-black/70 rounded-2xl shadow-lg shadow-neonPink/20 hover:scale-105 hover:shadow-neonCyan/40 transition-transform duration-300 w-80 h-auto cursor-pointer relative overflow-hidden flex flex-col"
            onClick={() => setSelected(idx)}
          >
            <div className="w-full h-48 overflow-hidden rounded-t-2xl">
              <img 
                src={proj.image} 
                alt={proj.title} 
                className={`w-full h-full object-center group-hover:blur-[1px] transition-all duration-300 ${
                  proj.image.includes('seadooproshop.png') 
                    ? 'object-contain bg-white p-4' 
                    : 'object-cover'
                }`} 
              />
            </div>
            <div className="p-5 flex flex-col items-center text-center flex-grow">
              <h3 className="text-xl font-bold font-poppins text-neonViolet mb-2 text-center">{proj.title}</h3>
              <p className="text-gray-200 mb-3 min-h-[48px] text-center leading-relaxed">{proj.description}</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {proj.stack.map((tech) => (
                  <span key={tech} className="bg-neonCyan/20 text-neonCyan px-2 py-1 rounded text-xs font-orbitron">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/60 flex items-center justify-center transition-all duration-300">
              {proj.link === '/snake' ? (
                <Link to="/snake" className="text-neonCyan font-bold text-lg underline">Jouer</Link>
              ) : proj.link.startsWith('http') ? (
                <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-neonCyan font-bold text-lg underline">Voir le site</a>
              ) : (
                <a href={proj.link} className="text-neonCyan font-bold text-lg underline">Voir</a>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Modal */}
      {selected !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#18122B] rounded-2xl shadow-2xl p-8 max-w-lg w-full relative animate-fade-in">
            <button className="absolute top-4 right-4 text-neonPink text-2xl font-bold hover:scale-125 transition" onClick={() => setSelected(null)}>&times;</button>
            <h3 className="text-2xl font-orbitron font-bold text-neonCyan mb-2">{projects[selected].title}</h3>
            <img src={projects[selected].screenshots[0]} alt={projects[selected].title} className="w-full h-52 object-cover rounded-xl mb-4" />
            <p className="text-gray-100 mb-4 text-center">{projects[selected].description}</p>
            <div className="flex flex-wrap gap-2 mb-4 justify-center">
              {projects[selected].stack.map((tech) => (
                <span key={tech} className="bg-neonViolet/20 text-neonViolet px-2 py-1 rounded text-xs font-orbitron">
                  {tech}
                </span>
              ))}
            </div>
            {projects[selected].link ? (
              projects[selected].link.startsWith('http') ? (
                <a href={projects[selected].link} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-neonOrange underline font-bold hover:text-neonPink transition">Voir le site</a>
              ) : projects[selected].link === '/snake' ? (
                <Link to={projects[selected].link} className="inline-block mt-2 text-neonOrange underline font-bold hover:text-neonPink transition">Jouer</Link>
              ) : null
            ) : (
              <span className="inline-block mt-2 text-gray-500 font-bold opacity-60 cursor-not-allowed">Bientôt disponible</span>
            )}
          </div> 
        )
        </div>
      )}
    </section>
  );
}
