    async function obtenerCategorias() {
        // Obtener el token JWT desde localStorage
        const token = localStorage.getItem('jwt');
        console.log("Token JWT obtenido:", token);

        // Verificar si el token existe
        if (!token) {
            console.log('No se encontró el token en el localStorage');
            alert('No se encontró el token. Por favor, inicie sesión.');
            return;
        }

        const url = 'http://localhost:8080/CategoriasDeServicios/all';  // URL de la API

        try {
            // Realizar la solicitud GET con el token en el encabezado
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Incluir el token en el encabezado
                    'Accept': 'application/json',         // Aceptar respuesta en formato JSON
                    'Content-Type': 'application/json'    // Especificar que enviamos/recibimos JSON
                }
            });

            // Verificar si la respuesta fue exitosa
            if (!response.ok) {
                throw new Error('Error en la red: ' + response.statusText);
            }

            // Convertir la respuesta a JSON
            const data = await response.json();

            // Mostrar los datos recibidos en la consola
            console.log('Datos recibidos:', data);

            // Obtener el cuerpo de la tabla
            const tableBody = document.getElementById('aspirantesTableBody');
            
            // Limpiar cualquier contenido previo en la tabla
            tableBody.innerHTML = '';

            // Recorrer los datos y crear las filas de la tabla
            // Recorrer los datos y crear las filas de la tabla
            data.result.forEach(categoria => {
                console.log(categoria); // Verificar los datos de cada categoría

                // Asegurarnos de que estado sea booleano
                const estadoActivo = categoria.status === true;  // Verificar si es verdadero

                // Determinar el estado del botón (activo/inactivo) y la clase correspondiente
                const estadoClase = estadoActivo ? 'btn-success' : 'btn-danger';
                const estadoTexto = estadoActivo ? 'Activo' : 'Inactivo';

                const row = `
                    <tr align="center">
                        <td>${categoria.nombre}</td>
                        <td>${categoria.descripcion}</td>
                        <td>
                            <button class="btn btn-sm ${estadoClase}"
                                data-id="${categoria.id}" 
                                data-estado="${categoria.status}" 
                                data-toggle="modal" 
                                data-target="#modificarEstadoServicio">
                                <i class="fas fa-sync-alt"></i> ${estadoTexto}
                            </button>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-primary btnIcono"
                                data-id="${categoria.id}" 
                                data-nombre="${categoria.nombre}" 
                                data-descripcion="${categoria.descripcion}" 
                                data-toggle="modal" 
                                data-target="#modificarCategoria">
                                <i class="fas fa-edit"></i>
                            </button>
                        </td>
                    </tr>
                `;

                // Insertar la fila en la tabla
                tableBody.innerHTML += row;
            });


        } catch (error) {
            // Manejar errores de la solicitud
            console.error('Hubo un problema con la solicitud:', error);
            alert('Ocurrió un error al intentar obtener los datos.');
        }
    }

    // Llamar la función para obtener los datos cuando la página carga
    obtenerCategorias();
