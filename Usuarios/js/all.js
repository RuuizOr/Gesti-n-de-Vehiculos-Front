// Función para obtener y mostrar los usuarios
async function obtenerUsuarios() {
    // Obtener el token JWT desde localStorage
    const token = localStorage.getItem('jwt');
    console.log("Token JWT obtenido:", token);

    // Verificar si el token existe
    if (!token) {
        console.log('No se encontró el token en el localStorage');
        alert('No se encontró el token. Por favor, inicie sesión.');
        return;
    }

    const url = 'http://localhost:8080/usuarios/all';  // URL de la API

    try {
        // Realizar la solicitud GET con el token en el encabezado
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Incluir el token en el encabezado
                'Accept': 'application/json',         // Aceptar respuesta en formato JSON
                'Content-Type': 'application/json'    // Especificar que enviamos/recibimos JSON
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
            //admin indica el rol
            let rol;
        // Iterar sobre los datos de los usuarios y crear filas dinámicamente
        data.result.forEach(usuario => {
            if(usuario.admin ==="ROLE_USER"){
                rol = "Usuario"
            }else if(usuario.admin ==="ROLE_ADMIN"){
                rol = "Administrador"
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
                            data-rol="${usuario.admin ==="ROLE_ADMIN" ? 'admin': 'usuario'}" 
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
        alert('Ocurrió un error al intentar obtener los datos de los usuarios.');
    }
}

// Llamar la función para obtener los datos de los usuarios al cargar la página
obtenerUsuarios();