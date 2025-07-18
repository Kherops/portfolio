import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './sections/Home';
import About from './sections/About';
import Projects from './sections/Projects';
import Contact from './sections/Contact';
import Snake from './sections/Snake';

function Navigation() {
  const location = useLocation();
  const isSnakePage = location.pathname === '/snake';

  if (isSnakePage) {
    return (
      <nav className="sticky top-0 z-50 bg-[#18122B]/90 backdrop-blur border-b border-neonCyan shadow-neonCyan animate-fade-in px-2 md:px-0 rounded-b-xl">
        <ul className="flex flex-wrap justify-center gap-3 md:gap-8 py-2 md:py-4 text-base md:text-lg font-inter text-neonCyan">
          <li><Link to="/" className="hover:text-neonPink transition-all duration-200">← Retour au Portfolio</Link></li>
        </ul>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#18122B]/90 backdrop-blur border-b border-neonCyan shadow-neonCyan animate-fade-in px-2 md:px-0 rounded-b-xl">
      <ul className="flex flex-wrap justify-center gap-3 md:gap-8 py-2 md:py-4 text-base md:text-lg font-inter text-neonCyan">
        <li><a href="#home" className="hover:text-neonPink transition-all duration-200">Accueil</a></li>
        <li><a href="#about" className="hover:text-neonViolet transition-all duration-200">À propos</a></li>
        <li><a href="#projects" className="hover:text-neonOrange transition-all duration-200">Projets</a></li>
        <li><a href="#contact" className="hover:text-neonCyan transition-all duration-200">Contact</a></li>
      </ul>
    </nav>
  );
}

function MainPage() {
  return (
    <>
      <main className="scroll-smooth">
        <Home />
        <About />
        <Projects />
        <Contact />
      </main>
      <footer className="text-center py-6 text-neonCyan font-orbitron text-sm opacity-70">
        &copy; 2025 Louis PROTON — Portfolio Futuriste
      </footer>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <div className="bg-[#18122B] min-h-screen font-poppins">
        <Navigation />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/snake" element={<Snake />} />
        </Routes>
      </div>
    </Router>
  );
}
