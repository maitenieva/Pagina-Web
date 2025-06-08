// Toggle de menú en móvil
document.querySelector('.menu-toggle').addEventListener('click', function() {
  var menu = document.querySelector('.nav-menu');
  var body = document.body;

  menu.classList.toggle('active');
  menu.classList.toggle('show');

  // Solo bloquea scroll en móvil
  if (window.innerWidth <= 900) {
    body.classList.toggle('menu-open');
  }
});

// Detectar scroll para cambiar el fondo del header
const header = document.querySelector(".header");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("header--scrolled");
  } else {
    header.classList.remove("header--scrolled");
  }
});

// Remueve el bloqueo si se redimensiona a escritorio
window.addEventListener("resize", function () {
  if (window.innerWidth > 900) {
    document.body.classList.remove("menu-open");
    document.querySelector(".nav-menu").classList.remove("active", "show");
  }
});


document.addEventListener('DOMContentLoaded', function() {

    // --- Funcionalidad para el menú de hamburguesa ---
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // --- Funcionalidad para animar elementos al hacer scroll ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    // Opciones para el IntersectionObserver
    const observerOptions = {
        root: null, // El viewport es el área de observación
        rootMargin: '0px',
        threshold: 0.1 // El elemento se considera visible cuando el 10% esté en pantalla
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Si el elemento está intersectando (visible)
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Dejar de observar el elemento una vez que la animación ha ocurrido
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar cada uno de los elementos con la clase .animate-on-scroll
    animatedElements.forEach(element => {
        observer.observe(element);
    });

});