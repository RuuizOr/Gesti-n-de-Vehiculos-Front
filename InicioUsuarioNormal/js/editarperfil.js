// Función para mostrar la alerta (puedes personalizarla)
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
// Función para editar un usuario
async function editarUsuario(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Obtener el token JWT desde localStorage
    const token = localStorage.getItem('jwt');
    if (!token) {
        mostrarAlerta( 'error','No se encontró el token. Por favor, inicie sesión.');
        return;
    }

    // Obtener el ID del usuario desde el localStorage
    const idUsuario = localStorage.getItem('userId'); // Se espera que el ID esté guardado en el localStorage

    if (!idUsuario) {
        mostrarAlerta('No se encontró el ID del usuario. Por favor, intente de nuevo.', 'error');
        return;
    }

    // URL de la API
    const url = 'http://localhost:8080/usuarios/actualizar';

    // Obtener los datos del formulario
    const nombre = document.getElementById('nombreMod').value.trim();
    const apellidos = document.getElementById('apellidosMod').value.trim();
    const email = document.getElementById('emailMod').value.trim();
    const telefono = document.getElementById('telefonoMod').value.trim();
    const contraseña = document.getElementById('contrasenaMod').value.trim();
    const rol = localStorage.getItem('admin');
    console.log(rol)

    // Crear el objeto de usuario con la estructura correcta
    const usuario = {
        nombre: nombre,
        apellidos: apellidos,
        email: email,
        telefono: telefono,
        contraseña: contraseña,
        admin: rol 
    };
    console.log(usuario)

    try {
        // Realizar la solicitud PUT con el token en el encabezado
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)  // Enviar solo los campos necesarios
        });

        if (response.ok) {
            const data = await response.json();
            mostrarAlerta('success','Usuario actualizado exitosamente');
            // Opcional: cerrar el modal y limpiar el formulario
            $('#modificarUsuario').modal('hide');
            document.getElementById('formModificarUsuario').reset();
            // Recargar o actualizar la lista de usuarios (dependiendo de cómo se maneje la lista)
            obtenerUsuarios(); // Asumimos que tienes una función que recarga la lista de usuarios
        } else {
            const errorData = await response.json();
            mostrarAlerta('Error al actualizar el usuario: ' + (errorData.message || 'Verifique los datos ingresados'), 'error');
        }
    } catch (error) {
        mostrarAlerta('Ocurrió un error al intentar actualizar el usuario.', 'error');
    }
}

// Asegúrate de que el evento esté bien asociado
document.getElementById('formModificarUsuario').addEventListener('submit', function(event) {
    event.preventDefault(); // Asegúrate de que este preventDefault() esté en este nivel
    editarUsuario(event);
});
