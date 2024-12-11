$(document).ready(function () {
    $('#modificarCategoria').on('show.bs.modal', function (event) {
        const button = $(event.relatedTarget); // Botón que activó el modal

        // Capturar los datos del botón
        const id = button.data('id') || '';
        const nombre = button.data('nombre') || '';
        const descripcion = button.data('descripcion') || '';

        // Asignar los valores a los campos del formulario
        $('#idMod').val(id);
        $('#nombreMod').val(nombre);
        $('#descripcionMod').val(descripcion);
    });

    // Función para actualizar la categoría
    async function actualizarCategoria(event) {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

        const token = localStorage.getItem('jwt');
        if (!token) {
            mostrarToast('No se encontró el token. Por favor, inicie sesión.', 'error'); // Error en rojo
            return;
        }

        const url = 'http://localhost:8080/CategoriasDeServicios/actualizar';

        const idCategoria = $('#idMod').val().trim();
        const nombreCategoria = $('#nombreMod').val().trim();
        const descripcionCategoria = $('#descripcionMod').val().trim();

        const categoria = {
            id: idCategoria,
            nombre: nombreCategoria,
            descripcion: descripcionCategoria
        };

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoria)
            });

            if (response.ok) {
                const data = await response.json();
                mostrarToast('Categoría actualizada exitosamente', 'success');
                $('#modificarCategoria').modal('hide');
                $('#formModificarCategoria')[0].reset();
                obtenerCategorias();
            } else {
                const errorData = await response.json();
                mostrarToast('Error al actualizar la categoría: ' + (errorData.message || 'Verifique los datos ingresados'), 'error');
            }
        } catch (error) {
            mostrarToast('Ocurrió un error al intentar actualizar la categoría.', 'error');
        }
    }

    // Agregar el evento al formulario
    $('#formModificarCategoria').on('submit', actualizarCategoria);

    // Función para mostrar el mensaje tipo toast
    function mostrarToast(mensaje, tipo = 'success') {
        const alertaDiv = $('<div>').addClass('alerta').css('backgroundColor', tipo === 'success' ? '#092e95' : '#f44336');
        const textoDiv = $('<div>').addClass('texto').text(mensaje);
        const btnCerrar = $('<button>').addClass('btn-cerrar').html('&times;').on('click', function () {
            alertaDiv.removeClass('mostrar').addClass('ocultar');
            setTimeout(() => alertaDiv.remove(), 500);
        });
        const iconoDiv = $('<div>').addClass('icono').html('&#x1F698;').css('color', tipo === 'success' ? '#092e95' : '#f44336');

        alertaDiv.append(iconoDiv, textoDiv, btnCerrar);
        $('body').append(alertaDiv);

        setTimeout(() => alertaDiv.addClass('mostrar'), 10);
        setTimeout(() => {
            alertaDiv.removeClass('mostrar').addClass('ocultar');
            setTimeout(() => alertaDiv.remove(), 500);
        }, 3000);
    }
});
