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

//Boton formulario y mensaje si hay algun error o algo asi
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('form-contacto');
  const tieneWebRadios = document.querySelectorAll('input[name="tieneWeb"]');
  const webExisteDiv = document.getElementById('webExiste');
  const paginaWebInput = document.getElementById('paginaWeb');

  const tieneIgRadios = document.querySelectorAll('input[name="tieneIg"]');
  const igExisteDiv = document.getElementById('igExiste');
  const igUsuarioInput = document.getElementById('igUsuario');

  const toastEl = document.getElementById('contactToast');
  let toastInstance = null; // Inicializar como null

  if (toastEl) { // Solo inicializar si el elemento existe
    toastInstance = new bootstrap.Toast(toastEl, {
      delay: 7000 // Puedes configurar opciones aquí también
    });
  } else {
    console.error("Elemento Toast con id 'contactToast' no encontrado.");
  }

  // Función para mostrar/ocultar campo de URL de la web
  function toggleWebField() {
    if (document.querySelector('input[name="tieneWeb"]:checked').value === 'si') {
      webExisteDiv.style.display = 'block';
      paginaWebInput.required = true; 
      } else {
        webExisteDiv.style.display = 'none';
        paginaWebInput.required = false; 
        paginaWebInput.value = ''; 
      }
    const radioChecked = document.querySelector('input[name="tieneWeb"]:checked');
    if (radioChecked && radioChecked.value === 'si') {
      webExisteDiv.style.display = 'block';
      paginaWebInput.required = true;
    } else {
      webExisteDiv.style.display = 'none';
      paginaWebInput.required = false;
      paginaWebInput.value = '';
    }
  }

  function toggleIgField() {
    if (document.querySelector('input[name="tieneIg"]:checked').value === 'si') {
      igExisteDiv.style.display = 'block';
      igUsuarioInput.required = true; 
    } else {
      igExisteDiv.style.display = 'none';
      igUsuarioInput.required = false; 
      igUsuarioInput.value = ''; 
    }

    const radioChecked = document.querySelector('input[name="tieneIg"]:checked');
    if (radioChecked && radioChecked.value === 'si') {
      igExisteDiv.style.display = 'block';
      igUsuarioInput.required = true;
    } else {
      igExisteDiv.style.display = 'none';
      igUsuarioInput.required = false;
      igUsuarioInput.value = '';
    }
  }

  // Event listeners para los radio buttons de la web
  tieneWebRadios.forEach(radio => {
    radio.addEventListener('change', toggleWebField);
  });

  // Event listeners para los radio buttons de Instagram
  tieneIgRadios.forEach(radio => {
    radio.addEventListener('change', toggleIgField);
  });

  webExisteDiv.style.display = 'none';
  paginaWebInput.required = false;
  igExisteDiv.style.display = 'none';
  igUsuarioInput.required = false;

  // Manejo del envío del formulario
  form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el envío real para este ejemplo

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    form.reset();

    // Ocultar campos condicionales después de resetear
    webExisteDiv.style.display = 'none';
    paginaWebInput.required = false;
    igExisteDiv.style.display = 'none';
    igUsuarioInput.required = false;

    if (toastInstance) { // Verificar que la instancia del toast exista
      const toastBody = toastEl.querySelector('.toast-body');
      if (toastBody) { // Verificar que el body del toast exista
        toastBody.textContent = '¡Gracias! Tu consulta ha sido enviada. Nos pondremos en contacto pronto.';
      }
      toastInstance.show();
    } else {
      console.error("La instancia del Toast no se pudo crear o el elemento no fue encontrado.");
      // Como fallback, podrías usar un alert o un mensaje en el DOM si el toast falla
      alert('¡Gracias! Tu consulta ha sido enviada. Nos pondremos en contacto pronto.');
    }
  });
});