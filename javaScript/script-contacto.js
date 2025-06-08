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

let toastInstance = null;
let nextClientId = 1; // contador incremental para nuevos IDs

function initToast() {
  const toastEl = document.getElementById("liveToast");
  if (!toastEl) {
    console.error("No se encontró <div id='liveToast'> en el DOM.");
    return;
  }
  if (typeof bootstrap === "undefined") {
    console.error(
      "'bootstrap' no está definido. Asegúrate de cargar bootstrap.bundle.min.js antes de este script."
    );
    return;
  }
  toastInstance = new bootstrap.Toast(toastEl, { delay: 3500 });
}

function showToast(message, type = "success") {
  const toastEl = document.getElementById("liveToast");
  const toastBody = document.getElementById("toast-message");
  if (!toastEl || !toastBody) {
    console.error("No se encontró #liveToast o #toast-message en el DOM.");
    return;
  }
  if (toastInstance) toastInstance.dispose();
  toastBody.textContent = message;
  const bgClasses = [
    "text-bg-success",
    "text-bg-danger",
    "text-bg-warning",
    "text-bg-info",
  ];
  toastEl.classList.remove(...bgClasses);
  toastEl.classList.add(`text-bg-${type}`);
  toastInstance = new bootstrap.Toast(toastEl, { delay: 3500 });
  toastInstance.show();
}

function initForm() {
  const form = document.getElementById("form-contacto");
  const tieneWebRadios = document.querySelectorAll('input[name="tieneWeb"]');
  const webExisteDiv = document.getElementById("webExiste");
  const paginaWebInput = document.getElementById("paginaWeb");

  const tieneIgRadios = document.querySelectorAll('input[name="tieneIg"]');
  const igExisteDiv = document.getElementById("igExiste");
  const igUsuarioInput = document.getElementById("igUsuario");

  if (!form || !webExisteDiv || !paginaWebInput || !igExisteDiv || !igUsuarioInput) {
    console.error("Faltan elementos esenciales para el formulario.");
    return;
  }

  function getCheckedRadioValue(name) {
    const sel = document.querySelector(`input[name="${name}"]:checked`);
    return sel ? sel.value : null;
  }

  function toggleWebField() {
    if (getCheckedRadioValue("tieneWeb") === "si") {
      webExisteDiv.style.display = "block";
    } else {
      webExisteDiv.style.display = "none";
      paginaWebInput.value = "";
    }
  }

  function toggleIgField() {
    if (getCheckedRadioValue("tieneIg") === "si") {
      igExisteDiv.style.display = "block";
    } else {
      igExisteDiv.style.display = "none";
      igUsuarioInput.value = "";
    }
  }

  // Reemplazo de NodeList.forEach por for clásico
  for (let i = 0; i < tieneWebRadios.length; i++) {
    tieneWebRadios[i].addEventListener("change", toggleWebField);
  }
  for (let i = 0; i < tieneIgRadios.length; i++) {
    tieneIgRadios[i].addEventListener("change", toggleIgField);
  }

  // Estado inicial
  toggleWebField();
  toggleIgField();

  // Validación manual en lugar de checkValidity()
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Campos obligatorios
    const campos = [
      { el: document.getElementById("nombre"), msg: "Nombre es requerido." },
      { el: document.getElementById("apellido"), msg: "Apellido es requerido." },
      { el: document.getElementById("telefono"), msg: "Teléfono es requerido." },
      { el: document.getElementById("mail"), msg: "Mail es requerido." },
      { el: document.getElementById("nombre-empresa"), msg: "Empresa es requerida." },
      { el: document.getElementById("rubro"), msg: "Rubro es requerido." },
      { el: document.getElementById("mensaje"), msg: "Mensaje es requerido." }
    ];
    for (let j = 0; j < campos.length; j++) {
      const { el, msg } = campos[j];
      if (!el.value.trim()) {
        showToast(msg, "warning");
        return;
      }
    }

    // Generación de ID incremental en lugar de Date.now()
    const nuevoId = nextClientId++;

    const nuevoCliente = {
      id: nuevoId,
      nombre: document.getElementById("nombre").value.trim(),
      apellido: document.getElementById("apellido").value.trim(),
      telefono: document.getElementById("telefono").value.trim(),
      mail: document.getElementById("mail").value.trim(),
      empresa: document.getElementById("nombre-empresa").value.trim(),
      rubro: document.getElementById("rubro").value.trim(),
      paginaWeb: paginaWebInput.value.trim() || null,
      ig: igUsuarioInput.value.trim() || null,
      mensaje: document.getElementById("mensaje").value.trim(),
      avance: "Inicio"
    };

    // Manejo de almacenamiento
    const clientesGuardados = JSON.parse(localStorage.getItem("clientes")) || [];
    clientesGuardados.push(nuevoCliente);
    localStorage.setItem("clientes", JSON.stringify(clientesGuardados));

    form.reset();
    toggleWebField();
    toggleIgField();
    showToast("¡Gracias! Tu consulta ha sido enviada.", "success");
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initToast();
  initForm();
});
