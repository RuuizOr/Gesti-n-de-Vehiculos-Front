// Mostrar alerta personalizada
function mostrarAlerta(mensaje, tipo = 'info') {
    const alerta = document.createElement('div');
    alerta.classList.add('alerta', tipo === 'error' ? 'bg-danger' : 'bg-success', 'mostrar');

    alerta.innerHTML = `
        <span class="texto">${mensaje}</span>
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

// Configuración del modal para modificar usuario
$('#modificarUsuario').on('show.bs.modal', function (event) {
    const button = $(event.relatedTarget); // Botón que activó el modal

    // Capturar los datos del botón
    const id = button.data('id') || '';
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
        mostrarAlerta('No se encontró el token. Por favor, inicie sesión.', 'error');
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
            mostrarAlerta('Usuario actualizado exitosamente', 'success');
            // Opcional: cerrar el modal y limpiar el formulario
            $('#modificarUsuario').modal('hide');
            document.getElementById('formModificarUsuario').reset();
            // Recargar o actualizar la lista de usuarios
            obtenerUsuarios();
        } else {
            const errorData = await response.json();
            mostrarAlerta('Error al actualizar el usuario: ' + (errorData.message || 'Verifique los datos ingresados'), 'error');
        }
    } catch (error) {
        mostrarAlerta('Ocurrió un error al intentar actualizar el usuario.', 'error');
    }
}

// Agregar el evento al formulario
document.getElementById('formModificarUsuario').addEventListener('submit', editarUsuario);
