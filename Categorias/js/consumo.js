async function obtenerCategorias() {
    // Obtener el token JWT desde localStorage
    const token = localStorage.getItem('jwt');
    console.log("Token JWT obtenido:", token);

    // Verificar si el token existe
    if (!token) {
        console.log('No se encontró el token en el localStorage');
        mostrarToast('No se encontró el token. Por favor, inicie sesión.', '#f44336');  // Error en rojo
        return;
    }

    const url = 'http://localhost:8080/CategoriasDeServicios/all'; // URL de la API

    try {
        // Realizar la solicitud GET con el token en el encabezado
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Incluir el token en el encabezado
                'Accept': 'application/json',         // Aceptar respuesta en formato JSON
                'Content-Type': 'application/json'    // Especificar que enviamos/recibimos JSON
            }
        });

        // Verificar si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error('Error en la red: ' + response.statusText);
        }

        // Convertir la respuesta a JSON
        const data = await response.json();

        // Mostrar los datos recibidos en la consola
        console.log('Datos recibidos:', data);

        // Obtener el cuerpo de la tabla
        const tableBody = document.getElementById('aspirantesTableBody');

        // Limpiar cualquier contenido previo en la tabla
        tableBody.innerHTML = '';

        // Recorrer los datos y crear las filas de la tabla
        data.result.forEach(categoria => {
            console.log(categoria); // Verificar los datos de cada categoría

            // Asegurarnos de que estado sea booleano
            const estadoActivo = categoria.status === true; // Verificar si es verdadero

            // Determinar el estado del botón (activo/inactivo) y la clase correspondiente
            const estadoClase = estadoActivo ? 'btn-success' : 'btn-danger';
            const estadoTexto = estadoActivo ? 'Activo' : 'Inactivo';

            const row = `
                <tr align="center">
                    <td>${categoria.nombre}</td>
                    <td>${categoria.descripcion}</td>
                    <td>
                        <button class="btn btn-sm ${estadoClase}"
                            data-id="${categoria.id}" 
                            data-estado="${categoria.status}" 
                            data-toggle="modal" 
                            data-target="#modificarEstadoServicio">
                            <i class="fas fa-sync-alt"></i> ${estadoTexto}
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-primary btnIcono"
                            data-id="${categoria.id}" 
                            data-nombre="${categoria.nombre}" 
                            data-descripcion="${categoria.descripcion}" 
                            data-toggle="modal" 
                            data-target="#modificarCategoria">
                            <i class="fas fa-edit"></i>
                        </button>
                    </td>
                </tr>
            `;

            // Insertar la fila en la tabla
            tableBody.innerHTML += row;
        });

        // Configurar los filtros
        configurarFiltros();

        // Mostrar mensaje de éxito
        mostrarToast('Categorías cargadas correctamente.', '#092e95'); // Azul para éxito

    } catch (error) {
        // Manejar errores de la solicitud
        console.error('Hubo un problema con la solicitud:', error);
        mostrarToast('Ocurrió un error al intentar obtener los datos.', '#f44336');  // Error en rojo
    }
}

function configurarFiltros() {
    const filterName = document.getElementById('filterName');
    const filterState = document.getElementById('filterState');

    filterName.addEventListener('input', aplicarFiltros);
    filterState.addEventListener('change', aplicarFiltros);
}

function aplicarFiltros() {
    const filterName = document.getElementById('filterName').value.toLowerCase();
    const filterState = document.getElementById('filterState').value.toLowerCase();

    const filas = document.querySelectorAll('#aspirantesTableBody tr');
    filas.forEach(fila => {
        const nombre = fila.children[0].textContent.toLowerCase();
        const estado = fila.children[2].textContent.trim().toLowerCase(); // Aseguramos trim para eliminar espacios

        const coincideNombre = !filterName || nombre.includes(filterName);
        const coincideEstado = !filterState || estado === filterState; // Comparación exacta

        if (coincideNombre && coincideEstado) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    });
}

// Llamar la función para obtener los datos cuando la página carga
obtenerCategorias();

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

    // Crear icono (carrito)
    const iconoDiv = document.createElement("div");
    iconoDiv.classList.add("icono");
    iconoDiv.innerHTML = "&#x1F698;"; // Icono de carrito

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
