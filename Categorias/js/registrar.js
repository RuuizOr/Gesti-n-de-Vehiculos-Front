// Función para registrar una nueva categoría de servicio
async function registrarCategoria() {
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
  
    // Verificar si los campos están vacíos
    if (!nombre || !descripcion) {
      mostrarToast('Por favor, complete todos los campos.', '#f44336'); // Error en rojo
      return;
    }
  
    // Obtener el token JWT desde localStorage
    const token = localStorage.getItem('jwt');
    if (!token) {
      console.log('No se encontró el token en el localStorage');
      mostrarToast('No se encontró el token. Por favor, inicie sesión.', '#f44336'); // Error en rojo
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
      mostrarToast('Categoría registrada exitosamente.', '#4caf50'); // Éxito en verde
  
      // Limpiar el formulario después de registrar
      document.getElementById('formRegistrarCategoria').reset();
  
      // Cerrar el modal
      $('#registrarServicio').modal('hide');
  
      // Opcional: Si deseas actualizar la lista de categorías después de registrar
      obtenerCategorias();
  
    } catch (error) {
      console.error('Hubo un problema con la solicitud:', error);
      mostrarToast('Ocurrió un error al registrar la categoría.', '#f44336'); // Error en rojo
    }
  }
  
  // Agregar el evento para el formulario de registro
  document.getElementById('formRegistrarCategoria').addEventListener('submit', (event) => {
    event.preventDefault();  // Prevenir el envío normal del formulario
    registrarCategoria();    // Llamar a la función para registrar la categoría
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
  