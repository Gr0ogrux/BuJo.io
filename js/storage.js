const SETTINGS_KEY = 'bujo_user_settings';
const STORAGE_KEY = 'bujo_entries';

function loadEntries() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
}

function saveEntry(type, html, date) {
    const entries = loadEntries();
    entries.push({ 
        id: Date.now(), 
        type, 
        html, 
        date: date || todayKey(), 
        state: 'active' 
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function updateEntryState(id, state) {
    const entries = loadEntries().map(e => e.id === id ? { ...e, state } : e);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    renderEntries();
}

function deleteEntry(id) {
    const updated = loadEntries().filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    renderEntries();
}

function loadUserSettings() {
    try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; }
    catch { return {}; }
}

function saveUserSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function applyUserSettings() {
    const settings = loadUserSettings();
    if (!settings) return;

    if (settings.visualPreference) {
        document.body.setAttribute('data-theme', settings.visualPreference);
    }

    if (settings.fontSize) {
        document.body.setAttribute('data-font-size', settings.fontSize);
    }
}