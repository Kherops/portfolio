import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitStatus('Veuillez remplir tous les champs requis.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      const response = await fetch('https://formspree.io/f/myzpzrba', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _replyto: formData.email
        })
      });

      if (response.ok) {
        setSubmitStatus('Message envoyé avec succès! Je vous répondrai bientôt.');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('Erreur lors de l\'envoi. Veuillez réessayer.');
      }
    } catch (error) {
      setSubmitStatus('Erreur lors de l\'envoi. Veuillez réessayer.');
    }

    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="py-20 px-4 md:px-0 flex flex-col items-center bg-gradient-to-br from-black via-[#18122B] to-[#232946] text-center">
      <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-neonCyan mb-8">Contact</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md mx-auto animate-fade-in">
        <input 
          type="text" 
          name="name"
          placeholder="Nom" 
          value={formData.name}
          onChange={handleChange}
          className="rounded bg-black/60 border border-neonCyan px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neonCyan font-poppins" 
          required 
        />
        <input 
          type="email" 
          name="email"
          placeholder="Email" 
          value={formData.email}
          onChange={handleChange}
          className="rounded bg-black/60 border border-neonCyan px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neonCyan font-poppins" 
          required 
        />
        <textarea 
          name="message"
          placeholder="Votre message" 
          rows={4} 
          value={formData.message}
          onChange={handleChange}
          className="rounded bg-black/60 border border-neonCyan px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neonCyan font-poppins" 
          required 
        />
        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`mt-4 px-6 py-2 rounded-xl text-white font-bold transition ${
            isSubmitting 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-neonPink shadow-neonPink hover:bg-neonCyan'
          }`}
        >
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
        </button>
      </form>
      
      {submitStatus && (
        <div className={`mt-4 p-3 rounded text-sm font-medium ${
          submitStatus.includes('succès') 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {submitStatus}
        </div>
      )}
      
      <div className="mt-8 flex flex-col gap-2 text-gray-300 text-sm animate-fade-in">
        <a href="mailto:louisproton2077@gmail.com" className="hover:text-neonPink transition">Mail</a>
        <a href="https://www.linkedin.com/in/louis-proton-73917b341/" target="_blank" rel="noopener noreferrer" className="hover:text-neonPink transition">LinkedIn</a>
        <a href="https://github.com/Kherops" target="_blank" rel="noopener noreferrer" className="hover:text-neonPink transition">GitHub</a>
      </div>
    </section>
  );
}
