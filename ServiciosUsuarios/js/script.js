// Obtén el JWT (esto depende de cómo obtengas el token, por ejemplo, desde localStorage o cookies)
const jwtToken = localStorage.getItem('jwt'); // O ajusta la forma en que obtienes el JWT

function obtenerServicios() {
    const usuarioId = localStorage.getItem('userId'); // ID del usuario, puede ser dinámico según el contexto (como `localStorage.getItem('userId')`)
    const url = 'http://localhost:8080/usuarios/id';

    const body = JSON.stringify({ id: usuarioId });
    const jwtToken = localStorage.getItem('jwt'); // Asegúrate de obtener el JWT correctamente

    // Verifica si no hay to

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}` // Asegúrate de enviar el token JWT en la cabecera
    };

    fetch(url, {
        method: 'POST',
        headers: headers,
        body: body
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 403) {
                alert('Acceso denegado. Verifica tu autenticación y permisos.');
            } else {
                alert('Error al obtener los datos. Código de error: ' + response.status);
            }
            throw new Error(`HTTP Error: ${response.status}`);
        }
        return response.json(); // Procesar la respuesta como JSON
    })
    .then(data => {
        const servicios = data.vehiculos.flatMap(vehiculo => vehiculo.servicios);
        llenarTabla(servicios); // Llenar la tabla con los datos
    })
    .catch(error => {
        console.error('Error al obtener los datos:', error);
        alert('Hubo un error al obtener los datos.');
    });
}


// Función para llenar la tabla con los datos de los servicios
function llenarTabla(servicios) {
    const tablaCuerpo = document.getElementById('serviciosTableBody');
    tablaCuerpo.innerHTML = ''; // Limpiar la tabla antes de llenarla

    // Iterar sobre los servicios y crear las filas de la tabla
    servicios.forEach(servicio => {
        const fila = document.createElement('tr');

        // Nombre del servicio
        const tdNombre = document.createElement('td');
        tdNombre.textContent = servicio.nombre;
        fila.appendChild(tdNombre);

        // Descripción
        const tdDescripcion = document.createElement('td');
        tdDescripcion.textContent = servicio.descripcion;
        fila.appendChild(tdDescripcion);

        // Categoría
        const tdCategoria = document.createElement('td');
        tdCategoria.textContent = servicio.categoria.nombre;
        fila.appendChild(tdCategoria);

        // Estado
        const tdEstado = document.createElement('td');
        tdEstado.textContent = servicio.status ? 'Activo' : 'No Activo';
        fila.appendChild(tdEstado);

        // Agregar la fila a la tabla
        tablaCuerpo.appendChild(fila);
    });
}

// Filtrar la tabla según el nombre y el estado seleccionado
document.getElementById('filterName').addEventListener('input', filtrarTabla);
document.getElementById('filterState').addEventListener('change', filtrarTabla);

function filtrarTabla() {
    const nombreFiltro = document.getElementById('filterName').value.toLowerCase();
    const estadoFiltro = document.getElementById('filterState').value;

    const filas = document.getElementById('serviciosTableBody').getElementsByTagName('tr');
    
    Array.from(filas).forEach(fila => {
        const nombreServicio = fila.cells[0].textContent.toLowerCase();
        const estadoServicio = fila.cells[3].textContent.toLowerCase();
        
        // Comprobar si la fila debe mostrarse
        const mostrarPorNombre = nombreServicio.includes(nombreFiltro);
        const mostrarPorEstado = estadoFiltro === '' || estadoServicio.includes(estadoFiltro.toLowerCase());
        
        if (mostrarPorNombre && mostrarPorEstado) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    });
}

// Llamar a la función para obtener y mostrar los servicios cuando se cargue la página
window.onload = function() {
    obtenerServicios();
};
