// Función para mostrar la alerta (puedes personalizarla)
function mostrarAlerta(mensaje, tipo = 'info') {
    const alerta = document.createElement('div');
    alerta.classList.add('alerta', 'mostrar');

    // Configurar estilo de fondo y contenido
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
// Función para editar un usuario
async function editarUsuario(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Obtener el token JWT desde localStorage
    const token = localStorage.getItem('jwt');
    if (!token) {
        mostrarAlerta('No se encontró el token. Por favor, inicie sesión.', 'error');
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
            mostrarAlerta('Usuario actualizado exitosamente', 'success');
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

// Agregar el evento al formulario
document.getElementById('formModificarUsuario').addEventListener('submit', editarUsuario);
