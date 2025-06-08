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

// Cambiar fondo del header al hacer scroll
var header = document.querySelector('.header');
window.addEventListener('scroll', function() {
  if (window.scrollY > 50) {
    header.classList.add('header--scrolled');
  } else {
    header.classList.remove('header--scrolled');
  }
});

// Quitar bloqueo si se redimensiona a escritorio
window.addEventListener('resize', function() {
  if (window.innerWidth > 900) {
    document.body.classList.remove('menu-open');
    document.querySelector('.nav-menu').classList.remove('active', 'show');
  }
});

// Carrusel de clientes
document.addEventListener('DOMContentLoaded', function() {
  var slides = document.querySelectorAll('.carousel-clientes .slide');
  var btnPrev = document.getElementById('prev');
  var btnNext = document.getElementById('next');
  var currentIndex = 0;

  function showSlide(index) {
    if (index < 0) {
      index = slides.length - 1;
    } else if (index >= slides.length) {
      index = 0;
    }

    // Quitamos 'active' de todos los slides
    for (var i = 0; i < slides.length; i++) {
      slides[i].classList.remove('active');
    }
    // Activamos el slide actual
    slides[index].classList.add('active');
    currentIndex = index;
  }

  btnPrev.addEventListener('click', function() {
    showSlide(currentIndex - 1);
  });
  btnNext.addEventListener('click', function() {
    showSlide(currentIndex + 1);
  });
});

// Toast de Bootstrap (sin cambiar)
var toastInstance = null;
function initToast() {
  var toastEl = document.getElementById('liveToast');
  if (!toastEl || typeof bootstrap === 'undefined') return;
  toastInstance = new bootstrap.Toast(toastEl, { delay: 3500 });
}
function showToast(message, type) {
  type = type || 'success';
  var toastEl = document.getElementById('liveToast');
  var toastBody = document.getElementById('toast-message');
  if (!toastEl || !toastBody) return;
  if (toastInstance) toastInstance.dispose();
  toastBody.textContent = message;
  var classes = ['text-bg-success','text-bg-danger','text-bg-warning','text-bg-info'];
  for (var i = 0; i < classes.length; i++) {
    toastEl.classList.remove(classes[i]);
  }
  toastEl.classList.add('text-bg-' + type);
  toastInstance = new bootstrap.Toast(toastEl, { delay: 3500 });
  toastInstance.show();
}

// Funciones de almacenamiento
function obtenerClientes() {
  var datos = localStorage.getItem('clientes');
  return datos ? JSON.parse(datos) : [];
}
function guardarClientes(lista) {
  localStorage.setItem('clientes', JSON.stringify(lista));
}

// Formulario de contacto
function initForm() {
  var form = document.getElementById('form-contacto');
  var tieneWebRadios = document.querySelectorAll('input[name="tieneWeb"]');
  var webExisteDiv = document.getElementById('webExiste');
  var paginaWebInput = document.getElementById('paginaWeb');
  var tieneIgRadios = document.querySelectorAll('input[name="tieneIg"]');
  var igExisteDiv = document.getElementById('igExiste');
  var igUsuarioInput = document.getElementById('igUsuario');

  if (!form || !webExisteDiv || !paginaWebInput || !igExisteDiv || !igUsuarioInput) {
    console.error('Faltan elementos para el formulario.');
    return;
  }

  function getChecked(name) {
    var sel = document.querySelector('input[name="'+name+'"]:checked');
    return sel ? sel.value : null;
  }

  function toggleWeb() {
    if (getChecked('tieneWeb') === 'si') {
      webExisteDiv.style.display = 'block';
    } else {
      webExisteDiv.style.display = 'none';
      paginaWebInput.value = '';
    }
  }
  function toggleIg() {
    if (getChecked('tieneIg') === 'si') {
      igExisteDiv.style.display = 'block';
    } else {
      igExisteDiv.style.display = 'none';
      igUsuarioInput.value = '';
    }
  }

  // Reemplazo de NodeList.forEach con for
  for (var i = 0; i < tieneWebRadios.length; i++) {
    tieneWebRadios[i].addEventListener('change', toggleWeb);
  }
  for (var j = 0; j < tieneIgRadios.length; j++) {
    tieneIgRadios[j].addEventListener('change', toggleIg);
  }

  // Estado inicial
  toggleWeb();
  toggleIg();

  // Contador incremental de IDs
  var nextClientId = 1;
  var existentes = obtenerClientes();
  for (var k = 0; k < existentes.length; k++) {
    if (existentes[k].id >= nextClientId) {
      nextClientId = existentes[k].id + 1;
    }
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validación manual
    var campos = [
      { el: document.getElementById('nombre'), msg: 'Nombre es requerido.' },
      { el: document.getElementById('apellido'), msg: 'Apellido es requerido.' },
      { el: document.getElementById('telefono'), msg: 'Teléfono es requerido.' },
      { el: document.getElementById('mail'), msg: 'Mail es requerido.' },
      { el: document.getElementById('nombre-empresa'), msg: 'Empresa requerida.' },
      { el: document.getElementById('rubro'), msg: 'Rubro es requerido.' }
    ];
    for (var m = 0; m < campos.length; m++) {
      if (!campos[m].el.value.trim()) {
        showToast(campos[m].msg, 'warning');
        return;
      }
    }

    // Crear nuevo cliente con ID incremental
    var nuevo = {
      id: nextClientId,
      nombre: document.getElementById('nombre').value.trim(),
      apellido: document.getElementById('apellido').value.trim(),
      telefono: document.getElementById('telefono').value.trim(),
      mail: document.getElementById('mail').value.trim(),
      empresa: document.getElementById('nombre-empresa').value.trim(),
      rubro: document.getElementById('rubro').value.trim(),
      paginaWeb: paginaWebInput.value.trim(),
      ig: igUsuarioInput.value.trim(),
      mensaje: document.getElementById('mensaje').value.trim(),
      avance: 'Inicio'
    };
    nextClientId++;

    var lista = obtenerClientes();
    lista.push(nuevo);
    guardarClientes(lista);

    form.reset();
    toggleWeb();
    toggleIg();
    showToast('¡Gracias! Tu consulta ha sido enviada.', 'success');
  });
}

document.addEventListener('DOMContentLoaded', function() {
  initToast();
  initForm();
});
