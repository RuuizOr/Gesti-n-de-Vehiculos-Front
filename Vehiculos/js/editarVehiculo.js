// Función para editar un vehículo
async function editarVehiculo(event) {
    event.preventDefault();

    const API_URL = "http://localhost:8080/vehiculos/actualizar";
    const token = localStorage.getItem('jwt');

    if (!token) {
        alert('No se encontró el token. Por favor, inicie sesión.');
        return;
    }

    const id = document.getElementById("idMod").value;
    const modelo = document.getElementById("modeloMod").value.trim();
    const marca = document.getElementById("marcaMod").value.trim();
    const color = document.getElementById("colorMod").value.trim();

    if (!id || !modelo || !marca || !color) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, modelo, marca, color, status: true })
        });

        if (response.ok) {
            alert('Vehículo modificado exitosamente');
            $('#modificarVehiculo').modal('hide');
            cargarVehiculos(); // Recargar la tabla
        } else {
            alert('Error al modificar el vehículo.');
        }
    } catch (error) {
        console.error('Error al modificar el vehículo:', error);
    }
}

// Agregar evento al formulario de edición
document.getElementById('formModificarVehiculo').addEventListener('submit', editarVehiculo);
