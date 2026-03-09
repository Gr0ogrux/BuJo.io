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

    localStorage.setItem('bujo_user_settings', JSON.stringify(userSettings));

    window.location.href = 'dashboard.html';});