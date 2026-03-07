document.getElementById('start-link').addEventListener('click', function(e) {
    e.preventDefault(); 

    const isSetupComplete = localStorage.getItem('hasCompletedSetup');

    if (isSetupComplete === 'true') {
        window.location.href = 'dashboard.html'; 
    } else {
        window.location.href = 'setup.html';
    }
});