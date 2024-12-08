




//  ///////////////////
//NOTA: ya funciona
///////////////////////7
// ////////////////////////
async function actualizarCategoria(event) {
    event.preventDefault();  // Evita que el formulario recargue la página

    // Obtener los valores del formulario
    const nombre = document.getElementById('nombreCategoria').value;
    const descripcion = document.getElementById('descripcionCategoria').value;
    const categoriaId = document.getElementById('categoriaId').value; // El ID de la categoría a actualizar
    const token = localStorage.getItem('jwt'); // Obtener el token del localStorage

    // Verificar si el token existe
    if (!token) {
        console.log('No se encontró el token en el localStorage');
        alert('No se encontró el token. Por favor, inicie sesión.');
        return;
    }

    // Crear el objeto de datos para enviar (incluyendo el id)
    const categoria = {
        id: categoriaId,          // Incluimos el id en el cuerpo del JSON
        nombre: nombre,
        descripcion: descripcion
    };

    // URL de la API para actualizar la categoría
    const url = 'http://localhost:8080/CategoriasDeServicios/update';  // URL de la API sin el ID en la ruta

    try {
        // Realizar la solicitud PUT con el token en el encabezado
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,  // Incluir el token en el encabezado
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoria)  // Convertir el objeto de categoría a JSON
        });

        // Verificar si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error('Error en la red: ' + response.statusText);
        }

        // Convertir la respuesta a JSON
        const data = await response.json();
        console.log('Categoría actualizada:', data);

        // Informar al usuario que la categoría fue actualizada con éxito
        alert('Categoría actualizada exitosamente.');

        // Limpiar el formulario después de la actualización
        document.getElementById('formActualizarCategoria').reset();

    } catch (error) {
        // Manejar errores de la solicitud
        console.error('Hubo un problema con la solicitud:', error);
        alert('Ocurrió un error al intentar actualizar la categoría.');
    }
}

// Asignar la función al evento submit del formulario
document.getElementById('formActualizarCategoria').addEventListener('submit', actualizarCategoria);
