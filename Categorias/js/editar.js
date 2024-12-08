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

    // Obtener el token JWT desde localStorage
    const token = localStorage.getItem('jwt');
    if (!token) {
        alert('No se encontró el token. Por favor, inicie sesión.');
        return;
    }

    // URL de la API
    const url = 'http://localhost:8080/CategoriasDeServicios/actualizar';

    // Obtener los datos del formulario
    const idCategoria = document.getElementById('idMod').value.trim();
    const nombreCategoria = document.getElementById('nombreMod').value.trim();
    const descripcionCategoria = document.getElementById('descripcionMod').value.trim();

    // Crear el objeto de categoría
    const categoria = {
        id: idCategoria,
        nombre: nombreCategoria,
        descripcion: descripcionCategoria
    };

    try {
        // Realizar la solicitud PUT con el token en el encabezado
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
            alert('Categoría actualizada exitosamente');
            // Opcional: cerrar el modal y limpiar el formulario
            $('#modificarCategoria').modal('hide');
            document.getElementById('formModificarCategoria').reset();
            // Recargar o actualizar la lista de categorías
            obtenerCategorias();
        } else {
            const errorData = await response.json();
            alert('Error al actualizar la categoría: ' + (errorData.message || 'Verifique los datos ingresados'));
        }
    } catch (error) {
        alert('Ocurrió un error al intentar actualizar la categoría.');
    }
}

// Agregar el evento al formulario
document.getElementById('formModificarCategoria').addEventListener('submit', actualizarCategoria);
