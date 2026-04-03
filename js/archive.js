function getActiveView() {
    const params = new URLSearchParams(window.location.search);
    return params.get('view') || 'day';
}

function getOffset() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('offset') || '0');
}

function setActiveViewLink() {
    const view = getActiveView();
    document.querySelectorAll('.view-nav a').forEach(a => {
        if (!a.href.includes('archive.html')) return;
        const params = new URLSearchParams(a.search);
        const linkView = params.get('view') || 'day';
        a.classList.toggle('active', linkView === view);
    });
}

function getDateRange(view, offset) {
    const today = new Date();

    if (view === 'day') {
        const date = new Date(today);
        date.setDate(today.getDate() + offset);
        const key = date.toISOString().split('T')[0];
        return { start: key, end: key };
    }

    if (view === 'week') {
        const start = new Date(today);
        start.setDate(today.getDate() + offset * 7);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return { start, end };
    }

    if (view === 'month') {
        const start = new Date(today.getFullYear(), today.getMonth() + offset, 1);
        const end = new Date(today.getFullYear(), today.getMonth() + offset + 1, 0);
        return { start, end };
    }

    if (view === 'year') {
        const start = new Date(today.getFullYear() + offset, 0, 1);
        const end = new Date(today.getFullYear() + offset, 11, 31);
        return { start, end };
    }
}

function formatPeriodLabel(view, offset) {
    const today = new Date();

    if (view === 'day') {
        const date = new Date(today);
        date.setDate(today.getDate() + offset);
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    if (view === 'week') {
        const start = new Date(today);
        start.setDate(today.getDate() + offset * 7);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        const fmt = { month: 'long', day: 'numeric' };
        return start.toLocaleDateString('en-US', fmt) + ' to ' + end.toLocaleDateString('en-US', fmt);
    }

    if (view === 'month') {
        const date = new Date(today.getFullYear(), today.getMonth() + offset, 1);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }

    if (view === 'year') {
        return String(today.getFullYear() + offset);
    }
}

function isInRange(dateString, view, range) {
    if (view === 'day') return dateString === range.start;
    const date = new Date(dateString + 'T00:00:00');
    return date >= range.start && date <= range.end;
}

const SYMBOLS = {
    todo:   '<span class="bullet bullet--todo"   aria-label="task"></span>',
    event:  '<span class="bullet bullet--event"  aria-label="event">◆</span>',
    memory: '<span class="bullet bullet--memory" aria-label="memory">#</span>',
};

function renderEntries(filterType = 'all') {
    const list = document.getElementById('entries-list');
    if (!list) return;

    const view = getActiveView();
    const offset = getOffset();
    const range = getDateRange(view, offset);

    let entries = loadEntries().filter(e => isInRange(e.date, view, range));

    if (filterType !== 'all') {
        entries = entries.filter(e => e.type === filterType);
    }

    if (entries.length === 0) {
        list.innerHTML = '<p style="color:#999;font-size:0.9rem;margin-top:2rem;">No entries for this period.</p>';
        return;
    }

    const grouped = {};
    entries.forEach(e => {
        if (!grouped[e.date]) grouped[e.date] = [];
        grouped[e.date].push(e);
    });

    Object.keys(grouped).sort().forEach(date => {
        const heading = document.createElement('h2');
        heading.className = 'archive-date-heading';
        heading.textContent = new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
        list.appendChild(heading);

        grouped[date].forEach(entry => {
            const row = document.createElement('div');
            row.className = `entry-row entry-row--${entry.type} entry-row--${entry.state}`;
            row.dataset.id = entry.id;

            const entryDate = entry.type === 'event'
                ? `<span class="entry-date">${entry.date.slice(5).replace('-', '/')}</span>`
                : '';

            let actionsHtml = '';
            if (entry.type === 'todo' && entry.state === 'active') {
                actionsHtml = `
                    <div class="entry-actions">
                        <button class="action-btn action-btn--done"    data-id="${entry.id}" title="Mark complete">✕</button>
                        <button class="action-btn action-btn--migrate" data-id="${entry.id}" title="Migrate to today">›</button>
                        <button class="action-btn action-btn--delete"  data-id="${entry.id}" title="Delete">⌫</button>
                    </div>`;
            } else if (entry.type === 'todo') {
                actionsHtml = `
                    <div class="entry-actions">
                        <button class="action-btn action-btn--delete" data-id="${entry.id}" title="Delete">⌫</button>
                    </div>`;
            }

            row.innerHTML = `
                <div class="entry-symbol">${SYMBOLS[entry.type]}</div>
                <div class="entry-body">${entry.html}${entryDate}</div>
                ${actionsHtml}
            `;

            list.appendChild(row);
        });
    });
    list.querySelectorAll('.action-btn--done').forEach(btn => {
    btn.addEventListener('click', () => {
        updateEntryState(Number(btn.dataset.id), 'done');
        renderEntries();
        });
    });

    list.querySelectorAll('.action-btn--migrate').forEach(btn => {
        btn.addEventListener('click', () => migrateEntry(Number(btn.dataset.id)));
    });

    list.querySelectorAll('.action-btn--delete').forEach(btn => {
        btn.addEventListener('click', () => {
            deleteEntry(Number(btn.dataset.id));
            renderEntries();
        });
    });
}

function initFilterBar() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderEntries(btn.dataset.filter);
        });
    });
}

function updatePeriodLabel() {
    const view = getActiveView();
    const offset = getOffset();
    document.getElementById('archive-period').textContent = formatPeriodLabel(view, offset);
    document.getElementById('current-date').textContent = formatPeriodLabel(view, offset);

    const nextBtn = document.getElementById('next-btn');
    nextBtn.disabled = offset >= -1;
    nextBtn.style.opacity = offset >= -1 ? '0.3' : '1';
    nextBtn.style.cursor = offset >= -1 ? 'not-allowed' : 'pointer';
}

function updateTitle() {
    const titles = { day: 'Archive — Day', week: 'Archive — Week', month: 'Archive — Month', year: 'Archive — Year' };
    document.querySelector('.mainTitle').textContent = titles[getActiveView()];
    document.title = titles[getActiveView()] + ' - BuJo.io';
}

function navigate(direction) {
    const params = new URLSearchParams(window.location.search);
    const current = parseInt(params.get('offset') || '0');
    const next = current + direction;
    if (next >= 0) return;
    params.set('offset', next);
    window.location.search = params.toString();
}

function migrateEntry(id) {
    const entries = loadEntries();
    const entry = entries.find(e => e.id === id);
    if (!entry) return;

    entry.state = 'migrated';

    entries.push({
        id: Date.now(),
        type: 'todo',
        html: entry.html,
        date: todayKey(),
        state: 'active'
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    renderEntries();
}

function todayKey() {
    return new Date().toISOString().split('T')[0];
}

window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('offset')) {
        params.set('offset', '-1');
        window.location.search = params.toString();
        return;
    }
    applyUserSettings();
    updateTitle();
    updatePeriodLabel();
    setActiveViewLink();
    renderEntries();
    initFilterBar();

    document.getElementById('prev-btn').addEventListener('click', () => navigate(-1));
    document.getElementById('next-btn').addEventListener('click', () => navigate(1));
};