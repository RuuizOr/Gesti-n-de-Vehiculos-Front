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
            username: email,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.jwt) {
            
            localStorage.setItem('jwt', data.jwt);
            localStorage.setItem('userId', data.userId);
            
            window.location.href = '../../InicioAdmin/InicioAdmin.html';
        } else {
            alert('Credenciales incorrectas');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        
        alert('Correo o Contraseña no valida');
    });
}
//no tocar si no sabes que pedo!!
