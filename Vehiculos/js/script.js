document.addEventListener('DOMContentLoaded', function () {
    // Modals
    $('#exampleModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var recipient = button.data('whatever');
        var modal = $(this);
        modal.find('.modal-title').text('New message to ' + recipient);
        modal.find('.modal-body input').val(recipient);
    });

    // URL base para la API de vehículos
    const API_URL = "http://localhost:8080/vehiculos";
    const tableBody = document.getElementById('vehiculosTableBody');

    // Cargar vehículos en la tabla
    async function cargarVehiculos() {
        try {
            const response = await fetch(API_URL + '/activos');
            console.log('Respuesta de la API:', response);
            if (!response.ok) {
                throw new Error('Error al cargar los vehículos');
            }
            const data = await response.json();
            console.log('Datos recibidos:', data);
    
            if (Array.isArray(data)) {
                tableBody.innerHTML = ''; // Limpiar tabla antes de añadir nuevos datos
                data.forEach(vehiculo => {
                    const row = `
                        <tr align="center" style="height: 20px; font-size: 15px">
                            <td>${vehiculo.modelo}</td>
                            <td>${vehiculo.marca}</td>
                            <td>${vehiculo.color}</td>
                            <td>
                                <button class="btn btn-sm ${vehiculo.status ? 'btn-success' : 'btn-danger'} cambiarEstado" 
                                        data-id="${vehiculo.id}" 
                                        data-status="${vehiculo.status}">
                                    ${vehiculo.status ? 'Activo' : 'Inactivo'}
                                </button>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-primary btnIcono" 
                                        data-id="${vehiculo.id}" 
                                        data-modelo="${vehiculo.modelo}" 
                                        data-marca="${vehiculo.marca}" 
                                        data-color="${vehiculo.color}"
                                        data-toggle="modal" 
                                        data-target="#modificarVehiculo">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                    tableBody.innerHTML += row;
                });
                agregarEventos();
            } else {
                console.error('Error: los datos no son una lista.');
            }
        } catch (error) {
            console.error('Error al cargar los vehículos:', error);
        }
    }
    

    // Registrar nuevo vehículo
    const formRegistrar = document.querySelector("#formRegistrarVehiculo");
    formRegistrar.addEventListener("submit", async (event) => {
        event.preventDefault();
        const modelo = document.querySelector("#modelo").value.trim();
        const marca = document.querySelector("#marca").value.trim();
        const color = document.querySelector("#color").value.trim();

        if (modelo && marca && color) {
            try {
                const response = await fetch(`${API_URL}/registrar`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ modelo, marca, color, status: true }),
                });

                if (response.ok) {
                    formRegistrar.reset();
                    $('#registrarVehiculo').modal('hide'); // Cierra el modal después del registro
                    cargarVehiculos(); // Recarga la tabla
                } else {
                    console.error("Error al registrar el vehículo. Verifique los datos.");
                }
            } catch (error) {
                console.error("Error en la solicitud:", error);
            }
        } else {
            console.error("Por favor, complete todos los campos.");
        }
    });

    // Modificar estado del vehículo
    const formModificarEstado = document.getElementById('formModificarEstado');
    formModificarEstado.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = document.getElementById('idDocente2').value;
        const nuevoEstado = document.getElementById('estadoDocente').value === 'true' ? false : true;

        try {
            const response = await fetch(`${API_URL}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: nuevoEstado }),
            });

            if (response.ok) {
                const result = await response.json();
                $('#modificarEstadoVehiculo').modal('hide');
                cargarVehiculos(); // Recargar la tabla después de cambiar el estado
            } else {
                console.error("Error al cambiar el estado.");
            }
        } catch (error) {
            console.error("Error al cambiar el estado:", error);
            console.error("Hubo un problema al conectar con el servidor.");
        }
    });

    // Modificar vehículo
    const formModificarVehiculo = document.getElementById('formModificarVehiculo');
    formModificarVehiculo.addEventListener('submit', function (e) {
        e.preventDefault();
        const id = document.getElementById('idMod').value;
        const modelo = document.getElementById('modeloMod').value;
        const marca = document.getElementById('marcaMod').value;
        const color = document.getElementById('colorMod').value;

        fetch(`${API_URL}/actualizar`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, modelo, marca, color, status: true })
        })
        .then(response => response.json())
        .then(() => {
            formModificarVehiculo.reset();
            $('#modificarVehiculo').modal('hide');
            cargarVehiculos(); // Recargar la tabla después de modificar el vehículo
        })
        .catch(error => console.error("Error al modificar el vehículo:", error));
    });

    // Agregar eventos a los botones de modificar y cambiar estado
    function agregarEventos() {
        // Eventos de modificar
        const btnsModificar = document.querySelectorAll('.btnIcono');
        btnsModificar.forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                const modelo = this.getAttribute('data-modelo');
                const marca = this.getAttribute('data-marca');
                const color = this.getAttribute('data-color');
                document.getElementById('idMod').value = id;
                document.getElementById('modeloMod').value = modelo;
                document.getElementById('marcaMod').value = marca;
                document.getElementById('colorMod').value = color;
            });
        });

        // Eventos de cambio de estado
        const btnsEstado = document.querySelectorAll('.cambiarEstado');
        btnsEstado.forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                const statusActual = this.getAttribute('data-status') === 'true';
                document.getElementById('idVehiculoEstado').value = id;
                document.getElementById('estadoVehiculo').value = statusActual ? 'true' : 'false';
                $('#modificarEstadoVehiculo').modal('show');
            });
        });
    }

    // Llamada para cargar los vehículos automáticamente cuando se carga la página
    cargarVehiculos();
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
});})
