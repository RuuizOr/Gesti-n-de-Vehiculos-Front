document.addEventListener('DOMContentLoaded', function () {
    // Selecciona el botón
    const btnIngresar = document.getElementById('btnIngresar');

    // Agrega el evento click al botón
    btnIngresar.addEventListener('click', function () {
        // Redirige a la página deseada
        window.location.href = '../../InicioAdmin/InicioAdmin.html';
    });
});
