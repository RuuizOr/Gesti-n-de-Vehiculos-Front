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
