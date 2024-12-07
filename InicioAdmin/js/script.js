// Modificar usuario
const formModificarUsuario = document.querySelector("#formModificarUsuario");
formModificarUsuario.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = document.getElementById("idUsuario").value;
    const usuarioData = {
        nombre: document.getElementById("nombreMod").value.trim(),
        apellidos: document.getElementById("apellidosMod").value.trim(),
        email: document.getElementById("emailMod").value.trim(),
        telefono: document.getElementById("telefonoMod").value.trim(),
        contraseña: document.getElementById("contrasenaMod").value.trim(),
        rol: document.getElementById("rolMod").value.trim(),
    };

    try {
        const response = await fetch(`http://localhost:8080/usuarios/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuarioData),
        });

        if (response.ok) {
            $('#modificarUsuario').modal("hide");
            cargarUsuarios();
        } else {
            console.error("Error al modificar usuario:", await response.text());
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
});