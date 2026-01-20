-- ============================================
-- INITIALISATION DE LA BASE DE DONNÉES
-- ============================================

-- Création de la table des notes
CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion de quelques notes de démonstration
INSERT INTO notes (title, content) VALUES 
    ('Bienvenue !', 'Ceci est votre première note. Vous pouvez la modifier ou la supprimer.'),
    ('Liste de courses', '- Pain\n- Lait\n- Œufs\n- Fromage'),
    ('Idées projet', 'Ajouter des catégories aux notes\nAjouter un système de recherche\nMode sombre');
