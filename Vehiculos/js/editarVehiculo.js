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

// Función para editar un vehículo
async function editarVehiculo(event) {
    event.preventDefault();

    const API_URL = "http://localhost:8080/vehiculos/actualizar";
    const token = localStorage.getItem('jwt');

    if (!token) {
        mostrarAlerta('error', 'No se encontró el token. Por favor, inicie sesión.');
        return;
    }

    const id = document.getElementById("idMod").value;
    const modelo = document.getElementById("modeloMod").value.trim();
    const marca = document.getElementById("marcaMod").value.trim();
    const color = document.getElementById("colorMod").value.trim();

    if (!id || !modelo || !marca || !color) {
        mostrarAlerta('error', 'Por favor, complete todos los campos.');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, modelo, marca, color, status: true })
        });

        if (response.ok) {
            mostrarAlerta('success', 'Vehículo modificado exitosamente');
            $('#modificarVehiculo').modal('hide');
            cargarVehiculos(); // Recargar la tabla
        } else {
            mostrarAlerta('error', 'Error al modificar el vehículo.');
        }
    } catch (error) {
        console.error('Error al modificar el vehículo:', error);
        mostrarAlerta('error', 'Hubo un error al procesar la solicitud.');
    }
}

// Agregar evento al formulario de edición
document.getElementById('formModificarVehiculo').addEventListener('submit', editarVehiculo);
