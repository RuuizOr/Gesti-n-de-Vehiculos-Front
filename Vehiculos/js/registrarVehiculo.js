// Función para registrar un vehículo
async function registrarVehiculo(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Obtener el token JWT desde localStorage
    const token = localStorage.getItem('jwt');
    console.log("Token JWT obtenido:", token);

    // Verificar si el token existe
    if (!token) {
        console.log('No se encontró el token en el localStorage');
        alert('No se encontró el token. Por favor, inicie sesión.');
        return;
    }

    // URL de la API
    const url = 'http://localhost:8080/vehiculos/registrar';

    // Obtener los datos del formulario
    const modelo = document.getElementById('modelo').value.trim();
    const marca = document.getElementById('marca').value.trim();
    const color = document.getElementById('color').value.trim();

    // Validar que los campos no estén vacíos
    if (!modelo || !marca || !color) {
        alert('Por favor, complete todos los campos del formulario.');
        return;
    }

    // Crear el objeto del vehículo
    const vehiculo = {
        modelo: modelo,
        marca: marca,
        color: color,
        status: true
    };

    try {
        // Realizar la solicitud POST con el token en el encabezado
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Incluir el token en el encabezado
                'Accept': 'application/json',       // Aceptar respuesta en formato JSON
                'Content-Type': 'application/json'  // Enviar datos en formato JSON
            },
            body: JSON.stringify(vehiculo)         // Convertir el objeto a JSON
        });

        // Manejo de la respuesta
        if (response.ok) {
            const data = await response.json();
            console.log('Vehículo registrado exitosamente:', data);
            alert('Vehículo registrado exitosamente');
            // Opcional: cerrar el modal y limpiar el formulario
            $('#registrarVehiculo').modal('hide');
            document.getElementById('formRegistrarVehiculo').reset();
            // Recargar o actualizar la lista de vehículos si es necesario
            if (typeof cargarVehiculos === 'function') {
                cargarVehiculos();
            }
        } else {
            const errorData = await response.json();
            console.error('Error al registrar el vehículo:', errorData);
            alert('Error al registrar el vehículo: ' + errorData.message || 'Verifique los datos ingresados');
        }
    } catch (error) {
        console.error('Hubo un problema con la solicitud:', error);
        alert('Ocurrió un error al intentar registrar el vehículo.');
    }
}

// Agregar un evento al formulario para ejecutar la función de registro
document.getElementById('formRegistrarVehiculo').addEventListener('submit', registrarVehiculo);
