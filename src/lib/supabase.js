import { createClient } from '@supabase/supabase-js'

// Configuration Supabase - Variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validation de la configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variables Supabase manquantes:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  });
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
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erreur lors de la récupération des scores:', error)
    return []
  }
}

export const saveScore = async (playerName, score) => {
  try {
    const { data, error } = await supabase
      .from('snake_scores')
      .insert([
        { player_name: playerName, score: score }
      ])
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du score:', error)
    throw error
  }
}
