// ─── Constants ───────────────────────────────────────────────

const SYMBOLS = {
    todo:   '<span class="bullet bullet--todo"   aria-label="task"></span>',
    event:  '<span class="bullet bullet--event"  aria-label="event">◆</span>',
    memory: '<span class="bullet bullet--memory" aria-label="memory">#</span>',
};

// ─── Routing ─────────────────────────────────────────────────

const startLink = document.getElementById('start-link');
if (startLink) {
    startLink.addEventListener('click', function (e) {
        e.preventDefault();
        const isSetupComplete = localStorage.getItem('hasCompletedSetup');
        window.location.href = isSetupComplete === 'true' ? 'dashboard.html' : 'setup.html';
    });
}

// ─── View Helpers ─────────────────────────────────────────────

function getActiveView() {
    const params = new URLSearchParams(window.location.search);
    return params.get('view') || 'day';
}

function isInView(dateString, view) {
    const today = new Date();
    const date = new Date(dateString + 'T00:00:00');

    if (view === 'day') {
        return dateString === todayKey();
    }
    if (view === 'week') {
        const start = new Date(today);
        start.setDate(today.getDate() - today.getDay());
        start.setHours(0, 0, 0, 0);
        return date >= start;
    }
    if (view === 'month') {
        return date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }
    if (view === 'year') {
        return date.getFullYear() === today.getFullYear();
    }
    return false;
}

function setActiveViewLink() {
    const view = getActiveView();
    document.querySelectorAll('.view-nav a').forEach(a => {
        if (!a.href.includes('bujo.html')) return;
        const params = new URLSearchParams(a.search);
        const linkView = params.get('view') || 'day';
        a.classList.toggle('active', linkView === view);
    });
}

// ─── Date & Title Display ─────────────────────────────────────

function todayKey() {
    return new Date().toISOString().split('T')[0];
}

function formatDateMMDDYYYY(dateString) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day   = String(date.getDate()).padStart(2, '0');
    const year  = date.getFullYear();
    return `${month}-${day}-${year}`;
}

function formatRange(start, end, view) {
    const dayMonth  = { month: 'long', day: 'numeric' };
    const monthYear = { month: 'long', year: 'numeric' };

    if (view === 'week') {
        return start.toLocaleDateString('en-US', dayMonth) +
               ' to ' +
               end.toLocaleDateString('en-US', dayMonth);
    }
    if (view === 'year') {
        return start.toLocaleDateString('en-US', monthYear) +
               ' to ' +
               end.toLocaleDateString('en-US', monthYear);
    }
}

