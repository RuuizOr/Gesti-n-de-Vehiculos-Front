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

// Función para cambiar el estado de un vehículo
async function cambiarEstadoVehiculo(event) {
    event.preventDefault();

    const API_URL = "http://localhost:8080/vehiculos/cambiar-estado";
    const token = localStorage.getItem('jwt');

    if (!token) {
        mostrarAlerta('error', 'No se encontró el token. Por favor, inicie sesión.');
        return;
    }

    const id = document.getElementById("idServicio").value;
    const status = document.getElementById("estadoServicio").value === "true"; // Obtenemos el estado (activo o no activo)

    try {
        // Enviar la solicitud PUT con el parámetro status en la URL
        const response = await fetch(`${API_URL}/${id}?status=${!status}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            mostrarAlerta('success', 'Estado del vehículo actualizado correctamente.');
            $('#modificarEstadoServicio').modal('hide');
            cargarVehiculos(); // Recargar la tabla de vehículos
        } else {
            const errorData = await response.json();
            mostrarAlerta('error', `Error al actualizar el estado: ${errorData.message || 'Intente de nuevo'}`);
        }
    } catch (error) {
        console.error('Error al cambiar el estado del vehículo:', error);
        mostrarAlerta('error', 'Ocurrió un error al intentar cambiar el estado del vehículo.');
    }
}

// Agregar evento al formulario de cambio de estado
document.getElementById("formModificarEstado").addEventListener("submit", cambiarEstadoVehiculo);
