// Función para registrar una nueva categoría de servicio
async function registrarCategoria() {
  const nombre = document.getElementById('nombre').value;
  const descripcion = document.getElementById('descripcion').value;

  // Verificar si los campos están vacíos
  if (!nombre || !descripcion) {
      alert('Por favor, complete todos los campos.');
      return;
  }

  // Obtener el token JWT desde localStorage
  const token = localStorage.getItem('jwt');
  if (!token) {
      console.log('No se encontró el token en el localStorage');
      alert('No se encontró el token. Por favor, inicie sesión.');
      return;
  }

  // Crear el objeto que se enviará al backend, incluyendo el estado activo (true)
  const categoriaData = {
      nombre: nombre,
      descripcion: descripcion,
      estado: true  // Estado activo
  };

  const url = 'http://localhost:8080/CategoriasDeServicios/save';  // URL del endpoint

  try {
      // Realizar la solicitud POST con el token en el encabezado y los datos de la categoría
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${token}`, // Incluir el token en el encabezado
              'Accept': 'application/json',         // Aceptar respuesta en formato JSON
              'Content-Type': 'application/json'    // Especificar que enviamos/recibimos JSON
          },
          body: JSON.stringify(categoriaData) // Enviar los datos en formato JSON
      });

      // Verificar si la respuesta fue exitosa
      if (!response.ok) {
          throw new Error('Error al registrar la categoría: ' + response.statusText);
      }

      // Mostrar mensaje de éxito
      alert('Categoría registrada exitosamente.');

      // Limpiar el formulario después de registrar
      document.getElementById('formRegistrarCategoria').reset();

      // Cerrar el modal
      $('#registrarServicio').modal('hide');

      // Opcional: Si deseas actualizar la lista de categorías después de registrar
      obtenerCategorias();

  } catch (error) {
      console.error('Hubo un problema con la solicitud:', error);
      alert('Ocurrió un error al registrar la categoría.');
  }
}

// Agregar el evento para el formulario de registro
document.getElementById('formRegistrarCategoria').addEventListener('submit', (event) => {
  event.preventDefault();  // Prevenir el envío normal del formulario
  registrarCategoria();    // Llamar a la función para registrar la categoría
});
