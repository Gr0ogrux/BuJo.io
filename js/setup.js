function prefillForm() {
    const settings = loadUserSettings();
    if (!settings || !settings.name) return;

    document.getElementById('name').value = settings.name || '';

    const timezone = document.getElementById('timezone');
    if (settings.timezone) timezone.value = settings.timezone;

    if (settings.visualPreference) {
        const visualRadio = document.querySelector(`input[name="visual-preference"][value="${settings.visualPreference}"]`);
        if (visualRadio) {
            visualRadio.checked = true;
            document.documentElement.setAttribute('data-theme', settings.visualPreference);
        }
    }

    if (settings.fontSize) {
        const fontRadio = document.querySelector(`input[name="font-size"][value="${settings.fontSize}"]`);
        if (fontRadio) {
            fontRadio.checked = true;
            document.documentElement.setAttribute('data-font-size', settings.fontSize);
        }
    }
}

document.querySelectorAll('input[name="visual-preference"]').forEach(radio => {
    radio.addEventListener('change', () => {
        document.documentElement.setAttribute('data-theme', radio.value);
    });
});

document.querySelectorAll('input[name="font-size"]').forEach(radio => {
    radio.addEventListener('change', () => {
        document.documentElement.setAttribute('data-font-size', radio.value);
    });
});

const setupForm = document.querySelector('.setup-form');

setupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(setupForm);

    const userSettings = {
        name: formData.get('name'),
        timezone: formData.get('timezone'),
        visualPreference: formData.get('visual-preference'),
        fontSize: formData.get('font-size'),
        setupComplete: true
    };

    saveUserSettings(userSettings);
    localStorage.setItem('hasCompletedSetup', 'true');
    window.location.href = 'dashboard.html';
});

document.addEventListener('DOMContentLoaded', function() {
    prefillForm();
});