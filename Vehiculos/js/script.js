document.addEventListener('DOMContentLoaded', function () {
    const API_URL = "http://localhost:8080/vehiculos";
    const tableBody = document.getElementById('vehiculosTableBody');

    // Cargar vehículos en la tabla
    async function cargarVehiculos() {
        try {
            const response = await fetch(`${API_URL}/activos`);
            if (!response.ok) throw new Error('Error al cargar los vehículos');

            const data = await response.json();
            tableBody.innerHTML = ''; // Limpiar la tabla

            data.forEach(vehiculo => {
                const row = `
                    <tr align="center">
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
                    </tr>`;
                tableBody.innerHTML += row;
            });
            agregarEventos();
        } catch (error) {
            console.error('Error al cargar los vehículos:', error);
        }
    }

    // Filtrar por nombre
  filterName.addEventListener("input", () => {
    const searchTerm = filterName.value.trim().toLowerCase();
    const rows = tableBody.querySelectorAll("tr");
    rows.forEach((row) => {
      const nombre = row.children[0].textContent.trim().toLowerCase();
      if (nombre.includes(searchTerm)) {
        row.style.display = ""; // Mostrar
      } else {
        row.style.display = "none"; // Ocultar
      }
    });
  });


    // Agregar nuevo vehículo
    const formRegistrar = document.getElementById("formRegistrarVehiculo");
    formRegistrar.addEventListener("submit", async function (event) {
        event.preventDefault();

        const modelo = document.getElementById("modelo").value.trim();
        const marca = document.getElementById("marca").value.trim();
        const color = document.getElementById("color").value.trim();

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

    // Editar un vehículo existente
    const formModificarVehiculo = document.getElementById("formModificarVehiculo");
    formModificarVehiculo.addEventListener("submit", async function (event) {
        event.preventDefault();

        const id = document.getElementById("idMod").value;
        const modelo = document.getElementById("modeloMod").value.trim();
        const marca = document.getElementById("marcaMod").value.trim();
        const color = document.getElementById("colorMod").value.trim();

        if (id && modelo && marca && color) {
            try {
                const response = await fetch(`${API_URL}/actualizar`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id, modelo, marca, color, status: true }),
                });

                if (response.ok) {
                    formModificarVehiculo.reset();
                    $('#modificarVehiculo').modal('hide'); // Cierra el modal después de la edición
                    cargarVehiculos(); // Recarga la tabla
                } else {
                    console.error("Error al modificar el vehículo. Verifique los datos.");
                }
            } catch (error) {
                console.error("Error en la solicitud:", error);
            }
        } else {
            console.error("Por favor, complete todos los campos.");
        }
    });

    // Cambiar estado de un vehículo
    document.getElementById("formModificarEstado").addEventListener("submit", async function (event) {
        event.preventDefault();

        const id = document.getElementById("idServicio").value;
        const status = document.getElementById("estadoServicio").value === "true";

        try {
            const response = await fetch(`${API_URL}/cambiar-estado/${id}?status=${!status}`, {
                method: "PUT",
            });

            if (response.ok) {
                $("#modificarEstadoServicio").modal("hide");
                cargarVehiculos();
            } else {
                console.error("Error al actualizar el estado del vehículo.");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    });

    // Agregar eventos a botones
    function agregarEventos() {
        // Eventos de cambiar estado
        document.querySelectorAll('.cambiarEstado').forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.dataset.id;
                const status = this.dataset.status === "true";
                document.getElementById('idServicio').value = id;
                document.getElementById('estadoServicio').value = status;
                $('#modificarEstadoServicio').modal('show');
            });
        });

        // Eventos de modificar vehículo
        document.querySelectorAll('.btnIcono').forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.dataset.id;
                const modelo = this.dataset.modelo;
                const marca = this.dataset.marca;
                const color = this.dataset.color;

                document.getElementById('idMod').value = id;
                document.getElementById('modeloMod').value = modelo;
                document.getElementById('marcaMod').value = marca;
                document.getElementById('colorMod').value = color;
            });
        });
    }

    // Inicialización: cargar vehículos
    cargarVehiculos();
});
