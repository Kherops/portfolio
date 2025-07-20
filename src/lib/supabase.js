import { createClient } from '@supabase/supabase-js'

// Configuration Supabase - Remplacez YOUR_SUPABASE_ANON_KEY par votre vraie clé anon
const supabaseUrl = 'https://jjeledjaypzkapoucmdl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqZWxlZGpheXB6a2Fwb3VjbWRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMDcyNTgsImV4cCI6MjA2ODU4MzI1OH0.2Na_JZnRjwmJ3Xh3oKD_1FS4XKtcEHp0rB7r_5xOKeo'

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
