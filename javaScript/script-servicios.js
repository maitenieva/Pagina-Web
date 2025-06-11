document.addEventListener('DOMContentLoaded', () => {
  const encabezado = document.querySelector('.header');
  if (encabezado) {
    const UMBRAL_SCROLL = 50;
    window.addEventListener('scroll', () => {
      encabezado.classList.toggle('header--scrolled', window.scrollY > UMBRAL_SCROLL);
    });
  }

  const botonMenu = document.querySelector('.menu-toggle');
  const menuNavegacion = document.querySelector('.nav-menu');
  if (botonMenu && menuNavegacion) {
    botonMenu.addEventListener('click', () => {
      menuNavegacion.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 992) {
        menuNavegacion.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  }
  
  document.querySelectorAll('.custom-carousel-wrapper').forEach(configurarCarrusel);

  function configurarCarrusel(contenedorDelCarrusel) {
    const slides = contenedorDelCarrusel.querySelectorAll('.slide');
    const botonAnterior = contenedorDelCarrusel.querySelector('.carousel-button.prev');
    const botonSiguiente = contenedorDelCarrusel.querySelector('.carousel-button.next');

    if (slides.length === 0) return;

    // rastreo la posición del primer slide visible
    let indiceActual = 0;

    // calculo cuántos slides deben ser visibles según el ancho de la pantalla.
    function obtenerCantidadVisible() {
      if (window.innerWidth <= 768) return 1; 
      if (window.innerWidth <= 992) return 2; 
      return 3; 
    }
    
    // 'actualizarVista' es la función principal: muestra y oculta los slides correctos.
    function actualizarVista() {
      const cantidadVisible = obtenerCantidadVisible();
      
      // Primero, ocultamos todos los slides para empezar de cero.
      slides.forEach(slide => slide.classList.remove('active'));

      // Luego, mostramos solo el grupo de slides que corresponde.
      for (let i = 0; i < cantidadVisible; i++) {
        const indiceParaMostrar = indiceActual + i;
        if (slides[indiceParaMostrar]) {
          slides[indiceParaMostrar].classList.add('active');
        }
      }
            
      // El botón 'anterior' se deshabilita si estamos en el primer slide.
      botonAnterior.disabled = indiceActual === 0;

      // El botón 'siguiente' se deshabilita si ya no hay más slides para mostrar a la derecha.
      botonSiguiente.disabled = indiceActual >= slides.length - cantidadVisible;
    }
    function moverSlide(direccion) {
        const cantidadVisible = obtenerCantidadVisible();
        const nuevoIndice = indiceActual + direccion;

        // Nos aseguramos de que el nuevo índice no se salga de los límites.
        if (nuevoIndice >= 0 && nuevoIndice <= slides.length - cantidadVisible) {
            indiceActual = nuevoIndice;
            actualizarVista();
        }
    }

    // Asignamos los eventos a los botones.
    botonAnterior?.addEventListener('click', () => moverSlide(-1)); 
    botonSiguiente?.addEventListener('click', () => moverSlide(1));  

    // Lógica para el deslizamiento táctil (swipe) en móviles.
    let inicioDelToqueX = 0;
    contenedorDelCarrusel.addEventListener('touchstart', e => {
        inicioDelToqueX = e.touches[0].clientX;
    }, { passive: true });

    contenedorDelCarrusel.addEventListener('touchend', e => {
      const distanciaDeslizada = e.changedTouches[0].clientX - inicioDelToqueX;
      if (Math.abs(distanciaDeslizada) > 50) {

        moverSlide(distanciaDeslizada < 0 ? 1 : -1);
      }
    });
    
    // Si el usuario cambia el tamaño, se reinicia el carrusel.
    window.addEventListener('resize', () => {
        indiceActual = 0; 
        actualizarVista();
    });
    
    // Llamada inicial para que el carrusel se muestre correctamente al cargar la página.
    actualizarVista();
  }
});