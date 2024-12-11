$(document).ready(function () {
    const formModificarEstado = $('#formModificarEstadoCate');
    const modalModificarEstado = $('#modificarEstadoServicio');

    $(document).on('click', '.btn-success, .btn-danger', function () {
        const button = $(this);
        const id = button.data('id');
        const estadoActual = button.data('estado') === true;
        const nuevoEstado = !estadoActual;

        $('#idCategoria').val(id);
        $('#estadoCategoria').val(nuevoEstado);

        modalModificarEstado.modal('show');
    });

    formModificarEstado.on('submit', async function (event) {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

        const token = localStorage.getItem('jwt');
        if (!token) {
            mostrarToast('No se encontró el token. Por favor, inicie sesión.', '#f44336');
            return;
        }

        const url = 'http://localhost:8080/CategoriasDeServicios/status';
        const id = $('#idCategoria').val();
        const estado = $('#estadoCategoria').val() === 'true';

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

            mostrarToast('Estado actualizado correctamente.', '#4caf50');
            modalModificarEstado.modal('hide');
            limpiarModal();
            obtenerCategorias();
        } catch (error) {
            console.error('Error al intentar cambiar el estado:', error);
            mostrarToast('Ocurrió un error al intentar cambiar el estado.', '#f44336');
        }
    });

    function limpiarModal() {
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
    }

    function mostrarToast(mensaje, tipo = 'success') {
        const alertaDiv = $('<div>').addClass('alerta').css('backgroundColor', tipo === 'success' ? '#092e95' : '#092e95');
        const textoDiv = $('<div>').addClass('texto').text(mensaje);
        const btnCerrar = $('<button>').addClass('btn-cerrar').html('&times;').on('click', function () {
            alertaDiv.removeClass('mostrar').addClass('ocultar');
            setTimeout(() => alertaDiv.remove(), 500);
        });
        const iconoDiv = $('<div>').addClass('icono').html('&#x1F698;').css('color', '#092e95');

        alertaDiv.append(iconoDiv, textoDiv, btnCerrar);
        $('body').append(alertaDiv);

        setTimeout(() => alertaDiv.addClass('mostrar'), 10);
        setTimeout(() => {
            alertaDiv.removeClass('mostrar').addClass('ocultar');
            setTimeout(() => alertaDiv.remove(), 500);
        }, 3000);
    }
});
