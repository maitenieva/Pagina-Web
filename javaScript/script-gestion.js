document.addEventListener("DOMContentLoaded", function () {
  // — Toggle de menú en móvil —
  document.querySelector('.menu-toggle').addEventListener('click', function() {
    var menu = document.querySelector('.nav-menu');
    var body = document.body;
    menu.classList.toggle('active');
    menu.classList.toggle('show');
    if (window.innerWidth <= 900) body.classList.toggle('menu-open');
  });

  // — Inyección dinámica de estilos para el CRUD —
  const estilosCSS = `
    .client-card .vista-edicion, .client-card .btn-save, .client-card .btn-cancel { display: none; }
    .client-card.is-editing .vista-lectura, .client-card.is-editing .btn-edit, .client-card.is-editing .btn-delete { display: none; }
    .client-card.is-editing .vista-edicion, .client-card.is-editing .btn-save, .client-card.is-editing .btn-cancel { display: block; }
    .client-card .edit-input { width: 100%; padding: 5px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px; }
  `;
  const tagEstilo = document.createElement("style");
  tagEstilo.textContent = estilosCSS;
  document.head.appendChild(tagEstilo);

  // — Elementos del DOM para el login y CRUD —
  const botonIngresar      = document.getElementById("ingresar");
  const campoContrasenia   = document.getElementById("contrasenia");
  const contenedorLogin    = document.getElementById("login-container");
  const seccionCRUD        = document.getElementById("crud-section");
  const okMensaje          = document.getElementById("success-msg");
  const errMensaje         = document.getElementById("error-msg");
  const contenedorClientes = document.getElementById("clientesContainer");
  const mensajeSinClientes = document.getElementById("noClientsMsg");
  const claveCorrecta      = "Matematica";

  let timeoutId;

  // — Funciones de LocalStorage —
  function obtenerClientes() {
    const datos = localStorage.getItem("clientes");
    return datos ? JSON.parse(datos) : [];
  }
  function guardarClientes(lista) {
    localStorage.setItem("clientes", JSON.stringify(lista));
  }

  // — Renderizado de tarjetas de clientes —
  function renderizarClientes() {
    contenedorClientes.innerHTML = "";
    const lista = obtenerClientes();

    if (lista.length === 0) {
      mensajeSinClientes.style.display = "block";
      return;
    }
    mensajeSinClientes.style.display = "none";

    lista.forEach(cliente => {
      const tarjeta = document.createElement("div");
      tarjeta.className = "client-card";
      tarjeta.dataset.id = cliente.id;
      tarjeta.innerHTML = `
        <div class="vista-lectura">
          <h2>${cliente.nombre} ${cliente.apellido}</h2>
          <p><strong>Teléfono:</strong> ${cliente.telefono}</p>
          <p><strong>Mail:</strong> ${cliente.mail}</p>
          <p><strong>Empresa:</strong> ${cliente.empresa}</p>
          <p><strong>Rubro:</strong> ${cliente.rubro}</p>
          <p><strong>Página Web:</strong> ${cliente.paginaWeb || 'No'}</p>
          <p><strong>Instagram:</strong> ${cliente.ig || 'No'}</p>
          <p><strong>Mensaje:</strong> ${cliente.mensaje}</p>
        </div>
        <div class="vista-edicion">
          <label>Nombre:</label><input type="text" class="edit-input edit-nombre" value="${cliente.nombre}">
          <label>Apellido:</label><input type="text" class="edit-input edit-apellido" value="${cliente.apellido}">
          <label>Teléfono:</label><input type="text" class="edit-input edit-telefono" value="${cliente.telefono}">
          <label>Mail:</label><input type="email" class="edit-input edit-mail" value="${cliente.mail}">
          <label>Empresa:</label><input type="text" class="edit-input edit-empresa" value="${cliente.empresa}">
          <label>Rubro:</label><input type="text" class="edit-input edit-rubro" value="${cliente.rubro}">
          <label>Web:</label><input type="url" class="edit-input edit-paginaWeb" value="${cliente.paginaWeb || ''}">
          <label>IG:</label><input type="url" class="edit-input edit-ig" value="${cliente.ig || ''}">
          <label>Mensaje:</label><textarea class="edit-input edit-mensaje">${cliente.mensaje}</textarea>
        </div>
        <label>Avance:</label>
        <select class="select-avance" data-id="${cliente.id}">
          <option value="Pendiente"   ${cliente.avance==='Pendiente'?   'selected':''}>Pendiente</option>
          <option value="Contactado"  ${cliente.avance==='Contactado'?  'selected':''}>Contactado</option>
          <option value="Activo"      ${cliente.avance==='Activo'?      'selected':''}>Activo</option>
        </select>
        <div class="actions">
          <button type="button" class="btn-edit">Editar</button>
          <button type="button" class="btn-delete">Eliminar</button>
          <button type="button" class="btn-save">Guardar</button>
          <button type="button" class="btn-cancel">Cancelar</button>
        </div>
      `;
      contenedorClientes.appendChild(tarjeta);
    });
  }

  // — Manejador único para el botón “Ingresar” —
  botonIngresar.addEventListener("click", function (e) {
    e.preventDefault();
    // Siempre ocultar ambos antes de validar
    okMensaje.classList.add("d-none");
    errMensaje.classList.add("d-none");
    clearTimeout(timeoutId);

    if (campoContrasenia.value.trim() === claveCorrecta) {
      okMensaje.classList.remove("d-none");
      timeoutId = setTimeout(() => okMensaje.classList.add("d-none"), 2000);
      setTimeout(() => {
        contenedorLogin.style.display = "none";
        seccionCRUD.style.display    = "block";
        renderizarClientes();
      }, 500);
    } else {
      errMensaje.classList.remove("d-none");
      timeoutId = setTimeout(() => errMensaje.classList.add("d-none"), 2000);
    }
  });

  // — Delegación de eventos para editar, guardar, eliminar, cancelar —
  contenedorClientes.addEventListener("click", function (evento) {
    const tarjeta = evento.target.closest(".client-card");
    if (!tarjeta) return;
    const id = tarjeta.dataset.id;
    let clientes = obtenerClientes();

    if (evento.target.classList.contains("btn-edit")) {
      tarjeta.classList.add("is-editing");
    }
    if (evento.target.classList.contains("btn-cancel")) {
      tarjeta.classList.remove("is-editing");
    }
    if (evento.target.classList.contains("btn-delete")) {
      if (confirm("¿Eliminar este cliente definitivamente?")) {
        clientes = clientes.filter(c => c.id != id);
        guardarClientes(clientes);
        renderizarClientes();
      }
    }
    if (evento.target.classList.contains("btn-save")) {
      const idx = clientes.findIndex(c => c.id == id);
      if (idx !== -1) {
        clientes[idx].nombre    = tarjeta.querySelector(".edit-nombre").value.trim();
        clientes[idx].apellido  = tarjeta.querySelector(".edit-apellido").value.trim();
        clientes[idx].telefono  = tarjeta.querySelector(".edit-telefono").value.trim();
        clientes[idx].mail      = tarjeta.querySelector(".edit-mail").value.trim();
        clientes[idx].empresa   = tarjeta.querySelector(".edit-empresa").value.trim();
        clientes[idx].rubro     = tarjeta.querySelector(".edit-rubro").value.trim();
        clientes[idx].paginaWeb = tarjeta.querySelector(".edit-paginaWeb").value.trim();
        clientes[idx].ig        = tarjeta.querySelector(".edit-ig").value.trim();
        clientes[idx].mensaje   = tarjeta.querySelector(".edit-mensaje").value.trim();
        guardarClientes(clientes);
        renderizarClientes();
      }
    }
  });

  // — Cambio de estado “Avance” —
  contenedorClientes.addEventListener("change", function (evento) {
    if (!evento.target.classList.contains("select-avance")) return;
    const id = evento.target.dataset.id;
    const lista = obtenerClientes();
    const idx = lista.findIndex(c => c.id == id);
    if (idx !== -1) {
      lista[idx].avance = evento.target.value;
      guardarClientes(lista);
    }
  });
});
