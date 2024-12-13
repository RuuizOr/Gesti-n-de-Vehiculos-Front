// Función para decodificar el JWT y obtener el usuario ID
const jwtToken = localStorage.getItem('jwt');
console.log("Token JWT obtenido:", jwtToken);

const usuarioId = localStorage.getItem('userId'); // ID del usuario, puede ser dinámico según el contexto (como `localStorage.getItem('userId')`)


// Función para obtener los vehículos del usuario
function obtenerVehiculos() {
    if (!usuarioId) {
        alert("No se pudo obtener el ID del usuario desde el token.");
        return;
    }

    const url = 'http://localhost:8080/usuarios/id';  // URL de la API para obtener el usuario y sus vehículos

    // Cuerpo de la petición
    const body = JSON.stringify({ id: usuarioId });

    // Configuración de la petición
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
    };

    // Realizar la petición POST
    fetch(url, {
        method: 'POST',
        headers: headers,
        body: body
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        return response.json();  // Procesar la respuesta como JSON
    })
    .then(data => {
        // Llenar la tabla con los vehículos obtenidos
        const vehiculos = data.vehiculos;  // Obtener los vehículos de la respuesta
        llenarTablaVehiculos(vehiculos);
    })
    .catch(error => {
        console.error('Error al obtener los datos:', error);
        alert('Hubo un error al obtener los datos de los vehículos. Verifica tu conexión o el token de autenticación.');
    });
}

// Función para llenar la tabla con los datos de los vehículos
function llenarTablaVehiculos(vehiculos) {
    const tablaCuerpo = document.getElementById('vehiculosTableBody');
    tablaCuerpo.innerHTML = '';  // Limpiar la tabla antes de llenarla

    // Iterar sobre los vehículos y crear las filas de la tabla
    vehiculos.forEach(vehiculo => {
        const fila = document.createElement('tr');

        // Modelo
        const tdModelo = document.createElement('td');
        tdModelo.textContent = vehiculo.modelo;
        fila.appendChild(tdModelo);

        // Marca
        const tdMarca = document.createElement('td');
        tdMarca.textContent = vehiculo.marca;
        fila.appendChild(tdMarca);

        // Color
        const tdColor = document.createElement('td');
        tdColor.textContent = vehiculo.color;
        fila.appendChild(tdColor);

        // Estado
        const tdEstado = document.createElement('td');
        tdEstado.textContent = vehiculo.status ? 'Activo' : 'No Activo';
        fila.appendChild(tdEstado);

        // Agregar la fila a la tabla
        tablaCuerpo.appendChild(fila);
    });
}

// Filtrar la tabla según el nombre y el estado seleccionado
document.getElementById('filterName').addEventListener('input', filtrarTablaVehiculos);
document.getElementById('filterState').addEventListener('change', filtrarTablaVehiculos);

function filtrarTablaVehiculos() {
    const nombreFiltro = document.getElementById('filterName').value.toLowerCase();
    const estadoFiltro = document.getElementById('filterState').value;

    const filas = document.getElementById('vehiculosTableBody').getElementsByTagName('tr');
    
    Array.from(filas).forEach(fila => {
        const nombreVehiculo = fila.cells[0].textContent.toLowerCase(); // Modelo
        const estadoVehiculo = fila.cells[3].textContent.toLowerCase(); // Estado
        
        // Comprobar si la fila debe mostrarse
        const mostrarPorNombre = nombreVehiculo.includes(nombreFiltro);
        const mostrarPorEstado = estadoFiltro === '' || estadoVehiculo.includes(estadoFiltro.toLowerCase());
        
        if (mostrarPorNombre && mostrarPorEstado) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    });
}

// Llamar a la función para obtener y mostrar los vehículos cuando se cargue la página
window.onload = function() {
    obtenerVehiculos();
};
