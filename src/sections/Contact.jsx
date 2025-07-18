import React from 'react';

export default function Contact() {
  return (
    <section id="contact" className="py-20 px-4 md:px-0 flex flex-col items-center bg-gradient-to-br from-black via-[#18122B] to-[#232946] text-center">
      <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-neonCyan mb-8">Contact</h2>
      <form className="flex flex-col gap-4 w-full max-w-md mx-auto animate-fade-in">
        <input type="text" placeholder="Nom" className="rounded bg-black/60 border border-neonCyan px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neonCyan font-poppins" required />
        <input type="email" placeholder="Email" className="rounded bg-black/60 border border-neonCyan px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neonCyan font-poppins" required />
        <textarea placeholder="Votre message" rows={4} className="rounded bg-black/60 border border-neonCyan px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neonCyan font-poppins" required />
        <button type="submit" className="mt-4 px-6 py-2 bg-neonPink rounded-xl text-white font-bold shadow-neonPink hover:bg-neonCyan transition">Envoyer</button>
      </form>
      <div className="mt-8 flex flex-col gap-2 text-gray-300 text-sm animate-fade-in">
        <a href="mailto:louis.proton@email.com" className="hover:text-neonPink transition">Mail</a>
        <a href="https://www.linkedin.com/in/louisproton" target="_blank" rel="noopener noreferrer" className="hover:text-neonPink transition">LinkedIn</a>
        <a href="https://github.com/louisproton" target="_blank" rel="noopener noreferrer" className="hover:text-neonPink transition">GitHub</a>
      </div>
    </section>
  );
}
