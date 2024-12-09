document.addEventListener('DOMContentLoaded', () => {
    const formModificarEstado = document.getElementById('formModificarEstadoCate');
    const modalModificarEstado = document.getElementById('modificarEstadoServicio');

    // Listener para abrir el modal y prellenar los campos ocultos
    document.addEventListener('click', (event) => {
        if (event.target.closest('.btn-success, .btn-danger')) {
            const button = event.target.closest('button');

            // Obtener los datos necesarios desde los atributos del botón
            const id = button.getAttribute('data-id');
            const estadoActual = button.getAttribute('data-estado') === 'true';
            const nuevoEstado = !estadoActual;

            // Llenar los campos ocultos del formulario
            document.getElementById('idCategoria').value = id;
            document.getElementById('estadoCategoria').value = nuevoEstado;

            // Mostrar el modal
            $(modalModificarEstado).modal('show');
        }
    });

    // Listener para enviar la solicitud de cambio de estado
    formModificarEstado.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

        const token = localStorage.getItem('jwt'); // Obtener el token JWT
        if (!token) {
            mostrarToast('No se encontró el token. Por favor, inicie sesión.', '#f44336');  // Error en rojo
            return;
        }

        const url = 'http://localhost:8080/CategoriasDeServicios/status'; // URL de la API

        // Obtener los datos del formulario
        const id = document.getElementById('idCategoria').value;
        const estado = document.getElementById('estadoCategoria').value;

        const payload = {
            id,
            status: estado === 'true' // Convertir a booleano
        };

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Error al cambiar el estado: ' + response.statusText);
            }

            const data = await response.json();

            // Mostrar mensaje de éxito
            mostrarToast('Estado actualizado correctamente.', '#4caf50');  // Éxito en verde

            // Cerrar el modal
            $(modalModificarEstado).modal('hide');

            // Solución para remover el fondo del modal
            document.body.classList.remove('modal-open');
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.remove();
            }

            // Recargar las categorías para reflejar los cambios
            obtenerCategorias();

        } catch (error) {
            console.error('Error al intentar cambiar el estado:', error);
            mostrarToast('Ocurrió un error al intentar cambiar el estado.', '#f44336');  // Error en rojo
        }
    });
});

// Función para mostrar el mensaje tipo toast
function mostrarToast(mensaje, color = "#092e95") {
    const alertaDiv = document.createElement("div");
    alertaDiv.classList.add("alerta");

    // Establecer el mensaje
    const textoDiv = document.createElement("div");
    textoDiv.classList.add("texto");
    textoDiv.textContent = mensaje;

    // Establecer color de fondo personalizado si se pasa un color
    alertaDiv.style.backgroundColor = color;

    // Crear el botón de cerrar
    const btnCerrar = document.createElement("button");
    btnCerrar.classList.add("btn-cerrar");
    btnCerrar.innerHTML = '&times;';
    btnCerrar.addEventListener("click", () => {
        alertaDiv.classList.remove("mostrar");
        alertaDiv.classList.add("ocultar");
        setTimeout(() => {
            alertaDiv.remove();
        }, 500); // Retirar el div después de la animación
    });

    // Crear icono (opcional, si lo deseas)
    const iconoDiv = document.createElement("div");
    iconoDiv.classList.add("icono");
    iconoDiv.innerHTML = "&#x1F4A1;"; // Icono de bombilla

    // Agregar los elementos a la alerta
    alertaDiv.appendChild(iconoDiv);
    alertaDiv.appendChild(textoDiv);
    alertaDiv.appendChild(btnCerrar);

    // Añadir la alerta al body
    document.body.appendChild(alertaDiv);

    // Mostrar la alerta con la clase de animación
    setTimeout(() => {
        alertaDiv.classList.add("mostrar");
    }, 10); // Espera un poco antes de iniciar la animación

    // Ocultar la alerta después de 3 segundos
    setTimeout(() => {
        alertaDiv.classList.remove("mostrar");
        alertaDiv.classList.add("ocultar");
        setTimeout(() => {
            alertaDiv.remove();
        }, 500); // Eliminar el div después de la animación
    }, 3000); // Duración de la alerta
}
