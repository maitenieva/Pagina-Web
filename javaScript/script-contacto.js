// Detectar scroll para cambiar el fondo de la header
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  // Si ya hicimos scroll hacia abajo más de 50px (puedes ajustar ese valor)
  if (window.scrollY > 50) {
    header.classList.add('header--scrolled');
  } else {
    header.classList.remove('header--scrolled');
  }
});


// Remueve el bloqueo si se redimensiona a escritorio
window.addEventListener('resize', function() {
  if (window.innerWidth > 900) {
    document.body.classList.remove('menu-open');
    document.querySelector('.nav-menu').classList.remove('active', 'show');
  }
});


let toastInstance = null;

function initToast() {
  const toastEl = document.getElementById('liveToast');
  if (!toastEl) {
    console.error("No se encontró <div id='liveToast' class='toast'> en el DOM.");
    return;
  }

  if (typeof bootstrap === 'undefined') {
    console.error("'bootstrap' no está definido. Asegúrate de cargar bootstrap.bundle.min.js antes de este script.");
    return;
  }

  toastInstance = new bootstrap.Toast(toastEl, {
    delay: 3500 // Duración antes de ocultarse (en ms)
  });
}

/**
 * Muestra un mensaje dinámico en el toast.
 * @param {string} message — Texto que quieres mostrar.
 * @param {'success'|'danger'|'warning'|'info'} [type='success'] — Clase de color de fondo.
 */

function showToast(message, type = 'success') {
  const toastEl = document.getElementById('liveToast');
  const toastBody = document.getElementById('toast-message');

  if (!toastEl || !toastBody) {
    console.error("No se encontró #liveToast o #toast-message en el DOM.");
    return;
  }

  // Si ya había una instancia previa, la destruimos
  if (toastInstance) {
    toastInstance.dispose();
  }

  // Actualizamos el texto
  toastBody.textContent = message;

  const bgClasses = ['text-bg-success', 'text-bg-danger', 'text-bg-warning', 'text-bg-info'];
  toastEl.classList.remove(...bgClasses);

  // Asignamos la clase de color adecuada
  let toastClass = 'text-bg-success';
  if (type === 'danger') toastClass = 'text-bg-danger';
  else if (type === 'warning') toastClass = 'text-bg-warning';
  else if (type === 'info') toastClass = 'text-bg-info';
  toastEl.classList.add(toastClass);

  toastInstance = new bootstrap.Toast(toastEl, { delay: 3500 });
  toastInstance.show();
}

function initForm() {
  const form = document.getElementById('form-contacto');
  const tieneWebRadios = document.querySelectorAll('input[name="tieneWeb"]');
  const webExisteDiv = document.getElementById('webExiste');
  const paginaWebInput = document.getElementById('paginaWeb');

  const tieneIgRadios = document.querySelectorAll('input[name="tieneIg"]');
  const igExisteDiv = document.getElementById('igExiste');
  const igUsuarioInput = document.getElementById('igUsuario');

  if (!form || !webExisteDiv || !paginaWebInput || !igExisteDiv || !igUsuarioInput) {
    console.error("Faltan elementos esenciales para el formulario.");
    return;
  }

  // Auxiliar: devuelve el valor del radio seleccionado
  function getCheckedRadioValue(name) {
    const sel = document.querySelector(`input[name="${name}"]:checked`);
    return sel ? sel.value : null;
  }

  // Mostrar/ocultar campo
  function toggleWebField() {
    if (getCheckedRadioValue('tieneWeb') === 'si') {
      webExisteDiv.style.display = 'block';
      paginaWebInput.required = true;
    } else {
      webExisteDiv.style.display = 'none';
      paginaWebInput.required = false;
      paginaWebInput.value = '';
    }
  }

  function toggleIgField() {
    if (getCheckedRadioValue('tieneIg') === 'si') {
      igExisteDiv.style.display = 'block';
      igUsuarioInput.required = true;
    } else {
      igExisteDiv.style.display = 'none';
      igUsuarioInput.required = false;
      igUsuarioInput.value = '';
    }
  }

  // Asociar listeners 
  tieneWebRadios.forEach(radio =>
    radio.addEventListener('change', toggleWebField)
  );

  tieneIgRadios.forEach(radio =>
    radio.addEventListener('change', toggleIgField)
  );

  // Estado inicial al cargar
  toggleWebField();
  toggleIgField();

  // Manejo del envío del formulario
  form.addEventListener('submit', function(event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    form.reset();
    toggleWebField();
    toggleIgField();

    // Mostrar el toast de confirmación
    showToast('¡Gracias! Tu consulta ha sido enviada.', 'success');
  });
}

document.addEventListener('DOMContentLoaded', function() {
  initToast();
  initForm();
});


