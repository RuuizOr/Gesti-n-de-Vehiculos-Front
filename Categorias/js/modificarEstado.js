document.addEventListener('DOMContentLoaded', () => {
    const formModificarEstado = document.getElementById('formModificarEstadoCate');
    const modalModificarEstado = document.getElementById('modificarEstadoServicio');

    // Listener para abrir el modal y prellenar los campos ocultos
    document.addEventListener('click', (event) => {
        const button = event.target.closest('.btn-success, .btn-danger');
        if (button) {
            const id = button.getAttribute('data-id');
            const estadoActual = button.getAttribute('data-estado') === 'true';
            const nuevoEstado = !estadoActual;

            document.getElementById('idCategoria').value = id;
            document.getElementById('estadoCategoria').value = nuevoEstado;

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

        const id = document.getElementById('idCategoria').value;
        const estado = document.getElementById('estadoCategoria').value === 'true'; // Convertir a booleano

        const payload = { id, status: estado };

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

            $(modalModificarEstado).modal('hide');
            limpiarModal();

            // Recargar las categorías para reflejar los cambios
            obtenerCategorias();
        } catch (error) {
            console.error('Error al intentar cambiar el estado:', error);
            mostrarToast('Ocurrió un error al intentar cambiar el estado.', '#f44336');  // Error en rojo
        }
    });
});

// Función para limpiar el modal y evitar residuos de fondos o backdrop
function limpiarModal() {
    document.body.classList.remove('modal-open');
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
        backdrop.remove();
    }
}

// Función para mostrar el mensaje tipo toast
// Función para mostrar el mensaje tipo toast
function mostrarToast(mensaje, tipo = 'success') {
    const alertaDiv = document.createElement("div");
    alertaDiv.classList.add("alerta");

    const textoDiv = document.createElement("div");
    textoDiv.classList.add("texto");
    textoDiv.textContent = mensaje;

    // Cambiar el color a azul tanto para el éxito como para el error
    const color = tipo === 'success' ? "#092e95" : "#092e95";  // Azul para éxito y error
    alertaDiv.style.backgroundColor = color;

    const btnCerrar = document.createElement("button");
    btnCerrar.classList.add("btn-cerrar");
    btnCerrar.innerHTML = '&times;';
    btnCerrar.addEventListener("click", () => {
        alertaDiv.classList.remove("mostrar");
        alertaDiv.classList.add("ocultar");
        setTimeout(() => alertaDiv.remove(), 500);
    });

    const iconoDiv = document.createElement("div");
    iconoDiv.classList.add("icono");
    iconoDiv.innerHTML = '&#x1F698;';  // Ícono de vehículo (carrito)
    iconoDiv.style.color = color;

    alertaDiv.appendChild(iconoDiv);
    alertaDiv.appendChild(textoDiv);
    alertaDiv.appendChild(btnCerrar);

    document.body.appendChild(alertaDiv);

    setTimeout(() => alertaDiv.classList.add("mostrar"), 10);

    setTimeout(() => {
        alertaDiv.classList.remove("mostrar");
        alertaDiv.classList.add("ocultar");
        setTimeout(() => alertaDiv.remove(), 500);
    }, 3000);
}
