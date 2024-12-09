// Función para cambiar el estado de un vehículo
async function cambiarEstadoVehiculo(event) {
    event.preventDefault();

    const API_URL = "http://localhost:8080/vehiculos/cambiar-estado";
    const token = localStorage.getItem('jwt');

    if (!token) {
        alert('No se encontró el token. Por favor, inicie sesión.');
        return;
    }

    const id = document.getElementById("idServicio").value;
    const status = document.getElementById("estadoServicio").value === "true";

    try {
        const response = await fetch(`${API_URL}/${id}?status=${!status}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert('Estado del vehículo actualizado correctamente.');
            $('#modificarEstadoServicio').modal('hide');
            cargarVehiculos(); // Recargar la tabla
        } else {
            alert('Error al actualizar el estado del vehículo.');
        }
    } catch (error) {
        console.error('Error al cambiar el estado del vehículo:', error);
    }
}

// Agregar evento al formulario de cambio de estado
document.getElementById("formModificarEstado").addEventListener("submit", cambiarEstadoVehiculo);
