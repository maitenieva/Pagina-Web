document.querySelector('.menu-toggle').addEventListener('click', function() {
    const menu = document.querySelector('.nav-menu');
    const body = document.body;
    
    menu.classList.toggle('active');
    menu.classList.toggle('show');
    
    // Solo bloquea el scroll si está en móvil (menú visible)
    if (window.innerWidth <= 900) {
        body.classList.toggle('menu-open');
    }
});

// Remueve el bloqueo si se redimensiona a escritorio
window.addEventListener('resize', function() {
    if (window.innerWidth > 900) {
        document.body.classList.remove('menu-open');
        document.querySelector('.nav-menu').classList.remove('active', 'show');
    }
});