document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:8080/api/usuarios";
  const tableBody = document.getElementById("usuariosTableBody");
  const filterName = document.getElementById("filterName");
  const filterState = document.getElementById("filterState");

  // Función para cargar los usuarios
  async function cargarUsuarios() {
      try {
          const response = await fetch(API_URL);
          const data = await response.json();

          if (data.type === "SUCCESS" && Array.isArray(data.result)) {
              tableBody.innerHTML = ""; // Limpia la tabla
              const filteredData = aplicarFiltros(data.result); // Aplica filtros al cargar los usuarios
              filteredData.forEach(usuario => {
                  const row = `
                      <tr align="center" style="height: 20px; font-size: 15px">
                          <td>${usuario.nombre || "Sin Nombre"}</td>
                          <td>${usuario.email || "Sin Email"}</td>
                          <td>${usuario.telefono || "Sin Teléfono"}</td>
                          <td>${usuario.rol || "Sin Rol"}</td>
                          <td>
                              <button class="btn btn-sm ${usuario.status ? "btn-success" : "btn-danger"} cambiarEstado" 
                                  data-id="${usuario.id}">
                                  ${usuario.status ? "Activo" : "Inactivo"}
                              </button>
                          </td>
                          <td>
                              <button class="btn btn-sm btn-primary btnIcono" 
                                  data-id="${usuario.id}" 
                                  data-nombre="${usuario.nombre || ""}" 
                                  data-apellidos="${usuario.apellidos || ""}" 
                                  data-email="${usuario.email || ""}" 
                                  data-telefono="${usuario.telefono || ""}" 
                                  data-rol="${usuario.rol || ""}">
                                  <i class="fas fa-edit"></i>
                              </button>
                          </td>
                      </tr>
                  `;
                  tableBody.innerHTML += row;
              });
              agregarEventos();
          } else {
              console.error("Estructura de datos inesperada:", data);
          }
      } catch (error) {
          console.error("Error al cargar los usuarios:", error);
      }
  }

  // Función para aplicar los filtros
  function aplicarFiltros(usuarios) {
      let filteredUsers = usuarios;

      // Filtrar por nombre
      const nameFilter = filterName.value.trim().toLowerCase();
      if (nameFilter) {
          filteredUsers = filteredUsers.filter(usuario => 
              usuario.nombre.toLowerCase().includes(nameFilter)
          );
      }

      // Filtrar por estado
      const stateFilter = filterState.value;
      if (stateFilter) {
          filteredUsers = filteredUsers.filter(usuario => 
              (stateFilter === "Activo" && usuario.status) || 
              (stateFilter === "NoActivo" && !usuario.status)
          );
      }

      return filteredUsers;
  }

  // Función para manejar el registro de usuario
  const formRegistrarUsuario = document.querySelector("#formRegistrarUsuario");
  formRegistrarUsuario.addEventListener("submit", async (event) => {
      event.preventDefault();

      const usuarioData = {
          nombre: document.getElementById("nombre").value.trim(),
          apellidos: document.getElementById("apellidos").value.trim(),
          email: document.getElementById("email").value.trim(),
          telefono: document.getElementById("telefono").value.trim(),
          contraseña: document.getElementById("contrasena").value.trim(),
          rol: document.getElementById("rol").value.trim(),
          status: true,
      };

      if (Object.values(usuarioData).some(value => !value)) {
          alert("Por favor, complete todos los campos.");
          return;
      }

      try {
          const response = await fetch(`${API_URL}/save`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(usuarioData),
          });

          if (response.ok) {
              $('#registrarUsuario').modal("hide"); // Asegúrate de cerrar solo una vez
              cargarUsuarios();
          } else {
              console.error("Error al registrar usuario:", await response.text());
          }
      } catch (error) {
          console.error("Error en la solicitud:", error);
      }
  });

  // Modificar estado del usuario
  tableBody.addEventListener("click", async (event) => {
      if (event.target.classList.contains("cambiarEstado")) {
          const button = event.target;
          const id = button.dataset.id;

          try {
              // Enviamos la solicitud DELETE para cambiar el estado del usuario
              const response = await fetch(`${API_URL}/${id}`, {
                  method: "DELETE",
              });

              if (response.ok) {
                  cargarUsuarios(); // Recargamos la lista de usuarios
              } else {
                  console.error("Error al cambiar estado:", await response.text());
              }
          } catch (error) {
              console.error("Error en la solicitud:", error);
          }
      }
  });

  // Modificar usuario
  const formModificarUsuario = document.querySelector("#formModificarUsuario");
  formModificarUsuario.addEventListener("submit", async (event) => {
      event.preventDefault();

      const id = document.getElementById("idUsuario").value;
      const usuarioData = {
          nombre: document.getElementById("nombreMod").value.trim(),
          apellidos: document.getElementById("apellidosMod").value.trim(),
          email: document.getElementById("emailMod").value.trim(),
          telefono: document.getElementById("telefonoMod").value.trim(),
          contraseña: document.getElementById("contrasenaMod").value.trim(),
          rol: document.getElementById("rolMod").value.trim(),
      };

      try {
          const response = await fetch(`${API_URL}/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(usuarioData),
          });

          if (response.ok) {
              $('#modificarUsuario').modal("hide");
              cargarUsuarios();
          } else {
              console.error("Error al modificar usuario:", await response.text());
          }
      } catch (error) {
          console.error("Error en la solicitud:", error);
      }
  });

  // Agregar eventos a botones de edición
  function agregarEventos() {
      document.querySelectorAll(".btnIcono").forEach(button => {
          button.addEventListener("click", () => {
              document.getElementById("idUsuario").value = button.dataset.id;
              document.getElementById("nombreMod").value = button.dataset.nombre;
              document.getElementById("apellidosMod").value = button.dataset.apellidos;
              document.getElementById("emailMod").value = button.dataset.email;
              document.getElementById("telefonoMod").value = button.dataset.telefono;
              document.getElementById("rolMod").value = button.dataset.rol;
              $('#modificarUsuario').modal("show");
          });
      });
  }

  // Eventos de filtros
  filterName.addEventListener("input", cargarUsuarios);
  filterState.addEventListener("change", cargarUsuarios);

  // Carga inicial de usuarios
  cargarUsuarios();
});
