import { supabase } from './supabase.js';

// Script de diagnostic pour Supabase
export const diagnosticSupabase = async () => {
  console.log('🔍 Diagnostic Supabase en cours...');
  
  // 1. Vérifier la connexion
  try {
    const { data, error } = await supabase.from('snake_scores').select('count', { count: 'exact' });
    if (error) {
      console.error('❌ Erreur de connexion Supabase:', error.message);
      return { success: false, error: error.message };
    }
    console.log('✅ Connexion Supabase OK');
  } catch (err) {
    console.error('❌ Erreur de configuration Supabase:', err.message);
    return { success: false, error: 'Configuration Supabase incorrecte' };
  }

  // 2. Vérifier la table snake_scores
  try {
    const { data, error } = await supabase
      .from('snake_scores')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Erreur table snake_scores:', error.message);
      return { success: false, error: `Table snake_scores: ${error.message}` };
    }
    console.log('✅ Table snake_scores accessible');
  } catch (err) {
    console.error('❌ Table snake_scores inaccessible:', err.message);
    return { success: false, error: 'Table snake_scores inaccessible' };
  }

  // 3. Test d'insertion
  try {
    const testScore = {
      player_name: 'Test_' + Date.now(),
      score: 1
    };
    
    const { data, error } = await supabase
      .from('snake_scores')
      .insert([testScore])
      .select();
    
    if (error) {
      console.error('❌ Erreur insertion test:', error.message);
      return { success: false, error: `Insertion impossible: ${error.message}` };
    }
    
    // Nettoyer le test
    if (data && data[0]) {
      await supabase
        .from('snake_scores')
        .delete()
        .eq('id', data[0].id);
    }
    
    console.log('✅ Test d\'insertion réussi');
    return { success: true, message: 'Configuration Supabase parfaite !' };
    
  } catch (err) {
    console.error('❌ Erreur test insertion:', err.message);
    return { success: false, error: 'Test d\'insertion échoué' };
  }
};

// Fonction pour créer la table si elle n'existe pas
export const createSnakeScoresTable = async () => {
  console.log('🔧 Tentative de création de la table snake_scores...');
  
  try {
    // Note: Cette fonction nécessite des privilèges admin
    // En production, la table doit être créée via le dashboard Supabase
    const { data, error } = await supabase.rpc('create_snake_scores_table');
    
    if (error) {
      console.error('❌ Impossible de créer la table automatiquement:', error.message);
      console.log('📋 SQL à exécuter dans le dashboard Supabase:');
      console.log(`
CREATE TABLE IF NOT EXISTS snake_scores (
  id SERIAL PRIMARY KEY,
  player_name VARCHAR(50) NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS (Row Level Security)
ALTER TABLE snake_scores ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture à tous
CREATE POLICY "Allow public read" ON snake_scores
  FOR SELECT USING (true);

-- Politique pour permettre l'insertion à tous
CREATE POLICY "Allow public insert" ON snake_scores
  FOR INSERT WITH CHECK (true);
      `);
      return false;
    }
    
    console.log('✅ Table créée avec succès');
    return true;
    
  } catch (err) {
    console.error('❌ Erreur création table:', err.message);
    return false;
  }
};
