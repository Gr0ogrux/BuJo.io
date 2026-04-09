const SETTINGS_KEY = 'bujo_user_settings';
const STORAGE_KEY = 'bujo_entries';

function todayKey() {
    return new Date().toISOString().split('T')[0];
}

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
}

function deleteEntry(id) {
    const updated = loadEntries().filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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
        document.documentElement.setAttribute('data-theme', settings.visualPreference);
    }
    if (settings.fontSize) {
        document.documentElement.setAttribute('data-font-size', settings.fontSize);
    }
}

function initNav() {
    const hamburger = document.getElementById('nav-hamburger');
    const navLinks  = document.getElementById('nav-links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navLinks.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('open');
            navLinks.classList.remove('open');
        }
    });
}

/* Early on I had all my localStorage logic scattered across index.js and it was getting hard to manage. If I wanted to change how entries were saved, I'd have to find and update it in multiple places. Claude AI suggested creating a separate storage.js file to encapsulate all the localStorage logic. */ 