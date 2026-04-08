const SYMBOLS = {
    todo:   '<span class="bullet bullet--todo"   aria-label="task"></span>',
    event:  '<span class="bullet bullet--event"  aria-label="event">◆</span>',
    memory: '<span class="bullet bullet--memory" aria-label="memory">#</span>',
};

function setActiveNavLink() {
    document.querySelectorAll('.nav-links a').forEach(a => {
        if (a.href.includes('dashboard.html')) {
            a.classList.add('active');
        }
    });
}

function editDashboardEntry(id) {
    const entries = loadEntries();
    const entry = entries.find(e => e.id === id);
    if (!entry) return;

    const row = document.querySelector(`.week-entry[data-id="${id}"]`);
    const body = row.querySelector('.week-entry-body');
    const currentText = entry.html.replace(/<[^>]*>/g, '').trim();

    body.innerHTML = `
        <input type="text" class="edit-input" value="${currentText}">
        <input type="date" class="edit-input" id="edit-date-${id}" value="${entry.date}">
        <button class="action-btn action-btn--save" data-id="${id}">Save</button>
    `;

    body.querySelector('.action-btn--save').addEventListener('click', () => {
        const newText = body.querySelector('input[type="text"]').value.trim();
        const newDate = document.getElementById(`edit-date-${id}`).value;
        if (!newText) return;
        entry.html = `<p>${newText}</p>`;
        entry.date = newDate || entry.date;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
        renderWeekEntries();
        renderFilteredEntries();
        renderStats();
    });

    body.querySelector('input[type="text"]').focus();
}

