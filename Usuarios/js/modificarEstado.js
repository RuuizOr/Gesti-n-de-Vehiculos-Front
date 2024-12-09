// Manejar el evento de apertura del modal
$('#modificarEstadoServicio').on('show.bs.modal', function (event) {
    const button = $(event.relatedTarget); // Botón que abrió el modal
    const idUsuario = button.data('id'); // ID del usuario
    const estadoActual = button.data('estado'); // Estado actual del usuario

    // Configurar los valores en el formulario
    $('#idUsuario').val(idUsuario);
    $('#estadoUsuario').val(!estadoActual); // Cambiar de true a false y viceversa
});

// Manejar el envío del formulario para cambiar el estado
$('#formModificarEstado').on('submit', async function (e) {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    const idUsuario = $('#idUsuario').val();
    const nuevoEstado = $('#estadoUsuario').val();

    // Token JWT desde localStorage
    const token = localStorage.getItem('jwt');
    if (!token) {
        mostrarAlerta('No se encontró el token. Por favor, inicie sesión.', 'error');
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/usuarios/status', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: idUsuario,
                status: nuevoEstado === "true" // Convertir a boolean
            })
        });

        if (!response.ok) {
            throw new Error('Error al cambiar el estado: ' + response.statusText);
        }

        // Recargar los datos de los usuarios
        await obtenerUsuarios();
        $('#modificarEstadoServicio').modal('hide'); // Cerrar el modal
        mostrarAlerta('Estado actualizado correctamente.', 'success');
    } catch (error) {
        console.error('Error al intentar cambiar el estado:', error);
        mostrarAlerta('Ocurrió un error al intentar cambiar el estado del usuario.', 'error');
    }
});
