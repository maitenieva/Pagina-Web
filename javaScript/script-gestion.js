document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("ingresar").addEventListener("click", function () {
    const clave = document.getElementById("contraseña").value;
    const accesoCorrecto = "matematica";

    const success = document.getElementById("success-msg");
    const error = document.getElementById("error-msg");

    if (clave === accesoCorrecto) {
      success.classList.remove("d-none");
      error.classList.add("d-none");

      // avanzar al CRUD o mostrar contenido:
      setTimeout(() => {
        document.getElementById("login").style.display = "none";
        document.getElementById("crud-section").style.display = "block";
        mostrarClientes();
      }, 1000);
    } else {
      success.classList.add("d-none");
      error.classList.remove("d-none");
    }
  });

  function mostrarClientes() {
    const clients = JSON.parse(localStorage.getItem("clientes")) || [];
    const list = document.getElementById("client-list");
    list.innerHTML = "";

    clients.forEach((client) => {
      const item = document.createElement("li");
      item.innerHTML = `<strong>${client.nombre} ${client.apellido}</strong> (${client.mail}) - ${client.avance}`;
      list.appendChild(item);
    });
  }
});
