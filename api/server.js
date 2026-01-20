const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuration PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'notesdb',
  user: process.env.DB_USER || 'notesuser',
  password: process.env.DB_PASSWORD || 'notespassword',
});

// ============================================
// ROUTES API
// ============================================

// Health check (pour Docker healthcheck)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET - Récupérer toutes les notes
app.get('/api/notes', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM notes ORDER BY updated_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur GET /api/notes:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET - Récupérer une note par ID
app.get('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM notes WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note non trouvée' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur GET /api/notes/:id:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST - Créer une nouvelle note
app.post('/api/notes', async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Le titre est requis' });
    }
    
    const result = await pool.query(
      'INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *',
      [title, content || '']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur POST /api/notes:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT - Mettre à jour une note
app.put('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Le titre est requis' });
    }
    
    const result = await pool.query(
      'UPDATE notes SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [title, content || '', id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note non trouvée' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur PUT /api/notes/:id:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE - Supprimer une note
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM notes WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note non trouvée' });
    }
    
    res.json({ message: 'Note supprimée', note: result.rows[0] });
  } catch (error) {
    console.error('Erreur DELETE /api/notes/:id:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ============================================
// DÉMARRAGE DU SERVEUR
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 API Notes démarrée sur le port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
