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

    window.location.href = 'dashboard.html';});

document.querySelectorAll('input[name="visual-preference"]').forEach(radio => {
    radio.addEventListener('change', () => {
        document.body.setAttribute('data-theme', radio.value);
    });
});

document.querySelectorAll('input[name="font-size"]').forEach(radio => {
    radio.addEventListener('change', () => {
        document.body.setAttribute('data-font-size', radio.value);
    });
});