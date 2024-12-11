// Función para registrar una nueva categoría de servicio
async function registrarCategoria() {
  const nombre = document.getElementById('nombre').value;
  const descripcion = document.getElementById('descripcion').value;

  // Verificar si los campos están vacíos
  if (!nombre || !descripcion) {
    mostrarToast('Por favor, complete todos los campos.', '#092e95'); // Azul en lugar de rojo
    return;
  }

  // Obtener el token JWT desde localStorage
  const token = localStorage.getItem('jwt');
  if (!token) {
    console.log('No se encontró el token en el localStorage');
    mostrarToast('No se encontró el token. Por favor, inicie sesión.', '#092e95'); // Azul en lugar de rojo
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
      const errorMessage = await response.text(); // Captura el mensaje del servidor si existe
      throw new Error('Error al registrar la categoría: ' + errorMessage);
    }

    // Mostrar mensaje de éxito
    mostrarToast('Categoría registrada exitosamente.', '#092e95'); // Azul en lugar de verde

    // Limpiar el formulario después de registrar
    document.getElementById('formRegistrarCategoria').reset();

    // Cerrar el modal
    $('#registrarServicio').modal('hide');

    // Opcional: Si deseas actualizar la lista de categorías después de registrar
    obtenerCategorias();

  } catch (error) {
    console.error('Hubo un problema con la solicitud:', error);
    mostrarToast('Ocurrió un error al registrar la categoría.', '#092e95'); // Azul en lugar de rojo
  }
}

// Agregar el evento para el formulario de registro
document.getElementById('formRegistrarCategoria').addEventListener('submit', (event) => {
  event.preventDefault();  // Prevenir el envío normal del formulario
  registrarCategoria();    // Llamar a la función para registrar la categoría
});

// Función para mostrar el mensaje tipo toast
function mostrarToast(mensaje, color = '#092e95') {
  const alertaDiv = document.createElement("div");
  alertaDiv.classList.add("alerta");

  const textoDiv = document.createElement("div");
  textoDiv.classList.add("texto");
  textoDiv.textContent = mensaje;

  // Establecer color de fondo en azul
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