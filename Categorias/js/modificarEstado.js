
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
            alert('No se encontró el token. Por favor, inicie sesión.');
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
            alert('Estado actualizado correctamente.');

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
            alert('Ocurrió un error al intentar cambiar el estado.');
        }
    });
});