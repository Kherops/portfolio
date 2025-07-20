-- Script SQL à exécuter dans Supabase pour créer la table des scores
-- Allez dans votre dashboard Supabase > SQL Editor et exécutez ce script

CREATE TABLE snake_scores (
  id BIGSERIAL PRIMARY KEY,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer un index pour optimiser les requêtes de classement
CREATE INDEX idx_snake_scores_score ON snake_scores(score DESC);

-- Activer Row Level Security (optionnel, pour plus de sécurité)
ALTER TABLE snake_scores ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre à tout le monde de lire les scores
CREATE POLICY "Anyone can read scores" ON snake_scores
  FOR SELECT USING (true);

-- Politique pour permettre à tout le monde d'insérer des scores
CREATE POLICY "Anyone can insert scores" ON snake_scores
  FOR INSERT WITH CHECK (true);
