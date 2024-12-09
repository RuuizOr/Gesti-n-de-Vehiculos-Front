// Obtener el JWT de localStorage
document.getElementById('btnIngresar').addEventListener('click', login);

function login() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        mostrarToast('Por favor ingresa ambos campos', '#f44336');
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

            mostrarToast('Inicio de sesión exitoso', '#4caf50');

            // Verificar el rol del usuario y redirigir según corresponda
            if (data.result.admin === 'ROLE_ADMIN') {
                window.location.href = '../../InicioAdmin/InicioAdmin.html';
            } else if (data.result.admin === 'ROLE_USER') {
                window.location.href = '../../InicioUsuarioNormal/InicioUsuarioNormal.html';
            }
        } else {
            mostrarToast('Credenciales incorrectas', '#f44336');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarToast('Correo o Contraseña no válida', '#f44336');
    });
}

function mostrarToast(mensaje, color = "#092e95") {
    const alertaDiv = document.createElement("div");
    alertaDiv.classList.add("alerta");

    const textoDiv = document.createElement("div");
    textoDiv.classList.add("texto");
    textoDiv.textContent = mensaje;

    alertaDiv.style.backgroundColor = color;

    const btnCerrar = document.createElement("button");
    btnCerrar.classList.add("btn-cerrar");
    btnCerrar.innerHTML = '&times;';
    btnCerrar.addEventListener("click", () => {
        ocultarAlerta(alertaDiv);
    });

    const iconoDiv = document.createElement("div");
    iconoDiv.classList.add("icono");
    iconoDiv.innerHTML = "&#x1F4A1;";

    alertaDiv.appendChild(iconoDiv);
    alertaDiv.appendChild(textoDiv);
    alertaDiv.appendChild(btnCerrar);

    document.body.appendChild(alertaDiv);

    setTimeout(() => {
        alertaDiv.classList.add("mostrar");
    }, 10);

    setTimeout(() => {
        ocultarAlerta(alertaDiv);
    }, 3000);
}

function ocultarAlerta(alertaDiv) {
    alertaDiv.classList.remove("mostrar");
    alertaDiv.classList.add("ocultar");
    setTimeout(() => {
        alertaDiv.remove();
    }, 500);
}