function migrateDashboardEntry(id) {
    const entries = loadEntries();
    const entry = entries.find(e => e.id === id);
    if (!entry) return;

    const row = document.querySelector(`.week-entry[data-id="${id}"]`);
    const actions = row.querySelector('.week-entry-actions');

    actions.innerHTML = `
        <input type="date" class="migrate-date-input" id="migrate-date-${id}">
        <button class="action-btn action-btn--save migrate-confirm" data-id="${id}">→</button>
        <button class="action-btn migrate-cancel" data-id="${id}">✕</button>
    `;

    const dateInput = document.getElementById(`migrate-date-${id}`);
    dateInput.value = new Date(new Date().setDate(new Date().getDate() + 1))
        .toISOString().split('T')[0];

    actions.querySelector('.migrate-confirm').addEventListener('click', () => {
        const selectedDate = dateInput.value;
        if (!selectedDate) return;

        entry.state = 'migrated';
        entries.push({
            id: Date.now(),
            type: 'todo',
            html: entry.html,
            date: selectedDate,
            state: 'active'
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
        renderWeekEntries();
        renderFilteredEntries();
        renderStats();
    });

    actions.querySelector('.migrate-cancel').addEventListener('click', () => {
        renderWeekEntries();
        renderFilteredEntries();
    });
}

function greetUser() {
    const settings = loadUserSettings();
    const hour = new Date().getHours();
    let greeting = 'Good morning';
    if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
    if (hour >= 17) greeting = 'Good evening';
    const name = settings.name ? `, ${settings.name}` : '';
    document.getElementById('greeting').textContent = greeting + name;
}

function displayDate() {
    const el = document.getElementById('current-date');
    if (!el) return;
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    el.innerText = new Date().toLocaleDateString('en-US', options);
}

function renderStats() {
    const entries = loadEntries();
    const grid = document.getElementById('stats-grid');
    if (!grid) return;

    const todos    = entries.filter(e => e.type === 'todo');
    const events   = entries.filter(e => e.type === 'event');
    const memories = entries.filter(e => e.type === 'memory');
    const done      = todos.filter(e => e.state === 'done');
    const migrated  = todos.filter(e => e.state === 'migrated');
    const active    = todos.filter(e => e.state === 'active');

    const stats = [
    { label: 'Total Entries', value: entries.length, filter: 'all' },
    { label: 'To-Dos', value: todos.length, filter: 'todo' },
    { label: 'Events', value: events.length, filter: 'event' },
    { label: 'Memories', value: memories.length, filter: 'memory' },
    { label: 'Completed', value: done.length, filter: 'done' },
    { label: 'Migrated', value: migrated.length, filter: 'migrated' },
    { label: 'Active', value: active.length, filter: 'active' },
];

grid.innerHTML = stats.map(s => `
    <div class="stat-card" data-filter="${s.filter}" onclick="setStatFilter('${s.filter}')">
        <span class="stat-value">${s.value}</span>
        <span class="stat-label">${s.label}</span>
    </div>
`).join('');

highlightActiveStatCard();
}

function renderWeekEntries() {
    const container = document.getElementById('week-entries');
    if (!container) return;

    const today = new Date();
    const entries = loadEntries().filter(e => {
        const date = new Date(e.date + 'T00:00:00');
        const start = new Date(today);
        start.setDate(today.getDate() - today.getDay());
        start.setHours(0, 0, 0, 0);
        return date >= start;
    });

    if (entries.length === 0) {
        container.innerHTML = '<p style="color:#999;font-size:0.9rem;">No entries this week yet.</p>';
        return;
    }

    const grouped = {};
    entries.forEach(e => {
        if (!grouped[e.date]) grouped[e.date] = [];
        grouped[e.date].push(e);
    });

    container.innerHTML = Object.keys(grouped).sort().map(date => `
        <div class="week-group">
            <h3 class="week-date">${new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
            ${grouped[date].map(e => `
                <div class="week-entry week-entry--${e.type} entry-row--${e.state}" data-id="${e.id}">
                    <span class="week-entry-type">${SYMBOLS[e.type] || e.type}</span>
                    <span class="week-entry-body">${e.html.replace(/<[^>]*>/g, '')}</span>
                    ${e.type === 'todo' && e.state === 'active' ? `
                        <div class="week-entry-actions">
                            <button class="action-btn action-btn--done" data-id="${e.id}" title="Mark complete">✕</button>
                            <button class="action-btn action-btn--migrate" data-id="${e.id}" title="Migrate">›</button>
                            <button class="action-btn action-btn--delete" data-id="${e.id}" title="Delete">⌫</button>
                        </div>` : ''}
                    ${e.type === 'todo' && e.state !== 'active' ? `
                        <div class="week-entry-actions">
                            <button class="action-btn action-btn--delete" data-id="${e.id}" title="Delete">⌫</button>
                        </div>` : ''}
                    ${e.type === 'event' ? `
                        <div class="week-entry-actions">
                            <button class="action-btn action-btn--edit" data-id="${e.id}" title="Edit">✎</button>
                            <button class="action-btn action-btn--delete" data-id="${e.id}" title="Delete">⌫</button>
                        </div>` : ''}
                </div>
            `).join('')}
        </div>
    `).join('');
    function attachDashboardListeners() {
        document.querySelectorAll('.week-entry .action-btn--done').forEach(btn => {
            btn.addEventListener('click', () => {
                updateEntryState(Number(btn.dataset.id), 'done');
                renderWeekEntries();
                renderFilteredEntries();
                renderStats();
            });
        });
        document.querySelectorAll('.week-entry .action-btn--migrate').forEach(btn => {
            btn.addEventListener('click', () => migrateDashboardEntry(Number(btn.dataset.id)));
        });
        document.querySelectorAll('.week-entry .action-btn--delete').forEach(btn => {
            btn.addEventListener('click', () => {
                deleteEntry(Number(btn.dataset.id));
                renderWeekEntries();
                renderFilteredEntries();
                renderStats();
            });
        });
        document.querySelectorAll('.week-entry .action-btn--edit').forEach(btn => {
            btn.addEventListener('click', () => editDashboardEntry(Number(btn.dataset.id)));
        });
    }
    attachDashboardListeners();
}

function renderOldestTask() {
    const el = document.getElementById('oldest-task');
    if (!el) return;

    const active = loadEntries()
        .filter(e => e.type === 'todo' && e.state === 'active')
        .sort((a, b) => a.id - b.id);

    if (active.length === 0) {
        el.textContent = 'No open tasks.';
        return;
    }

    const oldest = active[0];
    const days = Math.floor((Date.now() - oldest.id) / (1000 * 60 * 60 * 24));
    const text = oldest.html.replace(/<[^>]*>/g, '');
    el.textContent = `"${text}" — ${days === 0 ? 'added today' : `${days} day${days !== 1 ? 's' : ''} ago`}`;
}

function getStatFilter() {
    const params = new URLSearchParams(window.location.search);
    return params.get('filter') || 'all';
}

function setStatFilter(filter) {
    const params = new URLSearchParams(window.location.search);
    params.set('filter', filter);
    window.location.search = params.toString();
}

function highlightActiveStatCard() {
    const filter = getStatFilter();
    document.querySelectorAll('.stat-card').forEach(card => {
        card.classList.toggle('stat-card--active', card.dataset.filter === filter);
    });
}

function renderFilteredEntries() {
    const filter = getStatFilter();
    if (filter === 'all') return;

    const container = document.getElementById('week-entries');
    if (!container) return;

    let entries = loadEntries();

    if (filter === 'todo' || filter === 'event' || filter === 'memory') {
        entries = entries.filter(e => e.type === filter);
    } else if (filter === 'done' || filter === 'migrated' || filter === 'active') {
        entries = entries.filter(e => e.state === filter);
    }

    const section = document.getElementById('week-section');
    const heading = section.querySelector('.section-title');
    heading.textContent = filter.charAt(0).toUpperCase() + filter.slice(1) + ' Entries';

    if (entries.length === 0) {
        container.innerHTML = '<p style="color:#999;font-size:0.9rem;">No entries found.</p>';
        return;
    }

    const grouped = {};
    entries.forEach(e => {
        if (!grouped[e.date]) grouped[e.date] = [];
        grouped[e.date].push(e);
    });

    container.innerHTML = Object.keys(grouped).sort().reverse().map(date => `
        <div class="week-group">
            <h3 class="week-date">${new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
            ${grouped[date].map(e => `
                <div class="week-entry week-entry--${e.type} entry-row--${e.state}" data-id="${e.id}">
                    <span class="week-entry-type">${SYMBOLS[e.type] || e.type}</span>
                    <span class="week-entry-body">${e.html.replace(/<[^>]*>/g, '')}</span>
                    ${e.type === 'todo' && e.state === 'active' ? `
                        <div class="week-entry-actions">
                            <button class="action-btn action-btn--done" data-id="${e.id}" title="Mark complete">✕</button>
                            <button class="action-btn action-btn--migrate" data-id="${e.id}" title="Migrate">›</button>
                            <button class="action-btn action-btn--delete" data-id="${e.id}" title="Delete">⌫</button>
                        </div>` : ''}
                    ${e.type === 'todo' && e.state !== 'active' ? `
                        <div class="week-entry-actions">
                            <button class="action-btn action-btn--delete" data-id="${e.id}" title="Delete">⌫</button>
                        </div>` : ''}
                    ${e.type === 'event' ? `
                        <div class="week-entry-actions">
                            <button class="action-btn action-btn--edit" data-id="${e.id}" title="Edit">✎</button>
                            <button class="action-btn action-btn--delete" data-id="${e.id}" title="Delete">⌫</button>
                        </div>` : ''}
                </div>
            `).join('')}
        </div>
    `).join('');
    function attachDashboardListeners() {
        document.querySelectorAll('.week-entry .action-btn--done').forEach(btn => {
            btn.addEventListener('click', () => {
                updateEntryState(Number(btn.dataset.id), 'done');
                renderWeekEntries();
                renderFilteredEntries();
                renderStats();
            });
        });
        document.querySelectorAll('.week-entry .action-btn--migrate').forEach(btn => {
            btn.addEventListener('click', () => migrateDashboardEntry(Number(btn.dataset.id)));
        });
        document.querySelectorAll('.week-entry .action-btn--delete').forEach(btn => {
            btn.addEventListener('click', () => {
                deleteEntry(Number(btn.dataset.id));
                renderWeekEntries();
                renderFilteredEntries();
                renderStats();
            });
        });
        document.querySelectorAll('.week-entry .action-btn--edit').forEach(btn => {
            btn.addEventListener('click', () => editDashboardEntry(Number(btn.dataset.id)));
        });
    }
    attachDashboardListeners();
}

window.onload = function () {
    applyUserSettings();
    initNav();
    setActiveNavLink();
    greetUser();
    displayDate();
    renderStats();
    renderWeekEntries();
    renderFilteredEntries();
    renderOldestTask();
};