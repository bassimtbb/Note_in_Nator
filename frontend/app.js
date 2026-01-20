// ============================================
// CONFIGURATION
// ============================================
const API_URL = '/api/notes';

// ============================================
// ÉLÉMENTS DOM
// ============================================
const noteIdInput = document.getElementById('note-id');
const noteTitleInput = document.getElementById('note-title');
const noteContentInput = document.getElementById('note-content');
const btnSave = document.getElementById('btn-save');
const btnCancel = document.getElementById('btn-cancel');
const notesContainer = document.getElementById('notes-container');
const notesCount = document.getElementById('notes-count');
const apiStatus = document.getElementById('api-status');



// Récupérer toutes les notes
async function fetchNotes() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erreur réseau');
        return await response.json();
    } catch (error) {
        console.error('Erreur fetchNotes:', error);
        return null;
    }
}

// Créer une note
async function createNote(title, content) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content })
        });
        if (!response.ok) throw new Error('Erreur création');
        return await response.json();
    } catch (error) {
        console.error('Erreur createNote:', error);
        return null;
    }
}

// Mettre à jour une note
async function updateNote(id, title, content) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content })
        });
        if (!response.ok) throw new Error('Erreur mise à jour');
        return await response.json();
    } catch (error) {
        console.error('Erreur updateNote:', error);
        return null;
    }
}

// Supprimer une note
async function deleteNote(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Erreur suppression');
        return true;
    } catch (error) {
        console.error('Erreur deleteNote:', error);
        return false;
    }
}

// Vérifier le statut de l'API
async function checkApiStatus() {
    try {
        const response = await fetch('/api/notes');
        if (response.ok) {
            apiStatus.textContent = '✅ En ligne';
            apiStatus.className = 'online';
        } else {
            throw new Error();
        }
    } catch {
        apiStatus.textContent = '❌ Hors ligne';
        apiStatus.className = 'offline';
    }
}

// ============================================
// FONCTIONS D'AFFICHAGE
// ============================================

// Formater une date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Afficher les notes
function renderNotes(notes) {
    if (!notes || notes.length === 0) {
        notesContainer.innerHTML = `
            <div class="empty-state">
                <div class="emoji">📭</div>
                <p>Aucune note pour le moment.<br>Créez votre première note !</p>
            </div>
        `;
        notesCount.textContent = '(0)';
        return;
    }

    notesCount.textContent = `(${notes.length})`;
    
    notesContainer.innerHTML = notes.map(note => `
        <article class="note-card" data-id="${note.id}">
            <h3>${escapeHtml(note.title)}</h3>
            <p>${escapeHtml(note.content) || '<em>Pas de contenu</em>'}</p>
            <div class="note-meta">
                📅 Créé: ${formatDate(note.created_at)} | 
                ✏️ Modifié: ${formatDate(note.updated_at)}
            </div>
            <div class="note-actions">
                <button class="btn btn-edit" onclick="editNote(${note.id})">
                    ✏️ Modifier
                </button>
                <button class="btn btn-danger" onclick="confirmDelete(${note.id})">
                    🗑️ Supprimer
                </button>
            </div>
        </article>
    `).join('');
}

// Échapper le HTML pour éviter les injections XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// FONCTIONS D'INTERACTION
// ============================================

// Charger les notes au démarrage
async function loadNotes() {
    notesContainer.innerHTML = '<p class="loading">⏳ Chargement des notes...</p>';
    const notes = await fetchNotes();
    renderNotes(notes);
}

// Sauvegarder (créer ou mettre à jour)
async function saveNote() {
    const id = noteIdInput.value;
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();

    if (!title) {
        alert('Le titre est obligatoire !');
        noteTitleInput.focus();
        return;
    }

    let result;
    if (id) {
        // Mode édition
        result = await updateNote(id, title, content);
    } else {
        // Mode création
        result = await createNote(title, content);
    }

    if (result) {
        resetForm();
        loadNotes();
    } else {
        alert('Erreur lors de la sauvegarde. Vérifiez la console.');
    }
}

// Éditer une note
async function editNote(id) {
    const notes = await fetchNotes();
    const note = notes.find(n => n.id === id);
    
    if (note) {
        noteIdInput.value = note.id;
        noteTitleInput.value = note.title;
        noteContentInput.value = note.content;
        
        btnSave.textContent = '💾 Sauvegarder';
        btnCancel.style.display = 'inline-block';
        
        noteTitleInput.focus();
        
        // Scroll vers le formulaire
        document.querySelector('.note-form').scrollIntoView({ behavior: 'smooth' });
    }
}

// Confirmer la suppression
async function confirmDelete(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
        const success = await deleteNote(id);
        if (success) {
            loadNotes();
        } else {
            alert('Erreur lors de la suppression.');
        }
    }
}

// Réinitialiser le formulaire
function resetForm() {
    noteIdInput.value = '';
    noteTitleInput.value = '';
    noteContentInput.value = '';
    btnSave.textContent = '➕ Ajouter';
    btnCancel.style.display = 'none';
}

// ============================================
// EVENT LISTENERS
// ============================================
btnSave.addEventListener('click', saveNote);
btnCancel.addEventListener('click', resetForm);

// Permettre la soumission avec Ctrl+Enter
noteContentInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        saveNote();
    }
});

// ============================================
// INITIALISATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    checkApiStatus();
    loadNotes();
    
    // Vérifier le statut de l'API toutes les 30 secondes
    setInterval(checkApiStatus, 30000);
});
