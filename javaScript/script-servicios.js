document.addEventListener('DOMContentLoaded', () => {
  //Para mover el header, que aparezca el color cuando se hace scroll//
  const header = document.querySelector('.header');
  if (header) {
    const SCROLL_TRIGGER = 50;
    window.addEventListener('scroll', () => {
      header.classList.toggle('header--scrolled', window.scrollY > SCROLL_TRIGGER);
    });
  }
  //que aparezca el menu reducido dependiendo del tamaño de la pantalla//
  const burger = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (burger && navMenu) {
    burger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 992) {
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  }

  // carrusel//
  document.querySelectorAll('.custom-carousel-wrapper').forEach(setupCarousel);

  function setupCarousel(carouselWrapper) {
    const slides = carouselWrapper.querySelectorAll('.slide');
    const prevBtn = carouselWrapper.querySelector('.carousel-button.prev');
    const nextBtn = carouselWrapper.querySelector('.carousel-button.next');

    if (slides.length === 0) return;

    let currentIndex = 0;

    // Devuelve cuántas tarjetas deben ser visibles
    function getVisibleCount() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 992) return 2;
      return 3;
    }
    
    // Muestra los slides correctos
    function showSlides() {
      const visibleCount = getVisibleCount();
      
      // Oculta todos los slides que no se deberian ver
      slides.forEach(slide => slide.classList.remove('active'));

      // Muestra solo los que deben ser visibles
      for (let i = 0; i < visibleCount; i++) {
        const indexToShow = currentIndex + i;
        if (slides[indexToShow]) {
          slides[indexToShow].classList.add('active');
        }
      }
      
      // Se actualiza el estado de los botones cuando no hay mas slides para mostrar
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex + visibleCount >= slides.length;
    }

    // movimiento en bloque del carrusel
    function moveByBlock(direction) {
      const step = getVisibleCount();
      currentIndex += direction * step;

      // para que el indice no se salga del limite 
      if (currentIndex < 0) {
        currentIndex = 0;
      }
      if (currentIndex > slides.length - step) {
        // para que el final siempre muestre un grupo completo si es posible
         const remainder = slides.length % step;
         if (remainder !== 0) {
            currentIndex = slides.length - remainder;
         } else if (direction === -1) {
            currentIndex = slides.length - step;
         } else {
            currentIndex -= step;
         }
      }
      
      showSlides();
    }
    
    // Mueve el carrusel de uno en uno (para swipe)
    function moveOne(direction){
        const visibleCount = getVisibleCount();
        const newIndex = currentIndex + direction;

        if (newIndex >= 0 && newIndex <= slides.length - visibleCount) {
            currentIndex = newIndex;
            showSlides();
        }
    }

    // Asigna eventos a los botones
    prevBtn?.addEventListener('click', () => moveByBlock(-1));
    nextBtn?.addEventListener('click', () => moveByBlock(1));

    // Swipe táctil (mueve de a uno)
    let touchStartX = 0;
    carouselWrapper.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    carouselWrapper.addEventListener('touchend', e => {
      const swipeDistance = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(swipeDistance) > 50) {
        moveOne(swipeDistance < 0 ? 1 : -1);
      }
    });

    window.addEventListener('resize', () => {
        currentIndex = 0; // Resetea al cambiar tamaño
        showSlides();
    });
    
    showSlides(); // Llamada inicial
  }
});