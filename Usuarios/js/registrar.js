document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#registrarServicio form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Evitar la recarga de la página
        
        const nombre = document.querySelector("#nombre").value.trim();
        const descripcion = document.querySelector("#descripcion").value.trim(); 

        if (nombre && descripcion) {
            try {
                const response = await fetch("http://localhost:8080/CategoriasDeServicios/save", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nombre,
                        descripcion,
                    }),
                });

                if (response.ok) {
                    const result = await response.json();
                    alert(`Servicio registrado: ${JSON.stringify(result)}`);
                    form.reset(); // Limpia el formulario
                    $('#registrarServicio').modal('hide'); // Cierra el modal (si usas Bootstrap)
                } else {
                    alert("Error al registrar el servicio. Verifique los datos.");
                }
            } catch (error) {
                console.error("Error en la solicitud:", error);
                alert("Hubo un problema al conectar con el servidor.");
            }
        } else {
            alert("Por favor, complete todos los campos.");
        }
    });
});
