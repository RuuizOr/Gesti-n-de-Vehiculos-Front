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
    // Obtener el token JWT desde localStorage
    const token = localStorage.getItem('jwt');
    console.log("Token JWT obtenido:", token);

    // Verificar si el token existe
    if (!token) {
        console.log('No se encontró el token en el localStorage');
        mostrarAlerta('No se encontró el token. Por favor, inicie sesión.', 'error');
        return;
    }

    const url = 'http://localhost:8080/usuarios/all'; // URL de la API

    try {
        // Realizar la solicitud GET con el token en el encabezado
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        // Verificar si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error('Error en la red: ' + response.statusText);
        }

        // Convertir la respuesta a JSON
        const data = await response.json();
        console.log('Datos de los usuarios:', data);

        // Llenar la tabla con los datos de los usuarios
        const usuariosTableBody = document.getElementById('usuariosTableBody');
        usuariosTableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos
        let rol;

        // Iterar sobre los datos de los usuarios y crear filas dinámicamente
        data.result.forEach(usuario => {
            if (usuario.admin === "ROLE_USER") {
                rol = "Usuario";
            } else if (usuario.admin === "ROLE_ADMIN") {
                rol = "Administrador";
            }

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
                </tr>
            `;
            // Insertar la fila en la tabla
            usuariosTableBody.insertAdjacentHTML('beforeend', row);
        });
    } catch (error) {
        // Manejar errores de la solicitud
        console.error('Hubo un problema con la solicitud:', error);
        mostrarAlerta('Ocurrió un error al intentar obtener los datos de los usuarios.', 'error');
    }
}

// Llamar la función para obtener los datos de los usuarios al cargar la página
obtenerUsuarios();

// Función para filtrar los usuarios
function filtrarUsuarios() {
    const nombre = document.getElementById('filterName').value.toLowerCase();
    const estado = document.getElementById('filterState').value;

    // Obtener todas las filas de la tabla
    const filas = document.querySelectorAll('#usuariosTableBody tr');

    // Iterar sobre todas las filas
    filas.forEach(fila => {
        const nombreUsuario = fila.cells[0].textContent.toLowerCase();
        // Obtener el estado desde el botón dentro de la fila
        const estadoBoton = fila.querySelector('button').getAttribute('data-estado'); // Obtener el estado del botón

        // Comprobar si la fila cumple con los filtros
        const coincideNombre = nombreUsuario.includes(nombre);

        let coincideEstado = true; // Si no se selecciona estado, coincide siempre
        if (estado) {
            // Compara si el estado seleccionado corresponde con el estado del usuario
            coincideEstado = (estado === 'Activo' && estadoBoton === 'true') ||
                             (estado === 'Inactivo' && estadoBoton === 'false');
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
