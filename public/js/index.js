const startLink = document.getElementById('start-link');
if (startLink) {
    startLink.addEventListener('click', function (e) {
        e.preventDefault();
        const isSetupComplete = localStorage.getItem('hasCompletedSetup');
        window.location.href = isSetupComplete === 'true' ? 'dashboard.html' : 'setup.html';
    });
}

function displayCurrentDate() {
    const el = document.getElementById('current-date');
    if (!el) return;
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    el.innerText = new Date().toLocaleDateString('en-US', options);
}

const SYMBOLS = {
    todo:   '<span class="bullet bullet--todo"   aria-label="task"></span>',
    event:  '<span class="bullet bullet--event"  aria-label="event">◆</span>',
    memory: '<span class="bullet bullet--memory" aria-label="memory">#</span>',
};

function initQuill() {
    const editorEl = document.getElementById('editor');
    if (!editorEl) return;

    const quill = new Quill('#editor', {
        theme: 'snow',
        placeholder: 'Write your entry…',
        modules: {
            toolbar: [
                ['bold', 'italic', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ indent: '-1' }, { indent: '+1' }],
                ['clean']
            ]
        }
    });

    const form = document.getElementById('log-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const isEmpty = quill.getText().trim().length === 0;
        if (isEmpty) {
            editorEl.style.outline = '2px solid #e53e3e';
            quill.focus();
            return;
        }
        editorEl.style.outline = '';

        const logTypeInput = form.querySelector('input[name="log-type"]:checked');
        if (!logTypeInput) {
            alert('Please choose a log type.');
            return;
        }

        document.getElementById('log-entry').value = quill.root.innerHTML;
        saveEntry(logTypeInput.value, quill.root.innerHTML);

        quill.setContents([]);
        form.reset();
    });
}

const STORAGE_KEY = 'bujo_entries';

function todayKey() {
    return new Date().toISOString().split('T')[0];
}

function loadEntries() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
}

function saveEntry(type, html) {
    const entries = loadEntries();
    entries.push({ id: Date.now(), type, html, date: todayKey(), state: 'active' });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    renderEntries();
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

function renderEntries() {
    const list = document.getElementById('entries-list');
    if (!list) return;

    const entries = loadEntries().filter(e => e.date === todayKey());
    list.innerHTML = '';

    if (entries.length === 0) return;

    const heading = document.createElement('h2');
    heading.textContent = "Today's entries";
    list.appendChild(heading);

    entries.forEach(entry => {
        const row = document.createElement('div');
        row.className = `entry-row entry-row--${entry.type} entry-row--${entry.state}`;
        row.dataset.id = entry.id;

        let symbolHtml = SYMBOLS[entry.type];
        if (entry.type === 'todo' && entry.state === 'migrated') {
            symbolHtml = '<span class="bullet bullet--migrated" aria-label="migrated">›</span>';
        }

        let actionsHtml = '';
        if (entry.type === 'todo') {
            if (entry.state === 'active') {
                actionsHtml = `
                    <div class="entry-actions">
                        <button class="action-btn action-btn--done"    data-id="${entry.id}" title="Mark complete">✕</button>
                        <button class="action-btn action-btn--migrate" data-id="${entry.id}" title="Migrate to next day">›</button>
                        <button class="action-btn action-btn--delete"  data-id="${entry.id}" title="Delete">⌫</button>
                    </div>`;
            } else {
                actionsHtml = `
                    <div class="entry-actions">
                        <button class="action-btn action-btn--delete" data-id="${entry.id}" title="Delete">⌫</button>
                    </div>`;
            }
        }

        row.innerHTML = `
            <div class="entry-symbol">${symbolHtml}</div>
            <div class="entry-body">${entry.html}</div>
            ${actionsHtml}
        `;

        list.appendChild(row);
    });

    list.querySelectorAll('.action-btn--done').forEach(btn => {
        btn.addEventListener('click', () => updateEntryState(Number(btn.dataset.id), 'done'));
    });
    list.querySelectorAll('.action-btn--migrate').forEach(btn => {
        btn.addEventListener('click', () => updateEntryState(Number(btn.dataset.id), 'migrated'));
    });
    list.querySelectorAll('.action-btn--delete').forEach(btn => {
        btn.addEventListener('click', () => deleteEntry(Number(btn.dataset.id)));
    });
}

window.onload = function () {
    displayCurrentDate();
    initQuill();
    renderEntries();
};