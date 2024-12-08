$('#modificarUsuario').on('show.bs.modal', function (event) {
    const button = $(event.relatedTarget); // Botón que activó el modal

    // Capturar los datos del botón
    const id = button.data('id') || '';
    console.log('data')
    console.log(button)
    console.log(button.data('contrasena'))
    const nombre = button.data('nombre') || '';
    const apellidos = button.data('apellidos') || '';
    const email = button.data('correo') || '';
    const telefono = button.data('telefono') || '';
    const contrasena = button.data('contrasena') || '';
    const rol = button.data('rol') || '';

    // Asignar los valores a los campos del formulario
    $('#idUsuarioMod').val(id);
    $('#nombreMod').val(nombre);
    $('#apellidosMod').val(apellidos);
    $('#emailMod').val(email);
    $('#telefonoMod').val(telefono);
    $('#contrasenaMod').val(contrasena);
    $('#rolMod').val(rol);
});


// Función para editar un usuario
async function editarUsuario(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Obtener el token JWT desde localStorage
    const token = localStorage.getItem('jwt');
    if (!token) {
        alert('No se encontró el token. Por favor, inicie sesión.');
        return;
    }

    // URL de la API
    const url = 'http://localhost:8080/usuarios/actualizar';

    // Obtener los datos del formulario
    const idUsuario = document.getElementById('idUsuarioMod').value.trim();
    const nombre = document.getElementById('nombreMod').value.trim();
    const apellidos = document.getElementById('apellidosMod').value.trim();
    const email = document.getElementById('emailMod').value.trim();
    const telefono = document.getElementById('telefonoMod').value.trim();
    const contraseña = document.getElementById('contrasenaMod').value.trim();
    const rol = document.getElementById('rolMod').value.trim();

    // Crear el objeto de usuario
    const usuario = {
        id: idUsuario,
        nombre: nombre,
        apellidos: apellidos,
        email: email,
        telefono: telefono,
        contraseña: contraseña,
        admin: rol === 'admin' ? 'ROLE_ADMIN' : 'ROLE_USER',
        status: true
    };

    try {
        // Realizar la solicitud PUT con el token en el encabezado
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });

        if (response.ok) {
            const data = await response.json();
            alert('Usuario actualizado exitosamente');
            // Opcional: cerrar el modal y limpiar el formulario
            $('#modificarUsuario').modal('hide');
            document.getElementById('formModificarUsuario').reset();
            // Recargar o actualizar la lista de usuarios
            obtenerUsuarios();
        } else {
            const errorData = await response.json();
            alert('Error al actualizar el usuario: ' + (errorData.message || 'Verifique los datos ingresados'));
        }
    } catch (error) {
        alert('Ocurrió un error al intentar actualizar el usuario.');
    }
}

// Agregar el evento al formulario
document.getElementById('formModificarUsuario').addEventListener('submit', editarUsuario);
