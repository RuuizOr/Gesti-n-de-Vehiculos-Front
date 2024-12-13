// Función para mostrar alertas personalizadas
function mostrarAlerta(mensaje, tipo = 'info') {
    const alerta = document.createElement('div');
    alerta.classList.add('alerta', 'mostrar');

    // Configurar el estilo de fondo y contenido según el tipo
    alerta.style.backgroundColor = '#092e95'; // Color único para todas las alertas
    alerta.innerHTML = `
        <span class="texto">🚘 ${mensaje}</span> 
        <button class="btn-cerrar" onclick="this.parentElement.classList.remove('mostrar')">
            <i class="fa fa-times"></i>
        </button>
    `;

    document.body.appendChild(alerta);

    // Ocultar automáticamente la alerta después de 5 segundos
    setTimeout(() => {
        alerta.classList.remove('mostrar');
        setTimeout(() => alerta.remove(), 500); // Eliminar del DOM después de la transición
    }, 5000);
}

// Función para obtener y mostrar los usuarios
async function obtenerUsuarios() {
    const token = localStorage.getItem('jwt');
    console.log("Token JWT obtenido:", token);

    if (!token) {
        console.log('No se encontró el token en el localStorage');
        mostrarAlerta('No se encontró el token. Por favor, inicie sesión.', 'error');
        return;
    }

    const url = 'http://localhost:8080/usuarios/all';

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error en la red: ' + response.statusText);
        }

        const data = await response.json();
        console.log('Datos de los usuarios:', data);

        const usuariosTableBody = document.getElementById('usuariosTableBody');
        usuariosTableBody.innerHTML = '';
        let rol;

        data.result.forEach(usuario => {
            rol = usuario.admin === "ROLE_USER" ? "Usuario" : "Administrador";

            const row = `
                <tr align="center">
                    <td>${usuario.nombre}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.telefono}</td>
                    <td>${rol}</td>
                    <td>
                        <button class="btn btn-sm ${usuario.status ? 'btn-success' : 'btn-danger'}"
                            data-id="${usuario.id}" 
                            data-estado="${usuario.status}" 
                            data-toggle="modal" 
                            data-target="#modificarEstadoServicio">
                            <i class="fas fa-sync-alt"></i> ${usuario.status ? "Activo" : "Inactivo"}
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-primary btnIcono"
                            data-id="${usuario.id}" 
                            data-nombre="${usuario.nombre}" 
                            data-apellidos="${usuario.apellidos}"
                            data-correo="${usuario.email}"  
                            data-telefono="${usuario.telefono}" 
                            data-contrasena="${usuario.contraseña}" 
                            data-rol="${usuario.admin === "ROLE_ADMIN" ? 'admin' : 'usuario'}" 
                            data-estado="${usuario.status}" 
                            data-toggle="modal" 
                            data-target="#modificarUsuario">
                            <i class="fas fa-edit"></i>
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-secondary btnAsignarVehiculo" data-id="${usuario.id}">
                            Asignar Vehículo
                        </button>
                    </td>
                </tr>
            `;
            usuariosTableBody.insertAdjacentHTML('beforeend', row);
        });

        agregarEventos();
    } catch (error) {
        console.error('Hubo un problema con la solicitud:', error);
        mostrarAlerta('Ocurrió un error al intentar obtener los datos de los usuarios.', 'error');
    }
}

// Función para cargar vehículos en el select
async function cargarVehiculos() {
    const token = localStorage.getItem('jwt');
    const API_URL_VEHICULOS = 'http://localhost:8080/vehiculos/all';

    try {
        const response = await fetch(API_URL_VEHICULOS, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Error al cargar los vehículos.');

        const data = await response.json();
        const selectVehiculos = document.getElementById('vehiculoSelect');

        selectVehiculos.innerHTML = '<option value="">Seleccione un vehículo</option>';
        data.forEach(vehiculo => {
            const option = document.createElement('option');
            option.value = vehiculo.id;
            option.textContent = `${vehiculo.modelo} (${vehiculo.marca})`;
            selectVehiculos.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar los vehículos:', error);
    }
}

// Función para asignar vehículo a un usuario
async function asignarVehiculo(idUsuario, idVehiculo) {
    const token = localStorage.getItem('jwt');
    const API_URL_ASIGNAR = 'http://localhost:8080/usuarios/asignarVehiculo';

    try {
        const response = await fetch(API_URL_ASIGNAR, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idUsuario, idVehiculo })
        });

        if (!response.ok) throw new Error('Error al asignar el vehículo.');

        mostrarAlerta('Vehículo asignado exitosamente.', 'success');
    } catch (error) {
        console.error('Error al asignar el vehículo:', error);
        mostrarAlerta('Hubo un error al asignar el vehículo.', 'error');
    }
}

// Función para manejar eventos de botones
function agregarEventos() {
    document.body.addEventListener('click', function (event) {
        if (event.target.closest('.btnAsignarVehiculo')) {
            const btn = event.target.closest('.btnAsignarVehiculo');
            const idUsuario = btn.getAttribute('data-id');
            document.getElementById('idUsuario').value = idUsuario;
            cargarVehiculos();
            $('#asignarServicio').modal('show');
        }
    });

    document.getElementById('formAsignarServicio').addEventListener('submit', function (event) {
        event.preventDefault();
        const idUsuario = document.getElementById('idUsuario').value;
        const idVehiculo = document.getElementById('vehiculoSelect').value;

        if (!idVehiculo) {
            mostrarAlerta('Por favor, seleccione un vehículo.', 'error');
            return;
        }

        asignarVehiculo(idUsuario, idVehiculo);
        $('#asignarServicio').modal('hide');
    });
}

// Función para filtrar los usuarios
function filtrarUsuarios() {
    const nombre = document.getElementById('filterName').value.toLowerCase();
    const estado = document.getElementById('filterState').value;

    const filas = document.querySelectorAll('#usuariosTableBody tr');

    filas.forEach(fila => {
        const nombreUsuario = fila.cells[0].textContent.toLowerCase();
        const estadoBoton = fila.querySelector('button').getAttribute('data-estado');

        const coincideNombre = nombreUsuario.includes(nombre);

        let coincideEstado = true;
        if (estado) {
            coincideEstado = (estado === 'Activo' && estadoBoton === 'true') ||
                             (estado === 'Inactivo' && estadoBoton === 'false');
        }

        fila.style.display = coincideNombre && coincideEstado ? '' : 'none';
    });
}

// Agregar eventos a los filtros
document.getElementById('filterName').addEventListener('input', filtrarUsuarios);
document.getElementById('filterState').addEventListener('change', filtrarUsuarios);

// Llamar las funciones al cargar la página
obtenerUsuarios();





