import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Home from './sections/Home';
import About from './sections/About';
import Projects from './sections/Projects';
import Contact from './sections/Contact';
import Snake from './sections/Snake';

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const isSnakePage = location.pathname === '/snake';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [animationDirection, setAnimationDirection] = useState('');
  const [lastDirection, setLastDirection] = useState('');

  const handleReturnToPortfolio = () => {
    navigate('/');
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const toggleMenu = () => {
    if (!isMenuOpen) {
      // Random animation direction when opening, but never the same as last time
      const directions = ['from-right', 'from-left', 'from-top', 'from-bottom'];
      let availableDirections = directions;
      
      // Remove the last direction if it exists
      if (lastDirection) {
        availableDirections = directions.filter(dir => dir !== lastDirection);
      }
      
      const randomDirection = availableDirections[Math.floor(Math.random() * availableDirections.length)];
      setAnimationDirection(randomDirection);
      setLastDirection(randomDirection);
    }
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Close menu when clicking on a navigation link
  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  if (isSnakePage) {
    return (
      <nav className="sticky top-0 z-50 bg-[#18122B]/90 backdrop-blur border-b border-neonCyan shadow-neonCyan animate-fade-in px-2 md:px-0 rounded-b-xl">
        <ul className="flex flex-wrap justify-center gap-3 md:gap-8 py-2 md:py-4 text-base md:text-lg font-inter text-neonCyan">
          <li><button onClick={handleReturnToPortfolio} className="hover:text-neonPink transition-all duration-200 bg-transparent border-none cursor-pointer">← Retour au Portfolio</button></li>
        </ul>
      </nav>
    );
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#18122B]/90 backdrop-blur border-b border-neonCyan shadow-neonCyan animate-fade-in px-4 rounded-b-xl">
        {/* Desktop Navigation */}
        <ul className="hidden md:flex justify-center gap-8 py-4 text-lg font-inter text-neonCyan">
          <li><a href="#home" className="hover:text-neonPink transition-all duration-200">Accueil</a></li>
          <li><a href="#about" className="hover:text-neonViolet transition-all duration-200">À propos</a></li>
          <li><a href="#projects" className="hover:text-neonOrange transition-all duration-200">Projets</a></li>
          <li><a href="#contact" className="hover:text-neonCyan transition-all duration-200">Contact</a></li>
        </ul>
        
        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex justify-between items-center py-4">
          <div className="text-neonCyan font-inter font-bold text-lg">Louis PROTON</div>
          <button 
            onClick={toggleMenu}
            className="text-neonCyan hover:text-neonPink transition-colors duration-200 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
      
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeMenu}
          ></div>
          
          {/* Menu Panel - Fullscreen with animation */}
          <div className={`absolute inset-0 bg-gradient-to-br from-[#18122B] via-[#232946] to-black p-8 flex flex-col justify-center items-center ${
            animationDirection === 'from-right' ? 'animate-menu-from-right' :
            animationDirection === 'from-left' ? 'animate-menu-from-left' :
            animationDirection === 'from-top' ? 'animate-menu-from-top' :
            animationDirection === 'from-bottom' ? 'animate-menu-from-bottom' :
            'animate-menu-from-right'
          }`}>
            {/* Close Button */}
            <button 
              onClick={closeMenu}
              className="absolute top-6 right-6 p-3 text-neonCyan hover:text-neonPink hover:bg-neonCyan/10 rounded-full transition-all duration-200 focus:outline-none hover:scale-110"
              aria-label="Close menu"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Menu Items */}
            <nav className="flex-1 flex items-center justify-center">
              <ul className="space-y-8 text-center">
                <li>
                  <a 
                    href="#home" 
                    onClick={handleNavClick}
                    className="block text-3xl md:text-4xl font-inter font-bold text-neonCyan hover:text-neonPink transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_#ff5fa2]"
                  >
                    🏠 Accueil
                  </a>
                </li>
                <li>
                  <a 
                    href="#about" 
                    onClick={handleNavClick}
                    className="block text-3xl md:text-4xl font-inter font-bold text-neonCyan hover:text-neonViolet transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_#a259f7]"
                  >
                    👨‍💻 À propos
                  </a>
                </li>
                <li>
                  <a 
                    href="#projects" 
                    onClick={handleNavClick}
                    className="block text-3xl md:text-4xl font-inter font-bold text-neonCyan hover:text-neonOrange transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_#ffb347]"
                  >
                    🚀 Projets
                  </a>
                </li>
                <li>
                  <a 
                    href="#contact" 
                    onClick={handleNavClick}
                    className="block text-3xl md:text-4xl font-inter font-bold text-neonCyan hover:text-neonCyan transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_#3de2fc]"
                  >
                    📧 Contact
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
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
    <Router basename="/portfolio">
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
