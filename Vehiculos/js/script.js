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
    if (formModificarEstado) {
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
    }

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
                document.getElementById('idDocente2').value = id;
                document.getElementById('estadoDocente').value = statusActual ? 'true' : 'false';
                $('#modificarEstadoVehiculo').modal('show');
            });
        });
    }

    // Llamada para cargar los vehículos automáticamente cuando se carga la página
    cargarVehiculos();
});
