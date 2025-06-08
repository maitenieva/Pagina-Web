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



document.addEventListener("DOMContentLoaded", () => {
  const carousels = document.querySelectorAll(".portfolio-carousel");

  carousels.forEach((carousel) => {
    new Swiper(carousel, {
      loop: true,
      slidesPerView: 3,
      spaceBetween: 24,

      // Paginación
      pagination: {
        el: carousel.querySelector(".swiper-pagination"),
        clickable: true,
      },
      // Navegación (flechas)
      navigation: {
        nextEl: carousel.querySelector(".swiper-button-next"),
        prevEl: carousel.querySelector(".swiper-button-prev"),
      },

      // Adaptaciones responsivas
      breakpoints: {
        // Móvil (hasta 639px)
        0: {
          slidesPerView: 1,
          spaceBetween: 12,
        },
        // Tablet (640px a 1023px)
        640: {
          slidesPerView: 2,
          spaceBetween: 16,
        },
        // Escritorio (1024px en adelante)
        1024: {
          slidesPerView: 3,
          spaceBetween: 24,
        },
      },
    });
  });
});
