import { createClient } from '@supabase/supabase-js'

// Configuration Supabase - Utilisation des variables d'environnement pour la sécurité
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jjeledjaypzkapoucmdl.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Validation de la configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Configuration Supabase incomplète. Vérifiez votre fichier .env.local');
  console.log('Variables requises:');
  console.log('- VITE_SUPABASE_URL');
  console.log('- VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Fonctions pour gérer les scores
export const getScores = async () => {
  try {
    const { data, error } = await supabase
      .from('snake_scores')
      .select('*')
      .order('score', { ascending: false })
      .limit(10)
    
    if (error) {
      console.error('❌ Erreur Supabase getScores:', error.message);
      throw new Error(`Récupération scores: ${error.message}`);
    }
    
    console.log('✅ Scores récupérés:', data?.length || 0, 'entrées');
    return data || []
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des scores:', error.message)
    throw error; // Propager l'erreur pour un meilleur diagnostic
  }
}

export const saveScore = async (playerName, score) => {
  // Validation des paramètres
  if (!playerName || typeof playerName !== 'string') {
    throw new Error('Nom du joueur requis et doit être une chaîne');
  }
  if (typeof score !== 'number' || score < 0) {
    throw new Error('Score doit être un nombre positif');
  }
  
  try {
    console.log('💾 Tentative sauvegarde:', { playerName, score });
    
    const { data, error } = await supabase
      .from('snake_scores')
      .insert([
        { player_name: playerName.trim(), score: score }
      ])
      .select(); // Récupérer les données insérées
    
    if (error) {
      console.error('❌ Erreur Supabase saveScore:', error.message);
      throw new Error(`Sauvegarde: ${error.message}`);
    }
    
    console.log('✅ Score sauvegardé avec succès:', data);
    return data
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde du score:', error.message)
    throw error
  }
}
