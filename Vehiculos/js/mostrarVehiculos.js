// Función para mostrar una alerta personalizada
function mostrarAlerta(tipo, mensaje) {
    const alerta = document.createElement('div');
    alerta.classList.add('alerta', 'mostrar');

    const icono = tipo === 'success' ? '<i class="fas fa-check-circle icono"></i>' : '<i class="fas fa-times-circle icono"></i>';
    const claseColor = tipo === 'success' ? 'bg-success' : 'bg-danger';
    alerta.classList.add(claseColor);

    alerta.innerHTML = `${icono}<span class="texto">${mensaje}</span><button class="btn-cerrar"><i class="fa fa-times"></i></button>`;
    document.body.appendChild(alerta);

    // Después de 3 segundos, ocultamos la alerta
    setTimeout(() => {
        alerta.classList.remove('mostrar');
        alerta.classList.add('ocultar');
        // Remover la alerta después de la animación
        setTimeout(() => {
            alerta.remove();
        }, 500);
    }, 3000);
}

// Función para cargar los vehículos en la tabla
async function cargarVehiculos() {
    const API_URL = "http://localhost:8080/vehiculos";
    const token = localStorage.getItem('jwt');

    if (!token) {
        mostrarAlerta('error', 'No se encontró el token. Por favor, inicie sesión.');
        return;
    }

    const tableBody = document.getElementById('vehiculosTableBody');

    try {
        const response = await fetch(`${API_URL}/activos`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            mostrarAlerta('error', 'Error al cargar los vehículos.');
            throw new Error('Error al cargar los vehículos');
        }

        const data = await response.json();
        tableBody.innerHTML = ''; // Limpiar la tabla

        if (data.length === 0) {
            mostrarAlerta('info', 'No se encontraron vehículos activos.');
        }

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

        // Función para agregar eventos después de cargar los datos en la tabla
        function agregarEventos() {
            // Botón de cambio de estado
            document.querySelectorAll('.cambiarEstado').forEach(btn => {
                btn.addEventListener('click', (event) => {
                    const id = btn.getAttribute('data-id');
                    const status = btn.getAttribute('data-status') === 'true';
                    
                    // Asignar valores al modal
                    document.getElementById('idServicio').value = id;
                    document.getElementById('estadoServicio').value = status;

                    // Actualizar texto en el modal según el estado
                    const estadoLabel = document.querySelector('#modificarEstadoServicio h6');
                    estadoLabel.textContent = status 
                        ? '¿Estás seguro de desactivar este vehículo?' 
                        : '¿Estás seguro de activar este vehículo?';

                    $('#modificarEstadoServicio').modal('show');
                });
            });

            // Botón de edición
            document.querySelectorAll('.btnIcono').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    const modelo = btn.getAttribute('data-modelo');
                    const marca = btn.getAttribute('data-marca');
                    const color = btn.getAttribute('data-color');

                    // Asignar valores al modal
                    document.getElementById('idMod').value = id;
                    document.getElementById('modeloMod').value = modelo;
                    document.getElementById('marcaMod').value = marca;
                    document.getElementById('colorMod').value = color;

                    $('#modificarVehiculo').modal('show');
                });
            });
        }

        // Agregar eventos a los botones
        agregarEventos();
    } catch (error) {
        console.error('Error al cargar los vehículos:', error);
        mostrarAlerta('error', 'Ocurrió un error al intentar cargar los vehículos.');
    }
}

// Inicializar la carga al cargar la página
document.addEventListener('DOMContentLoaded', cargarVehiculos);
