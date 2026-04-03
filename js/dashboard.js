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
                <div class="week-entry week-entry--${e.type}">
                    <span class="week-entry-type">${e.type}</span>
                    <span class="week-entry-body">${e.html.replace(/<[^>]*>/g, '')}</span>
                </div>
            `).join('')}
        </div>
    `).join('');
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
                <div class="week-entry week-entry--${e.type}">
                    <span class="week-entry-type">${e.type}</span>
                    <span class="week-entry-body">${e.html.replace(/<[^>]*>/g, '')}</span>
                </div>
            `).join('')}
        </div>
    `).join('');
}

window.onload = function () {
    applyUserSettings();
    greetUser();
    displayDate();
    renderStats();
    renderFilteredEntries();
    renderOldestTask();
};