-- Configuration de la base de données Supabase pour le jeu Snake
-- À exécuter dans le SQL Editor du dashboard Supabase

-- 1. Créer la table snake_scores
CREATE TABLE IF NOT EXISTS snake_scores (
  id SERIAL PRIMARY KEY,
  player_name VARCHAR(50) NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Créer un index pour améliorer les performances des requêtes de classement
CREATE INDEX IF NOT EXISTS idx_snake_scores_score ON snake_scores(score DESC);
CREATE INDEX IF NOT EXISTS idx_snake_scores_created_at ON snake_scores(created_at DESC);

-- 3. Activer Row Level Security (RLS)
ALTER TABLE snake_scores ENABLE ROW LEVEL SECURITY;

-- 4. Créer les politiques de sécurité
-- Politique pour permettre la lecture à tous (consultation du classement)
DROP POLICY IF EXISTS "Allow public read" ON snake_scores;
CREATE POLICY "Allow public read" ON snake_scores
  FOR SELECT USING (true);

-- Politique pour permettre l'insertion à tous (sauvegarde des scores)
DROP POLICY IF EXISTS "Allow public insert" ON snake_scores;
CREATE POLICY "Allow public insert" ON snake_scores
  FOR INSERT WITH CHECK (true);

-- 5. Optionnel: Créer une vue pour le top 10
CREATE OR REPLACE VIEW snake_leaderboard AS
SELECT 
  id,
  player_name,
  score,
  created_at,
  ROW_NUMBER() OVER (ORDER BY score DESC, created_at ASC) as rank
FROM snake_scores
ORDER BY score DESC, created_at ASC
LIMIT 10;

-- 6. Fonction pour nettoyer les anciens scores (garder seulement les 100 meilleurs)
CREATE OR REPLACE FUNCTION cleanup_old_scores()
RETURNS void AS $$
BEGIN
  DELETE FROM snake_scores 
  WHERE id NOT IN (
    SELECT id 
    FROM snake_scores 
    ORDER BY score DESC, created_at ASC 
    LIMIT 100
  );
END;
$$ LANGUAGE plpgsql;

-- 7. Optionnel: Programmer le nettoyage automatique (une fois par semaine)
-- SELECT cron.schedule('cleanup-snake-scores', '0 2 * * 0', 'SELECT cleanup_old_scores();');

-- Vérification finale
SELECT 'Configuration terminée ! Table snake_scores créée avec succès.' as status;
