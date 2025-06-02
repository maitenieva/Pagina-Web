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

const storageKey = "contactoMensajes";

const mensajesExistentes = JSON.parse(localStorage.getItem(storageKey)) || localStorage.setItem(storageKey, JSON.stringify(mensajesExistentes))

const formContacto = document.getElementById("form-contacto");
const statusElem = document.getElementById("status");

const radioTieneWeb = document.querySelectorAll('input[name="tieneWeb"]');
const campoWeb = document.getElementById("webExiste");
const inputWeb = document.getElementById("paginWeb");

const radioTieneIg = document.querySelectorAll('input[name="tieneIg"]');
const campoIg = document.getElementById("igExiste");
const inputIg = document.getElementById("igUsuario");

radioTieneWeb.forEach(radio => {
  radio.addEventListener("change", () => {
    if (radio.value === "si") {
      campoWeb.hidden = false;
      inputWeb.required = true;
    } else {
      campoWeb.hidden = true;
      inputWeb.required = false;
      inputWeb.value = "";
    }
  });
});

radioTieneIg.forEach(radio => {
  radio.addEventListener("change", () => {
    if (radio.value === "si") {
        campoIg.hidden = false;
        inputIg.required = true;
    } else {
        campoIg.hidden = true;
        inputIg.required = false;
        inputIg.value = "";
    }
  });
});

/* envio formulario*/

formContacto.addEventListener("submit", (e) => {
    e.preventDefault();

    // tomo los valores de los inputs
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const mail = document.getElementById("mail").value.trim();
    const nombreEmp = document.getElementById("nombre-empresa").value.trim();
    const rubro = document.getElementById("rubro").value.trim();
    const mensaje  = document.getElementById("mensaje").value.trim();

    const tieneWebSel = document.querySelector('input[name="tieneWeb"]:checked')?.value;
    const tieneIgSel = document.querySelector('input[name="tieneIg"]:checked')?.value;

    const urlWeb = inputWeb.value.trim();
    const urlIg = inputIg.value.trim();

    // validacion
    if (!nombre || !apellido || !telefono || !mail || !nombreEmp || !rubro || !tieneWebSel || !tieneIgSel) {
        statusElem.textContent = "Por favor, completa todos los campos obligatorios.";
        statusElem.style.color = "crimson";
        return;
    }

    // Si elige “Sí” en web, pido URL válida
    if (tieneWebSel === "si" && !urlWeb) {
        statusElem.textContent = "Ingresá la URL de tu sitio web.";
        statusElem.style.color = "crimson";
        return;
    }

    // Si elige “Sí” en IG, pido URL válida
    if (tieneIgSel === "si" && !urlIg) {
        statusElem.textContent = "Ingresá la URL de tu Instagram empresarial.";
        statusElem.style.color = "crimson";
        return;
    }

    // objeto que voy a guardar
    const nuevoContacto = {
        nombre,
        apellido,
        telefono,
        mail,
        nombreEmpresa: nombreEmp,
        rubro,
        tieneWeb: tieneWebSel === "si",
        urlWeb: tieneWebSel === "si" ? urlWeb : null,
        tieneIg: tieneIgSel === "si",
        urlIg: tieneIgSel === "si" ? urlIg : null,
        mensaje,
        fecha: new Date().toISOString()
    };

    // recupero el array del storage, le agrego el nuevo y vuelvo a guardar
    const todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    todos.push(nuevoContacto);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));

    // mensaje para el usuario
    statusElem.textContent = "¡Enviado correctamente! Gracias por contactarte.";
    statusElem.style.color = "green";

    // reseteo el formulario y oculto los campos condicionales
    setTimeout(() => {
        formContacto.reset();
        campoWeb.hidden = true;
        inputWeb.required = false;
        campoIg.hidden = true;
        inputIg.required = false;
        statusElem.textContent = "";
    }, 1500);
    });