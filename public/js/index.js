const startLink = document.getElementById('start-link');

if (startLink) {
    startLink.addEventListener('click', function(e) {
        e.preventDefault(); 
        const isSetupComplete = localStorage.getItem('hasCompletedSetup');
        if (isSetupComplete === 'true') {
            window.location.href = 'dashboard.html'; 
        } else {
            window.location.href = 'setup.html';
        }
    });
}

function displayCurrentDate() {
    const descriptionElement = document.getElementById('current-date');
    if (descriptionElement) { 
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date();
        descriptionElement.innerText = today.toLocaleDateString('en-US', options);
    }
}

window.onload = displayCurrentDate;

