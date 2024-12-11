document.addEventListener('DOMContentLoaded', function () {
    const API_URL_VEHICULOS = "http://localhost:8080/vehiculos";
    const token = localStorage.getItem('jwt');

    if (!token) {
        mostrarAlerta('error', 'No se encontró el token. Por favor, inicie sesión.');
        return;
    }

    // Función para mostrar una alerta personalizada
    function mostrarAlerta(tipo, mensaje) {
        const alertaExistente = document.querySelector('.alerta');
        if (alertaExistente) {
            alertaExistente.classList.remove('mostrar');
            alertaExistente.classList.add('ocultar');
            // Esperamos que la animación de desaparición termine antes de eliminarla
            setTimeout(() => alertaExistente.remove(), 500);
        }

        const alerta = document.createElement('div');
        alerta.classList.add('alerta', 'mostrar');

        const icono = tipo === 'success' ? '&#x1f698;' : '&#x1f698;'; // Icono de vehículo
        alerta.innerHTML = `${icono}<span class="texto">${mensaje}</span><button class="btn-cerrar"><i class="fa fa-times"></i></button>`;
        
        document.body.appendChild(alerta);

        const btnCerrar = alerta.querySelector('.btn-cerrar');
        btnCerrar.addEventListener('click', () => {
            alerta.classList.remove('mostrar');
            alerta.classList.add('ocultar');
            setTimeout(() => alerta.remove(), 500);
        });

        setTimeout(() => {
            alerta.classList.remove('mostrar');
            alerta.classList.add('ocultar');
            setTimeout(() => alerta.remove(), 500);
        }, 3000);
    }


    // Cargar vehículos en la tabla
    async function cargarVehiculos() {
        try {
            const response = await fetch(`${API_URL_VEHICULOS}/activos`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

                if (!response.ok) throw new Error('Error al cargar los vehículos');

            const data = await response.json();
            const tableBody = document.getElementById('vehiculosTableBody');
            tableBody.innerHTML = '';

            if (data.length === 0) {
                mostrarAlerta('info', 'No se encontraron vehículos activos.');
                return;
            }

            data.forEach(vehiculo => {
                const row = `
                    <tr align="center">
                        <td>${vehiculo.modelo}</td>
                        <td>${vehiculo.marca}</td>
                        <td>${vehiculo.color}</td>
                        <td>
                            <button class="btn btn-sm ${vehiculo.status ? 'btn-success' : 'btn-danger'} cambiarEstado" 
                                    data-id="${vehiculo.id}" data-status="${vehiculo.status}">
                                ${vehiculo.status ? 'Activo' : 'Inactivo'}
                            </button>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-primary btnIcono" 
                                    data-id="${vehiculo.id}" data-modelo="${vehiculo.modelo}" 
                                    data-marca="${vehiculo.marca}" data-color="${vehiculo.color}">
                                <i class="fas fa-edit"></i>
                            </button>
                        </td>
                    </tr>`;
                tableBody.innerHTML += row;
            });

            agregarEventos();
        } catch (error) {
            console.error(error);
        }
    }

    // Registrar un vehículo
    document.getElementById('formRegistrarVehiculo').addEventListener('submit', async (event) => {
        event.preventDefault();

        const modelo = document.getElementById('modelo').value.trim();
        const marca = document.getElementById('marca').value.trim();
        const color = document.getElementById('color').value.trim();

        if (!modelo || !marca || !color) {
            mostrarAlerta('error', 'Por favor, complete todos los campos del formulario.');
            return;
        }

        try {
            const response = await fetch(`${API_URL_VEHICULOS}/registrar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ modelo, marca, color, status: true })
            });

            if (response.ok) {
                mostrarAlerta('success', 'Vehículo registrado exitosamente');
                cargarVehiculos();
                const modal = document.getElementById('registrarVehiculo');
                    modal.classList.remove('show');
                    modal.style.display = 'none';
                    const backdrop = document.querySelector('.modal-backdrop');
                    if (backdrop) {
                        backdrop.remove();
                    }
            } else {
                mostrarAlerta('error', 'Error al registrar el vehículo.');
            }
        } catch (error) {
            mostrarAlerta('error', 'Hubo un error al intentar registrar el vehículo.');
            console.error(error);
        }
    });

    // Evitar que los modales se solapen
    $('#registrarVehiculo, #modificarVehiculo').on('show.bs.modal', function () {
        $('.modal').not(this).modal('hide'); // Ocultar cualquier otro modal abierto
    });

    // Editar un vehículo
    document.body.addEventListener('click', function (event) {
        if (event.target.closest('.btnIcono')) {
            const btn = event.target.closest('.btnIcono');
            const id = btn.getAttribute('data-id');
            const modelo = btn.getAttribute('data-modelo');
            const marca = btn.getAttribute('data-marca');
            const color = btn.getAttribute('data-color');

            document.getElementById('idMod').value = id;
            document.getElementById('modeloMod').value = modelo;
            document.getElementById('marcaMod').value = marca;
            document.getElementById('colorMod').value = color;

            $('#modificarVehiculo').modal('show');
        }
    });

    // Guardar cambios al editar vehículo
    document.getElementById('formModificarVehiculo').addEventListener('submit', async (event) => {
        event.preventDefault();
    
        const id = document.getElementById('idMod').value;
        const modelo = document.getElementById('modeloMod').value.trim();
        const marca = document.getElementById('marcaMod').value.trim();
        const color = document.getElementById('colorMod').value.trim();
        const status = document.querySelector(`.btnIcono[data-id="${id}"]`).closest('tr').querySelector('.cambiarEstado').getAttribute('data-status') === 'true';
    
        if (!id || !modelo || !marca || !color) {
            mostrarAlerta('error', 'Todos los campos son obligatorios.');
            return;
        }
    
        try {
            const response = await fetch(`${API_URL_VEHICULOS}/actualizar`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, modelo, marca, color, status }) // Incluye el estado actual
            });
    
            if (response.ok) {
                mostrarAlerta('success', 'Vehículo actualizado exitosamente.');
                cargarVehiculos();
                const modal = document.getElementById('modificarVehiculo');
                    modal.classList.remove('show');
                    modal.style.display = 'none';
                    const backdrop = document.querySelector('.modal-backdrop');
                    if (backdrop) {
                        backdrop.remove();
                    }
            } else {
                mostrarAlerta('error', 'Error al actualizar el vehículo.');
            }
        } catch (error) {
            mostrarAlerta('error', 'Hubo un error al intentar actualizar el vehículo.');
            console.error(error);
        }
    });
    

    // Cambiar estado del vehículo
    document.body.addEventListener('click', function (event) {
        if (event.target.closest('.cambiarEstado')) {
            const btn = event.target.closest('.cambiarEstado');
            const id = btn.getAttribute('data-id');
            const nuevoEstado = btn.getAttribute('data-status') === 'true' ? false : true;
    
            // Mostrar el modal de confirmación
            document.getElementById('idServicio').value = id;
            document.getElementById('estadoServicio').value = nuevoEstado;
            $('#modificarEstadoServicio').modal('show');
        }
    });
    
    // Manejar la confirmación del cambio de estado
    document.getElementById('formModificarEstado').addEventListener('submit', async function (event) {
        event.preventDefault();
    
        const id = document.getElementById('idServicio').value;
        const nuevoEstado = document.getElementById('estadoServicio').value === 'true';
    
        try {
            const response = await fetch(`${API_URL_VEHICULOS}/cambiar-estado/${id}?status=${nuevoEstado}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
    
            if (response.ok) {
                mostrarAlerta('success', 'Estado del vehículo cambiado exitosamente.');
                cargarVehiculos();
                const modal = document.getElementById('modificarEstadoServicio');
                    modal.classList.remove('show');
                    modal.style.display = 'none';
                    const backdrop = document.querySelector('.modal-backdrop');
                    if (backdrop) {
                        backdrop.remove();
                    }
            } else {
                mostrarAlerta('error', 'Error al cambiar el estado del vehículo.');
            }
        } catch (error) {
            mostrarAlerta('error', 'Hubo un error al intentar cambiar el estado.');
            console.error(error);
        }
    });


    // Función para filtrar los usuarios
function filtrarUsuarios() {
    const nombre = document.getElementById('filterName').value.toLowerCase();
    const estado = document.getElementById('filterState').value;

    // Obtener todas las filas de la tabla
    const filas = document.querySelectorAll('#vehiculosTableBody tr');

    // Iterar sobre todas las filas
    filas.forEach(fila => {
        const nombreUsuario = fila.cells[0].textContent.toLowerCase();
        // Obtener el estado desde el botón dentro de la fila
        const estadoBoton = fila.querySelector('button').getAttribute('data-status'); // Obtener el estado del botón

        // Comprobar si la fila cumple con los filtros
        const coincideNombre = nombreUsuario.includes(nombre);

        let coincideEstado = true; // Si no se selecciona estado, coincide siempre
        if (estado) {
            // Compara si el estado seleccionado corresponde con el estado del usuario
            coincideEstado = (estado === 'Activo' && estadoBoton === 'true') ||
                 (estado === 'NoActivo' && estadoBoton === 'false');

        }

        // Mostrar u ocultar la fila según los filtros
        if (coincideNombre && coincideEstado) {
            fila.style.display = ''; // Mostrar la fila
        } else {
            fila.style.display = 'none'; // Ocultar la fila
        }
    });
}

// Agregar eventos a los filtros
document.getElementById('filterName').addEventListener('input', filtrarUsuarios);
document.getElementById('filterState').addEventListener('change', filtrarUsuarios);
    

    cargarVehiculos();
});