document.addEventListener("DOMContentLoaded", function () {
  // === LOGIN / CONTROL DE ACCESO ===
  const btnIngresar = document.getElementById("ingresar");
  const inputPassword = document.getElementById("contrasenia");
  const successMsg = document.getElementById("success-msg");
  const errorMsg = document.getElementById("error-msg");
  const loginSection = document.getElementById("login");
  const crudSection = document.getElementById("crud-section");

  // Contraseña fija para acceso
  const accesoCorrecto = "Matematica";

  btnIngresar.addEventListener("click", function () {
    const clave = inputPassword.value.trim();

    if (clave === accesoCorrecto) {
      // Mostrar alerta de éxito y ocultar error
      successMsg.classList.remove("d-none");
      errorMsg.classList.add("d-none");

      // Tras 1 segundo, oculta login y muestra CRUD
      setTimeout(() => {
        loginSection.style.display = "none";
        crudSection.style.display = "block";
        renderClients();
      }, 1000);
    } else {
      // Mostrar alerta de error y ocultar éxito
      successMsg.classList.add("d-none");
      errorMsg.classList.remove("d-none");
    }
  });

  // === FUNCIONES DE LOCALSTORAGE ===
  function getClients() {
    const stored = localStorage.getItem("clientes");
    return stored ? JSON.parse(stored) : [];
  }
  function saveClients(arr) {
    localStorage.setItem("clientes", JSON.stringify(arr));
  }

  // === RENDERIZADO DE TARJETAS DE CLIENTES ===
  function renderClients() {
    const container = document.getElementById("clientsContainer");
    container.innerHTML = ""; // limpio antes de dibujar

    const clientes = getClients();
    const noMsg = document.getElementById("noClientsMsg");

    if (clientes.length === 0) {
      noMsg.style.display = "block";
      return;
    } else {
      noMsg.style.display = "none";
    }

    clientes.forEach((cliente) => {
      // Creo la tarjeta principal
      const card = document.createElement("div");
      card.className = "client-card";
      card.setAttribute("data-id", cliente.id);

      // 1) Nombre completo
      const h2 = document.createElement("h2");
      h2.textContent = `${cliente.nombre} ${cliente.apellido}`;
      card.appendChild(h2);

      // 2) Teléfono
      const labelTel = document.createElement("label");
      labelTel.textContent = "Teléfono:";
      card.appendChild(labelTel);
      const pTel = document.createElement("p");
      pTel.textContent = cliente.telefono;
      card.appendChild(pTel);

      // 3) Mail
      const labelMail = document.createElement("label");
      labelMail.textContent = "Mail:";
      card.appendChild(labelMail);
      const pMail = document.createElement("p");
      pMail.textContent = cliente.mail;
      card.appendChild(pMail);

      // 4) Empresa
      const labelEmp = document.createElement("label");
      labelEmp.textContent = "Empresa:";
      card.appendChild(labelEmp);
      const pEmp = document.createElement("p");
      pEmp.textContent = cliente.empresa;
      card.appendChild(pEmp);

      // 5) Rubro
      const labelRub = document.createElement("label");
      labelRub.textContent = "Rubro:";
      card.appendChild(labelRub);
      const pRub = document.createElement("p");
      pRub.textContent = cliente.rubro;
      card.appendChild(pRub);

      // 6) Página Web (si existe)
      if (cliente.paginaWeb) {
        const labelWeb = document.createElement("label");
        labelWeb.textContent = "Página Web:";
        card.appendChild(labelWeb);
        const pWeb = document.createElement("p");
        const aWeb = document.createElement("a");
        aWeb.href = cliente.paginaWeb;
        aWeb.textContent = cliente.paginaWeb;
        aWeb.target = "_blank";
        pWeb.appendChild(aWeb);
        card.appendChild(pWeb);
      }

      // 7) Instagram (si existe)
      if (cliente.ig) {
        const labelIg = document.createElement("label");
        labelIg.textContent = "Instagram:";
        card.appendChild(labelIg);
        const pIg = document.createElement("p");
        const aIg = document.createElement("a");
        aIg.href = cliente.ig;
        aIg.textContent = cliente.ig;
        aIg.target = "_blank";
        pIg.appendChild(aIg);
        card.appendChild(pIg);
      }

      // 8) Mensaje
      const labelMsg = document.createElement("label");
      labelMsg.textContent = "Mensaje:";
      card.appendChild(labelMsg);
      const pMsg = document.createElement("p");
      pMsg.textContent = cliente.mensaje;
      card.appendChild(pMsg);

      // 9) Avance (select)
      const labelAv = document.createElement("label");
      labelAv.textContent = "Avance:";
      card.appendChild(labelAv);
      const selectAv = document.createElement("select");
      ["Inicio", "En Proceso", "Completado"].forEach((opcion) => {
        const opt = document.createElement("option");
        opt.value = opcion;
        opt.textContent = opcion;
        if (cliente.avance === opcion) opt.selected = true;
        selectAv.appendChild(opt);
      });
      // Cuando cambie el avance, guardo inmediatamente
      selectAv.addEventListener("change", function () {
        updateProgress(cliente.id, this.value);
      });
      card.appendChild(selectAv);

      // 10) Botones de acciones: Editar y Eliminar
      const actionsDiv = document.createElement("div");
      actionsDiv.className = "actions";

      // Botón EDITAR
      const btnEdit = document.createElement("button");
      btnEdit.textContent = "Editar";
      btnEdit.className = "btn-edit";
      btnEdit.addEventListener("click", function () {
        enableEditing(cliente.id);
      });
      actionsDiv.appendChild(btnEdit);

      // Botón ELIMINAR
      const btnDelete = document.createElement("button");
      btnDelete.textContent = "Eliminar";
      btnDelete.className = "btn-delete";
      btnDelete.addEventListener("click", function () {
        deleteClient(cliente.id);
      });
      actionsDiv.appendChild(btnDelete);

      card.appendChild(actionsDiv);
      container.appendChild(card);
    });
  }

  // === ACTUALIZAR AVANCE EN LOCALSTORAGE ===
  function updateProgress(id, nuevoAvance) {
    const clientes = getClients();
    const idx = clientes.findIndex((c) => c.id === id);
    if (idx !== -1) {
      clientes[idx].avance = nuevoAvance;
      saveClients(clientes);
    }
  }

  // === ELIMINAR UN CLIENTE ===
  function deleteClient(id) {
    if (!confirm("¿Eliminar este cliente definitivamente?")) return;

    let clientes = getClients();
    clientes = clientes.filter((c) => c.id !== id);
    saveClients(clientes);
    renderClients();
  }

  // === EDICIÓN INLINE DE UNA TARJETA ===
  function enableEditing(id) {
    const clientes = getClients();
    const cliente = clientes.find((c) => c.id === id);
    if (!cliente) return;

    // Busco la tarjeta correspondiente
    const card = document.querySelector(`.client-card[data-id="${id}"]`);
    if (!card) return;

    // Limpio el contenido de la tarjeta
    card.innerHTML = "";

    // 1) Nombre (input)
    const labelNom = document.createElement("label");
    labelNom.textContent = "Nombre:";
    card.appendChild(labelNom);
    const inputNom = document.createElement("input");
    inputNom.type = "text";
    inputNom.className = "edit-input";
    inputNom.value = cliente.nombre;
    card.appendChild(inputNom);

    // 2) Apellido (input)
    const labelApe = document.createElement("label");
    labelApe.textContent = "Apellido:";
    card.appendChild(labelApe);
    const inputApe = document.createElement("input");
    inputApe.type = "text";
    inputApe.className = "edit-input";
    inputApe.value = cliente.apellido;
    card.appendChild(inputApe);

    // 3) Teléfono (input)
    const labelTel = document.createElement("label");
    labelTel.textContent = "Teléfono:";
    card.appendChild(labelTel);
    const inputTel = document.createElement("input");
    inputTel.type = "text";
    inputTel.className = "edit-input";
    inputTel.value = cliente.telefono;
    card.appendChild(inputTel);

    // 4) Mail (input)
    const labelMail = document.createElement("label");
    labelMail.textContent = "Mail:";
    card.appendChild(labelMail);
    const inputMail = document.createElement("input");
    inputMail.type = "email";
    inputMail.className = "edit-input";
    inputMail.value = cliente.mail;
    card.appendChild(inputMail);

    // 5) Empresa (input)
    const labelEmp = document.createElement("label");
    labelEmp.textContent = "Empresa:";
    card.appendChild(labelEmp);
    const inputEmp = document.createElement("input");
    inputEmp.type = "text";
    inputEmp.className = "edit-input";
    inputEmp.value = cliente.empresa;
    card.appendChild(inputEmp);

    // 6) Rubro (input)
    const labelRub = document.createElement("label");
    labelRub.textContent = "Rubro:";
    card.appendChild(labelRub);
    const inputRub = document.createElement("input");
    inputRub.type = "text";
    inputRub.className = "edit-input";
    inputRub.value = cliente.rubro;
    card.appendChild(inputRub);

    // 7) Página Web (input)
    const labelWeb = document.createElement("label");
    labelWeb.textContent = "Página Web:";
    card.appendChild(labelWeb);
    const inputWeb = document.createElement("input");
    inputWeb.type = "url";
    inputWeb.className = "edit-input";
    inputWeb.value = cliente.paginaWeb || "";
    card.appendChild(inputWeb);

    // 8) Instagram (input)
    const labelIg = document.createElement("label");
    labelIg.textContent = "Instagram:";
    card.appendChild(labelIg);
    const inputIg = document.createElement("input");
    inputIg.type = "url";
    inputIg.className = "edit-input";
    inputIg.value = cliente.ig || "";
    card.appendChild(inputIg);

    // 9) Mensaje (textarea)
    const labelMsg = document.createElement("label");
    labelMsg.textContent = "Mensaje:";
    card.appendChild(labelMsg);
    const inputMsg = document.createElement("textarea");
    inputMsg.className = "edit-input";
    inputMsg.value = cliente.mensaje;
    inputMsg.rows = 3;
    card.appendChild(inputMsg);

    // 10) Avance (select)
    const labelAv = document.createElement("label");
    labelAv.textContent = "Avance:";
    card.appendChild(labelAv);
    const selectAv = document.createElement("select");
    ["Inicio", "En Proceso", "Completado"].forEach((opcion) => {
      const opt = document.createElement("option");
      opt.value = opcion;
      opt.textContent = opcion;
      if (cliente.avance === opcion) opt.selected = true;
      selectAv.appendChild(opt);
    });
    selectAv.addEventListener("change", function () {
      cliente.avance = this.value; // actualizo en memoria
    });
    card.appendChild(selectAv);

    // 11) Botones “Guardar” y “Cancelar”
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "actions";

    // Botón GUARDAR
    const btnSave = document.createElement("button");
    btnSave.textContent = "Guardar";
    btnSave.className = "btn-save";
    btnSave.addEventListener("click", function () {
      // Tomo los valores nuevos
      const nuevoNombre = inputNom.value.trim();
      const nuevoApellido = inputApe.value.trim();
      const nuevoTel = inputTel.value.trim();
      const nuevoMail = inputMail.value.trim();
      const nuevaEmp = inputEmp.value.trim();
      const nuevoRub = inputRub.value.trim();
      const nuevaWeb = inputWeb.value.trim();
      const nuevoIg = inputIg.value.trim();
      const nuevoMsg = inputMsg.value.trim();
      const nuevoAv = selectAv.value;

      // Validación básica: todos los campos obligatorios menos los enlaces
      if (
        !nuevoNombre ||
        !nuevoApellido ||
        !nuevoTel ||
        !nuevoMail ||
        !nuevaEmp ||
        !nuevoRub ||
        !nuevoMsg
      ) {
        alert("Completa todos los campos obligatorios.");
        return;
      }

      // Actualizo el objeto en el array
      cliente.nombre = nuevoNombre;
      cliente.apellido = nuevoApellido;
      cliente.telefono = nuevoTel;
      cliente.mail = nuevoMail;
      cliente.empresa = nuevaEmp;
      cliente.rubro = nuevoRub;
      cliente.paginaWeb = nuevaWeb || null;
      cliente.ig = nuevoIg || null;
      cliente.mensaje = nuevoMsg;
      cliente.avance = nuevoAv;

      // Lo guardo en localStorage
      const idx = clientes.findIndex((c) => c.id === id);
      clientes[idx] = cliente;
      saveClients(clientes);

      // Refresco la vista
      renderClients();
    });
    actionsDiv.appendChild(btnSave);

    // Botón CANCELAR
    const btnCancel = document.createElement("button");
    btnCancel.textContent = "Cancelar";
    btnCancel.className = "btn-cancel";
    btnCancel.addEventListener("click", function () {
      renderClients(); // descarto cambios
    });
    actionsDiv.appendChild(btnCancel);

    card.appendChild(actionsDiv);
  }

  // Al cargar, no renderizo hasta que el login sea exitoso
});
