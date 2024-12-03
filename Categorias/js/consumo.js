const jwt = localStorage.getItem('jwt');

fetch('http://localhost:8080/CategoriasDeServicios', {
    method: 'GET',  // O el método que necesites (POST, PUT, DELETE)
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`  // Aquí se agrega el token en el encabezado 'Authorization'
    }
})
.then(response => response.json())
.then(data => {
    console.log('Datos recibidos:', data);
})
.catch(error => {
    console.error('Error:', error);
});