function displayCurrentDate() {
    const el = document.getElementById('current-date');
    if (!el) return;

    const view  = getActiveView();
    const today = new Date();

    if (view === 'day') {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        el.innerText = today.toLocaleDateString('en-US', options);
    }
    if (view === 'week') {
        const end = new Date(today);
        end.setDate(today.getDate() + 6);
        el.innerText = formatRange(today, end, 'week');
    }
    if (view === 'month') {
        el.innerText = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    if (view === 'year') {
        const end = new Date(today);
        end.setFullYear(today.getFullYear() + 1);
        el.innerText = formatRange(today, end, 'year');
    }
}

function updateTitle() {
    const titles = {
        day:   'Today',
        week:  'This Week',
        month: 'This Month',
        year:  'This Year'
    };
    const title = titles[getActiveView()];
    document.querySelector('.mainTitle').textContent = title;
    document.title = title + ' - BuJo.io';
}

// ─── Holidays ─────────────────────────────────────────────────

function getDaysRemaining(dateString) {
    const today  = new Date();
    const target = new Date(dateString);
    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

async function fetchUpcomingHolidays() {
    try {
        const res = await fetch("https://date.nager.at/api/v3/NextPublicHolidays/US");
        return await res.json();
    } catch (err) {
        console.error("Failed to fetch holidays:", err);
        return [];
    }
}

function renderHolidays(holidays) {
    const container = document.getElementById("holiday-list");
    if (!container) return;

    container.innerHTML = "";

    holidays.slice(0, 5).forEach(h => {
        const days = getDaysRemaining(h.date);
        const div  = document.createElement("div");
        div.className = "holiday-card";
        div.innerHTML = `
            <strong>${h.name}</strong><br>
            <small>${formatDateMMDDYYYY(h.date)}</small><br>
            <em>${days === 0 ? "Today!" : `${days} days remaining`}</em><br>
            <button class="add-holiday-btn" data-name="${h.name}" data-date="${h.date}">
                Add to Journal
            </button>
        `;
        container.appendChild(div);
    });
}

function addHolidayToJournal(name, date) {
    const entries = loadEntries();
    entries.push({
        id:    Date.now(),
        type:  'event',
        html:  `<p><strong>${name}</strong> (Holiday)</p>`,
        date:  date,
        state: 'active'
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    renderEntries();
}

function initHolidayListeners() {
    const container = document.getElementById("holiday-list");
    if (!container) return;
    container.addEventListener("click", (e) => {
        if (e.target.classList.contains("add-holiday-btn")) {
            addHolidayToJournal(e.target.dataset.name, e.target.dataset.date);
        }
    });
}

function initHolidayToggle() {
    const toggle = document.getElementById("holidays-toggle");
    const list   = document.getElementById("holiday-list");
    if (!toggle || !list) return;
    toggle.addEventListener("click", () => {
        const isHidden = list.classList.contains("hidden");
        list.classList.toggle("hidden");
        toggle.textContent = isHidden ? "▼ Upcoming Holidays" : "▶ Upcoming Holidays";
    });
}

// ─── Entry Rendering ──────────────────────────────────────────

function renderEntries() {
    const list = document.getElementById('entries-list');
    if (!list) return;

    const view    = getActiveView();
    const entries = loadEntries().filter(e => isInView(e.date, view));
    list.innerHTML = '';

    if (entries.length === 0) return;

    const viewLabels = {
        day:   "Today's Entries",
        week:  "This Week's Entries",
        month: "This Month's Entries",
        year:  "This Year's Entries"
    };

    const heading = document.createElement('h2');
    heading.textContent = viewLabels[view];
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
            actionsHtml = entry.state === 'active'
                ? `<div class="entry-actions">
                       <button class="action-btn action-btn--done"    data-id="${entry.id}" title="Mark complete">✕</button>
                       <button class="action-btn action-btn--migrate" data-id="${entry.id}" title="Migrate">›</button>
                       <button class="action-btn action-btn--delete"  data-id="${entry.id}" title="Delete">⌫</button>
                   </div>`
                : `<div class="entry-actions">
                       <button class="action-btn action-btn--delete" data-id="${entry.id}" title="Delete">⌫</button>
                   </div>`;
        }
        if (entry.type === 'event') {
            actionsHtml = `<div class="entry-actions">
                               <button class="action-btn action-btn--edit"   data-id="${entry.id}" title="Edit">✎</button>
                               <button class="action-btn action-btn--delete" data-id="${entry.id}" title="Delete">⌫</button>
                           </div>`;
        }

        const entryDate = entry.type === 'event'
            ? `<span class="entry-date">${formatDateMMDDYYYY(entry.date).slice(0, 5).replace('-', '/')}</span>`
            : '';

        row.innerHTML = `
            <div class="entry-symbol">${symbolHtml}</div>
            <div class="entry-body">${entry.html}${entryDate}</div>
            ${actionsHtml}
        `;

        list.appendChild(row);
    });

    list.querySelectorAll('.action-btn--done').forEach(btn => {
        btn.addEventListener('click', () => {
            updateEntryState(Number(btn.dataset.id), 'done');
            renderEntries();
        });
    });
    list.querySelectorAll('.action-btn--migrate').forEach(btn => {
        btn.addEventListener('click', () => {
            updateEntryState(Number(btn.dataset.id), 'migrated');
            renderEntries();
        });
    });
    list.querySelectorAll('.action-btn--delete').forEach(btn => {
        btn.addEventListener('click', () => {
            deleteEntry(Number(btn.dataset.id));
            renderEntries();
        });
    });
    list.querySelectorAll('.action-btn--edit').forEach(btn => {
        btn.addEventListener('click', () => editEntry(Number(btn.dataset.id)));
    });
}

// ─── Entry Actions ────────────────────────────────────────────

function editEntry(id) {
    const entries = loadEntries();
    const entry   = entries.find(e => e.id === id);
    if (!entry) return;

    const row  = document.querySelector(`.entry-row[data-id="${id}"]`);
    const body = row.querySelector('.entry-body');
    const currentText = body.innerText.trim();

    body.innerHTML = `
        <input type="text" class="edit-input" value="${currentText}">
        <button class="action-btn action-btn--save" data-id="${id}">Save</button>
    `;

    body.querySelector('.action-btn--save').addEventListener('click', () => {
        const newText = body.querySelector('.edit-input').value.trim();
        if (!newText) return;
        entry.html = `<p>${newText}</p>`;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
        renderEntries();
    });

    body.querySelector('.edit-input').focus();
}

// ─── Quill Editor ─────────────────────────────────────────────

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

    const dateInput = document.getElementById('log-date');
    if (dateInput) dateInput.value = todayKey();

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

        const selectedDate = document.getElementById('log-date').value || todayKey();
        saveEntry(logTypeInput.value, quill.root.innerHTML, selectedDate);

        quill.setContents([]);
        form.reset();
        if (dateInput) dateInput.value = todayKey();
    });
}

// ─── Init ─────────────────────────────────────────────────────

window.onload = async function () {
    applyUserSettings();
    updateTitle();
    displayCurrentDate();
    setActiveViewLink();
    initQuill();
    renderEntries();

    const holidays = await fetchUpcomingHolidays();
    renderHolidays(holidays);
    initHolidayListeners();
    initHolidayToggle();
};