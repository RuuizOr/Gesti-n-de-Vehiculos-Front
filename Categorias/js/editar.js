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
        mostrarToast('No se encontró el token. Por favor, inicie sesión.', '#f44336');  // Error en rojo
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
            mostrarToast('Categoría actualizada exitosamente', '#4caf50');  // Éxito en verde
            // Opcional: cerrar el modal y limpiar el formulario
            $('#modificarCategoria').modal('hide');
            document.getElementById('formModificarCategoria').reset();
            // Recargar o actualizar la lista de categorías
            obtenerCategorias();
        } else {
            const errorData = await response.json();
            mostrarToast('Error al actualizar la categoría: ' + (errorData.message || 'Verifique los datos ingresados'), '#f44336');  // Error en rojo
        }
    } catch (error) {
        mostrarToast('Ocurrió un error al intentar actualizar la categoría.', '#f44336');  // Error en rojo
    }
}

// Agregar el evento al formulario
document.getElementById('formModificarCategoria').addEventListener('submit', actualizarCategoria);

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
