document.addEventListener("DOMContentLoaded", function () {
    // === INYECTAR ESTILOS PARA LA EDICIÓN EN LÍNEA ===
    const estilosCSS = `
        .client-card .vista-edicion, .client-card .btn-save, .client-card .btn-cancel { display: none; }
        .client-card.is-editing .vista-lectura, .client-card.is-editing .btn-edit, .client-card.is-editing .btn-delete { display: none; }
        .client-card.is-editing .vista-edicion, .client-card.is-editing .btn-save, .client-card.is-editing .btn-cancel { display: block; }
        .client-card .edit-input { width: 100%; padding: 5px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px; }
    `;
    const tagEstilo = document.createElement("style");
    tagEstilo.textContent = estilosCSS;
    document.head.appendChild(tagEstilo);

    // === SELECTORES DE ELEMENTOS DEL DOM ===
    const botonIngresar = document.getElementById("ingresar");
    const campoContrasenia = document.getElementById("contrasenia");
    const contenedorLogin = document.getElementById("login-container");
    const seccionCRUD = document.getElementById("crud-section");
    // ***** CORRECCIÓN FUNDAMENTAL AQUÍ *****
    const contenedorClientes = document.getElementById("clientesContainer"); // Ahora usa el ID correcto
    const mensajeSinClientes = document.getElementById("noClientsMsg");

    const claveCorrecta = "Matematica";

    // === LÓGICA DE LOGIN ===
    botonIngresar.addEventListener("click", function () {
        if (!contenedorClientes) {
            console.error("¡ERROR GRAVE! No se encontró el elemento con id 'clientesContainer'. Revisa tu HTML.");
            return;
        }
        console.log("Se hizo clic en Ingresar.");
        const claveIngresada = campoContrasenia.value.trim();
        if (claveIngresada === claveCorrecta) {
            document.getElementById("success-msg").classList.remove("d-none");
            setTimeout(() => {
                contenedorLogin.style.display = "none";
                seccionCRUD.style.display = "block";
                console.log("Login correcto. Llamando a renderizarClientes...");
                renderizarClientes();
            }, 1000);
        } else {
            console.log("Login incorrecto.");
            document.getElementById("error-msg").classList.remove("d-none");
        }
    });

    // === FUNCIONES DE LOCALSTORAGE ===
    function obtenerClientes() {
        const datosGuardados = localStorage.getItem("clientes");
        console.log("Datos leídos de localStorage:", datosGuardados); // MENSAJE DE DIAGNÓSTICO
        return datosGuardados ? JSON.parse(datosGuardados) : [];
    }
    function guardarClientes(listaClientes) {
        localStorage.setItem("clientes", JSON.stringify(listaClientes));
        console.log("Datos guardados en localStorage."); // MENSAJE DE DIAGNÓSTICO
    }

    // === RENDERIZADO DE TARJETAS ===
    function renderizarClientes() {
        contenedorClientes.innerHTML = "";
        const listaDeClientes = obtenerClientes();
        
        if (listaDeClientes.length === 0) {
            console.log("No se encontraron clientes para mostrar.");
            mensajeSinClientes.style.display = "block";
        } else {
            console.log(`Se encontraron ${listaDeClientes.length} clientes. Dibujando tarjetas...`);
            mensajeSinClientes.style.display = "none";
        }

        listaDeClientes.forEach((cliente) => {
            console.log("Renderizando cliente:", cliente); // MENSAJE DE DIAGNÓSTICO
            const tarjeta = document.createElement("div");
            tarjeta.className = "client-card";
            tarjeta.setAttribute("data-id", cliente.id);

            tarjeta.innerHTML = `
                <div class="vista-lectura">
                    <h2>${cliente.nombre || ''} ${cliente.apellido || ''}</h2>
                    <p><strong>Teléfono:</strong> ${cliente.telefono || 'N/A'}</p>
                    <p><strong>Mail:</strong> ${cliente.mail || 'N/A'}</p>
                    <p><strong>Empresa:</strong> ${cliente.empresa || 'N/A'}</p>
                    <p><strong>Rubro:</strong> ${cliente.rubro || 'N/A'}</p>
                    <p><strong>Página Web:</strong> ${cliente.paginaWeb || 'No'}</p>
                    <p><strong>Instagram:</strong> ${cliente.ig || 'No'}</p>
                    <p><strong>Mensaje:</strong> ${cliente.mensaje || ''}</p>
                </div>
                <div class="vista-edicion">
                    <label>Nombre:</label><input type="text" class="edit-input edit-nombre" value="${cliente.nombre || ''}">
                    <label>Apellido:</label><input type="text" class="edit-input edit-apellido" value="${cliente.apellido || ''}">
                    <label>Teléfono:</label><input type="text" class="edit-input edit-telefono" value="${cliente.telefono || ''}">
                    <label>Mail:</label><input type="email" class="edit-input edit-mail" value="${cliente.mail || ''}">
                    <label>Empresa:</label><input type="text" class="edit-input edit-empresa" value="${cliente.empresa || ''}">
                    <label>Rubro:</label><input type="text" class="edit-input edit-rubro" value="${cliente.rubro || ''}">
                    <label>Página Web:</label><input type="url" class="edit-input edit-paginaWeb" value="${cliente.paginaWeb || ''}">
                    <label>Instagram:</label><input type="url" class="edit-input edit-ig" value="${cliente.ig || ''}">
                    <label>Mensaje:</label><textarea class="edit-input edit-mensaje">${cliente.mensaje || ''}</textarea>
                </div>
                <label>Avance:</label>
                <select class="select-avance" data-id="${cliente.id}">
                    <option value="Inicio" ${cliente.avance === 'Inicio' ? 'selected' : ''}>Inicio</option>
                    <option value="En Proceso" ${cliente.avance === 'En Proceso' ? 'selected' : ''}>En Proceso</option>
                    <option value="Completado" ${cliente.avance === 'Completado' ? 'selected' : ''}>Completado</option>
                </select>
                <div class="actions">
                    <button class="btn-edit">Editar</button><button class="btn-delete">Eliminar</button>
                    <button class="btn-save">Guardar</button><button class="btn-cancel">Cancelar</button>
                </div>
            `;
            contenedorClientes.appendChild(tarjeta);
        });
    }

    // === MANEJO DE EVENTOS (Sin cambios, ya era robusto) ===
    contenedorClientes.addEventListener('click', function (evento) {
        const tarjeta = evento.target.closest('.client-card');
        if (!tarjeta) return;
        const idCliente = tarjeta.dataset.id;
        if (evento.target.classList.contains('btn-edit')) tarjeta.classList.add('is-editing');
        if (evento.target.classList.contains('btn-cancel')) tarjeta.classList.remove('is-editing');
        if (evento.target.classList.contains('btn-delete')) {
            if (confirm("¿Eliminar este cliente definitivamente?")) {
                guardarClientes(obtenerClientes().filter(c => c.id != idCliente));
                renderizarClientes();
            }
        }
        if (evento.target.classList.contains('btn-save')) {
            let clientes = obtenerClientes();
            const clienteIndex = clientes.findIndex(c => c.id == idCliente);
            if (clienteIndex !== -1) {
                clientes[clienteIndex].nombre = tarjeta.querySelector('.edit-nombre').value;
                clientes[clienteIndex].apellido = tarjeta.querySelector('.edit-apellido').value;
                clientes[clienteIndex].telefono = tarjeta.querySelector('.edit-telefono').value;
                clientes[clienteIndex].mail = tarjeta.querySelector('.edit-mail').value;
                clientes[clienteIndex].empresa = tarjeta.querySelector('.edit-empresa').value;
                clientes[clienteIndex].rubro = tarjeta.querySelector('.edit-rubro').value;
                clientes[clienteIndex].paginaWeb = tarjeta.querySelector('.edit-paginaWeb').value;
                clientes[clienteIndex].ig = tarjeta.querySelector('.edit-ig').value;
                clientes[clienteIndex].mensaje = tarjeta.querySelector('.edit-mensaje').value;
                guardarClientes(clientes);
                renderizarClientes();
            }
        }
    });
    contenedorClientes.addEventListener('change', function (evento) {
        if (evento.target.classList.contains('select-avance')) {
            const idCliente = evento.target.dataset.id;
            const nuevoAvance = evento.target.value;
            let clientes = obtenerClientes();
            const clienteIndex = clientes.findIndex(c => c.id == idCliente);
            if (clienteIndex !== -1) {
                clientes[clienteIndex].avance = nuevoAvance;
                guardarClientes(clientes);
            }
        }
    });
});