// Función para registrar un usuario
async function registrarUsuario(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Obtener el token JWT desde localStorage
    const token = localStorage.getItem('jwt');
    console.log("Token JWT obtenido:", token);

    // Verificar si el token existe
    if (!token) {
        console.log('No se encontró el token en el localStorage');
        mostrarAlerta('No se encontró el token. Por favor, inicie sesión.', 'error');
        return;
    }

    // URL de la API
    const url = 'http://localhost:8080/usuarios/save';

    // Obtener los datos del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const contraseña = document.getElementById('contrasena').value.trim();
    const rol = document.getElementById('rol').value.trim();

    // Crear el objeto de usuario
    const usuario = {
        nombre: nombre,
        apellidos: apellidos,
        email: email,
        telefono: telefono,
        contraseña: contraseña,
        admin: rol === 'admin' ? 'ROLE_ADMIN' : 'ROLE_USER',
        status: true
    };

    try {
        // Realizar la solicitud POST con el token en el encabezado
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Incluir el token en el encabezado
                'Accept': 'application/json',       // Aceptar respuesta en formato JSON
                'Content-Type': 'application/json'  // Enviar datos en formato JSON
            },
            body: JSON.stringify(usuario)          // Convertir el objeto a JSON
        });

        // Manejo de la respuesta
        if (response.ok) {
            const data = await response.json();
            console.log('Usuario registrado exitosamente:', data);
            mostrarAlerta('Usuario registrado exitosamente.', 'success');
            // Opcional: cerrar el modal y limpiar el formulario
            $('#registrarUsuario').modal('hide');
            document.getElementById('formRegistrarUsuario').reset();
            // Recargar o actualizar la lista de usuarios si es necesario
            obtenerUsuarios();
        } else {
            const errorData = await response.json();
            console.error('Error al registrar el usuario:', errorData);
            mostrarAlerta('Error al registrar el usuario: ' + (errorData.message || 'Verifique los datos ingresados'), 'error');
        }
    } catch (error) {
        console.error('Hubo un problema con la solicitud:', error);
        mostrarAlerta('Ocurrió un error al intentar registrar el usuario.', 'error');
    }
}

// Agregar un evento al formulario para ejecutar la función de registro
document.getElementById('formRegistrarUsuario').addEventListener('submit', registrarUsuario);
