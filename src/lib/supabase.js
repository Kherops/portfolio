import { createClient } from '@supabase/supabase-js'

// Configuration Supabase - Utilisation des variables d'environnement pour la sécurité
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jjeledjaypzkapoucmdl.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

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
