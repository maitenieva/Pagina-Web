   let editIndex = null;
    const objetivos = JSON.parse(localStorage.getItem('objetivos')) || [];
    const objetivosContainer = document.getElementById('objetivos');
    const form = document.getElementById('formulario');
    const tituloInput = document.getElementById('titulo');
    const descripcionInput = document.getElementById('descripcion');
    const fechaInput = document.getElementById('fecha');

    function guardarObjetivos() {
      localStorage.setItem('objetivos', JSON.stringify(objetivos));
    }

    function calcularEstado(fechaStr) {
      const hoy = new Date();
      const fecha = new Date(fechaStr);
      const diferencia = Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24));

      if (diferencia < 0) return { texto: `⛔ Venció hace ${Math.abs(diferencia)} día(s)`, color: 'red' };
      if (diferencia === 0) return { texto: '⚠️ Vence hoy', color: 'goldenrod' };
      if (diferencia <= 3) return { texto: `⏳ Vence en ${diferencia} día(s)`, color: 'orange' };
      return { texto: `📅 Vence en ${diferencia} día(s)`, color: 'green' };
    }

    function renderObjetivos() {
      objetivosContainer.innerHTML = '';
      objetivos.forEach((obj, index) => {
        const estado = calcularEstado(obj.fecha);
        const card = document.createElement('div');
        card.className = 'objetivo';
        card.style.borderLeft = `5px solid ${estado.color}`;
        card.innerHTML = `
          <h3>${obj.titulo}</h3>
          <p>${obj.descripcion}</p>
          <p style="color: ${estado.color}; font-weight: bold">${estado.texto}</p>
          <div class="botones">
            <button class="eliminar" onclick="eliminarObjetivo(${index})">Eliminar</button>
            <button class="editar" onclick="editarObjetivo(${index})">Editar</button>
          </div>
        `;
        objetivosContainer.appendChild(card);
      });
    }

    function eliminarObjetivo(index) {
      objetivos.splice(index, 1);
      guardarObjetivos();
      renderObjetivos();
    }

    function editarObjetivo(index) {
      const obj = objetivos[index];
      tituloInput.value = obj.titulo;
      descripcionInput.value = obj.descripcion;
      fechaInput.value = obj.fecha;
      editIndex = index;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const titulo = tituloInput.value.trim();
      const descripcion = descripcionInput.value.trim();
      const fecha = fechaInput.value;
      if (!titulo || !descripcion || !fecha) return;

      if (editIndex !== null) {
        objetivos[editIndex] = { titulo, descripcion, fecha };
        editIndex = null;
      } else {
        objetivos.push({ titulo, descripcion, fecha });
      }
      guardarObjetivos();
      renderObjetivos();
      tituloInput.value = '';
      descripcionInput.value = '';
      fechaInput.value = '';
    });

    renderObjetivos();