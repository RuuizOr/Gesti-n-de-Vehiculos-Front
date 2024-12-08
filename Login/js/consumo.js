// Obtener el JWT de localStorage
document.getElementById('btnIngresar').addEventListener('click', login);

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('Por favor ingresa ambos campos');
        return;
    }

    // Hacer la petición POST al servidor
    fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,         // Cambiado 'username' por 'email'
            contraseña: password  // Cambiado 'password' por 'contraseña'
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.type === 'SUCCESS') {
            // Guardar toda la información de 'result' en localStorage
            localStorage.setItem('userData', JSON.stringify(data.result)); // Guarda solo el objeto 'result'
            
            // También puedes guardar datos específicos si lo prefieres
            localStorage.setItem('jwt', data.result.jwt);
            localStorage.setItem('userId', data.result.userId);
            localStorage.setItem('username', data.result.username);
            localStorage.setItem('admin', data.result.admin);
            localStorage.setItem('expiration', data.result.expiration);

            // Verificar el rol del usuario y redirigir según corresponda
            if (data.result.admin === 'ROLE_ADMIN') {
                // Si el rol es admin, redirigir a la página de inicio de admin
                window.location.href = '../../InicioAdmin/InicioAdmin.html';
            } else if(data.result.admin === "ROLE_USER") {
                // Si no es admin, redirigir a otra ruta (que definirás más tarde)
                window.location.href = '../../InicioUsuarioNormal/InicioUsuarioNormal.html';  // Cambiar esto por la ruta deseada
            }
        } else {
            alert('Credenciales incorrectas');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Correo o Contraseña no válida');
    });
}
