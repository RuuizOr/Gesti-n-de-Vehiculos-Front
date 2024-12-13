document.addEventListener('DOMContentLoaded', function () {
    const API_URL_VEHICULOS = "http://localhost:8080/vehiculos";
    const API_URL_SERVICIOS = "http://localhost:8080/servicios"; // URL base para los servicios

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



    // Función para cargar los servicios activos en el <select>
    async function cargarServicios() {
        try {
            const response = await fetch(`${API_URL_SERVICIOS}/activos`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
    
            if (!response.ok) throw new Error('Error al cargar los servicios');
    
            const data = await response.json(); // Deserializa el JSON
            const servicios = data.result; // Accede al array de servicios
            const selectServicios = document.getElementById('serviciove');
    
            // Limpia las opciones anteriores
            selectServicios.innerHTML = '<option value="">Seleccione un servicio</option>';
    
            // Agrega las nuevas opciones
            servicios.forEach(servicio => {
                const option = document.createElement('option');
                option.value = servicio.id; // ID del servicio
                option.textContent = servicio.nombre; // Nombre del servicio
                selectServicios.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar los servicios:', error);
            mostrarAlerta('error', 'Hubo un error al cargar los servicios.');
        }
    }
    
    
    
    // Llama a cargarServicios cuando se abra el modal
    const modalRegistrarVehiculo = document.getElementById('registrarVehiculo');

// Asegúrate de que el evento sea detectado
modalRegistrarVehiculo.addEventListener('show.bs.modal', () => {
    console.log('El modal se está mostrando');
    cargarServicios();
});




    // Cargar vehículos en la tabla
    async function cargarVehiculos() {
        try {
            const response = await fetch(`${API_URL_VEHICULOS}/all`, {
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
                const serviciosHTML = JSON.stringify(vehiculo.servicios); // Convierte los servicios a JSON para pasarlos como atributo
                const row = `
                    <tr align="center">
                        <td>${vehiculo.modelo}</td>
                        <td>${vehiculo.marca}</td>
                        <td>${vehiculo.color}</td>
                        <td>
                            <button class="btn btn-sm ${vehiculo.status ? 'btn-success' : 'btn-danger'} cambiarEstado" 
                                    data-id="${vehiculo.id}" data-status="${vehiculo.status}">
                                <i class="fas fa-sync-alt"></i> ${vehiculo.status ? 'Activo' : 'Inactivo'}
                            </button>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-primary btnIcono btnEditar" 
                                    data-id="${vehiculo.id}" data-modelo="${vehiculo.modelo}" 
                                    data-marca="${vehiculo.marca}" data-color="${vehiculo.color}">
                                <i class="fas fa-edit"></i>
                            </button>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-secondary btnAsignarServicio" data-id="${vehiculo.id}">
                                <i class="fas fa-plus"></i> Asignar Servicio
                            </button>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-info btnVerServicios" 
                                    data-id="${vehiculo.id}" data-servicios='${serviciosHTML}'>
                                <i class="fa-solid fa-eye"></i>
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
    

    document.body.addEventListener('click', function (event) {
        if (event.target.closest('.btnVerServicios')) {
            const btn = event.target.closest('.btnVerServicios');
            const vehiculoId = btn.getAttribute('data-id');
            const listaServicios = btn.getAttribute('data-servicios'); // Servicios asociados en formato JSON
            
            // Llenar la lista de servicios en el modal
            const ulServicios = document.getElementById('listaServicios');
            ulServicios.innerHTML = ''; // Limpia los servicios previos
    
            const servicios = JSON.parse(listaServicios); // Asegúrate de que estén en JSON
    
            if (servicios.length === 0) {
                const noServiciosMessage = document.createElement('li');
                noServiciosMessage.textContent = 'No hay servicios aún';
                noServiciosMessage.className = 'list-group-item text-center text-muted';
                ulServicios.appendChild(noServiciosMessage);
            } else {
                servicios.forEach(servicio => {
                    const li = document.createElement('li');
                    li.textContent = `${servicio.nombre} - (${servicio.categoria.nombre})`;
                    li.className = 'list-group-item';
                    ulServicios.appendChild(li);
                });
            }
    
            // Mostrar el modal
            $('#modalServicios').modal('show');
        }
    });
    
    

    document.getElementById('formRegistrarVehiculo').addEventListener('submit', async (event) => {
        event.preventDefault();
    
        const modelo = document.getElementById('modelo').value.trim();
        const marca = document.getElementById('marca').value.trim();
        const color = document.getElementById('color').value.trim();
        const servicioId = document.getElementById('serviciove').value;
    
        if (!modelo || !marca || !color) {
            mostrarAlerta('error', 'Por favor, complete todos los campos del formulario.');
            return;
        }
    
        try {
            // Registrar el vehículo
            const registrarResponse = await fetch(`${API_URL_VEHICULOS}/registrar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ modelo, marca, color, status: true })
            });
    
            if (!registrarResponse.ok) {
                mostrarAlerta('error', 'Error al registrar el vehículo.');
                return;
            }
    
            const nuevoVehiculo = await registrarResponse.json(); // Suponiendo que el API retorna el vehículo registrado con su ID
            const vehiculoId = nuevoVehiculo.id;
    
            mostrarAlerta('success', 'Vehículo registrado exitosamente.');
    
            // Si se seleccionó un servicio, asignarlo
            if (servicioId) {
                const asignarResponse = await fetch(`${API_URL_VEHICULOS}/${vehiculoId}/asignar-servicio/${servicioId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
    
                if (!asignarResponse.ok) {
                    mostrarAlerta('error', 'Error al asignar el servicio al vehículo.');
                    return;
                }
    
                mostrarAlerta('success', 'Servicio asignado exitosamente al vehículo.');
            }
    
            // Recargar la lista de vehículos
            cargarVehiculos();
    
            // Cerrar el modal y limpiar el formulario
            const modal = document.getElementById('registrarVehiculo');
            modal.classList.remove('show');
            modal.style.display = 'none';
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.remove();
            }
            document.getElementById('formRegistrarVehiculo').reset();
        } catch (error) {
            mostrarAlerta('error', 'Hubo un error al intentar procesar las solicitudes.');
            console.error(error);
        }
    });
    
    document.getElementById('formAsignarServicio').addEventListener('submit', function (event) {
        event.preventDefault();
    
        const vehiculoId = document.getElementById('idVehiculo').value;
        const servicioId = document.getElementById('serviciove').value;
    
        if (!servicioId) {
            mostrarAlerta('error', 'Por favor, seleccione un servicio.');
            return;
        }
    
        // Llamar a la función para asignar el servicio
        asignarServicio(vehiculoId, servicioId);
    
        // Cerrar el modal
        $('#asignarServicio').modal('hide');
    });
    

    document.body.addEventListener('click', function (event) {
        if (event.target.closest('.btnAsignarServicio')) {
            const btn = event.target.closest('.btnAsignarServicio');
            const vehiculoId = btn.getAttribute('data-id');
    
            // Abrir el modal y pasar el ID del vehículo
            document.getElementById('idVehiculo').value = vehiculoId;
            $('#asignarServicio').modal('show');
        }
    });

    async function asignarServicio(vehiculoId, servicioId) {
        try {
            // Realizar la solicitud PUT para asignar el servicio
            const response = await fetch(`${API_URL_VEHICULOS}/${vehiculoId}/asignar-servicio/${servicioId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (!response.ok) {
                mostrarAlerta('error', 'Error al asignar el servicio.');
                return;
            }
    
            // Mostrar alerta de éxito
            mostrarAlerta('success', 'Servicio asignado exitosamente.');
    
            // Recargar la tabla de vehículos
            cargarVehiculos();
    
            // Limpiar el formulario y reiniciar el select a su opción por defecto
            document.getElementById('formAsignarServicio').reset();  // Resetea el formulario
    
            // Reiniciar el select a la opción por defecto
            const selectServicio = document.getElementById('serviciove');
            selectServicio.value = ""; // Esto selecciona el valor vacío que corresponde a la opción por defecto
            selectServicio.innerHTML = '<option value="" selected>Seleccione un servicio</option>'; // Reinicia las opciones
            
            // Si deseas cargar los servicios nuevamente después de asignar, llama a cargarServicios aquí
            cargarServicios();
            
        } catch (error) {
            mostrarAlerta('error', 'Hubo un error al intentar asignar el servicio.');
            console.error(error);
        }
    }

    // Editar un vehículo
    document.body.addEventListener('click', function (event) {
        if (event.target.closest('.btnEditar')) {
            const btn = event.target.closest('.btnEditar');
            // Abrir el modal de editar
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
            cargarVehiculos(); // Recarga la tabla de vehículos
            
            // Cerrar el modal
            $('#modificarVehiculo').modal('hide');
            
            // Limpiar el formulario
            document.getElementById('formModificarVehiculo').reset();
        } else {
            mostrarAlerta('error', 'Error al actualizar el vehículo.');
        }
    } catch (error) {
        mostrarAlerta('error', 'Hubo un error al intentar actualizar el vehículo.');
        console.error(error);
    }
});

    
    
    document.body.addEventListener('click', function (event) {
        if (event.target.closest('.cambiarEstado')) {
            const btn = event.target.closest('.cambiarEstado');
            const id = btn.getAttribute('data-id');
            const nuevoEstado = btn.getAttribute('data-status') === 'true' ? false : true;
    
            // Guardar los datos necesarios en el modal
            document.getElementById('idServicio').value = id;
            document.getElementById('estadoServicio').value = nuevoEstado;
    
            // Mostrar el modal de confirmación
            $('#modificarEstadoServicio').modal('show');
        }
    });
    
    // Confirmar el cambio de estado desde el modal
    document.getElementById('formModificarEstado').addEventListener('submit', function (event) {
        event.preventDefault();
    
        const id = document.getElementById('idServicio').value;
        const nuevoEstado = document.getElementById('estadoServicio').value === 'true';
    
        // Obtener datos existentes del vehículo desde la fila de la tabla
        const fila = document.querySelector(`.cambiarEstado[data-id="${id}"]`).closest('tr');
        const modelo = fila.cells[0].textContent.trim();
        const marca = fila.cells[1].textContent.trim();
        const color = fila.cells[2].textContent.trim();
    
        // Construir el objeto de datos para enviar
        const vehiculoData = {
            id: parseInt(id),
            modelo: modelo,
            marca: marca,
            color: color,
            status: nuevoEstado
        };
    
        // Llamar a la API para cambiar el estado
        cambiarEstadoVehiculo(vehiculoData);
    
        // Ocultar el modal
        $('#modificarEstadoServicio').modal('hide');
    });
    
    // Función para llamar a la API y cambiar el estado del vehículo
    async function cambiarEstadoVehiculo(vehiculoData) {
        try {
            const response = await fetch(`${API_URL_VEHICULOS}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(vehiculoData) // Enviar el objeto como JSON
            });
    
            if (response.ok) {
                mostrarAlerta('success', 'Estado cambiado exitosamente.');
                cargarVehiculos();
            } else {
                mostrarAlerta('error', 'Error al cambiar el estado del vehículo.');
            }
        } catch (error) {
            mostrarAlerta('error', 'Hubo un error al intentar cambiar el estado.');
            console.error(error);
        }
    }
    


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
    cargarServicios();
    
});