
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
