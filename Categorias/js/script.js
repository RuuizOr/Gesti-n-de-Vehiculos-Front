document.addEventListener('DOMContentLoaded', function () {
    // Modals
    $('#exampleModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var recipient = button.data('whatever');
        var modal = $(this);
        modal.find('.modal-title').text('New message to ' + recipient);
        modal.find('.modal-body input').val(recipient);
    });

    document.addEventListener("DOMContentLoaded", () => {
        const API_URL = "http://localhost:8080/CategoriasDeServicios"; // URL base
        const tableBody = document.getElementById('aspirantesTableBody');
      
        // Función para cargar las categorías y llenar la tabla
        function cargarCategorias() {
            const jwt = localStorage.getItem('jwt');  // Obtener el JWT del localStorage
            fetch(API_URL, {
                method: 'GET',  // O el método que necesites (POST, PUT, DELETE)
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`  // Aquí se agrega el token en el encabezado 'Authorization'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.type === "SUCCESS" && Array.isArray(data.result)) {
                    tableBody.innerHTML = ""; // Limpiar tabla
                    data.result.forEach(categoria => {
                        const row = `
                            <tr align="center" style="height: 20px; font-size: 15px">
                                <td>${categoria.nombre}</td>
                                <td>${categoria.descripcion}</td>
                                <td>
                                    <button class="btn btn-sm ${
                                        categoria.status ? 'btn-success' : 'btn-danger'
                                    } cambiarEstado" 
                                        data-id="${categoria.id}" 
                                        data-status="${categoria.status}">
                                        ${categoria.status ? 'Activo' : 'Inactivo'}
                                    </button>
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-primary btnIcono" 
                                        data-id="${categoria.id}" 
                                        data-nombre="${categoria.nombre}" 
                                        data-descripcion="${categoria.descripcion}" 
                                        data-toggle="modal" 
                                        data-target="#modificarServicio">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </td>
                            </tr>
                        `;
                        tableBody.innerHTML += row;
                    });
                    agregarEventos();
                }
            })
            .catch(error => console.error("Error al cargar las categorías:", error));
        }
      
        // Llamar la función para cargar las categorías al cargar la página
        cargarCategorias();
    });
  
    // Filtrar por nombre
    filterName.addEventListener("input", () => {
        const searchTerm = filterName.value.trim().toLowerCase();
        const rows = tableBody.querySelectorAll("tr");
        rows.forEach((row) => {
            const nombre = row.children[0].textContent.trim().toLowerCase();
            if (nombre.includes(searchTerm)) {
                row.style.display = ""; // Mostrar
            } else {
                row.style.display = "none"; // Ocultar
            }
        });
    });

    // Filtrar por estado
    filterState.addEventListener("change", () => {
        const selectedState = filterState.value.toLowerCase();
        const rows = tableBody.querySelectorAll("tr");
        rows.forEach((row) => {
            const estado = row.children[2].textContent.trim().toLowerCase();
            if (
                selectedState === "" || // Mostrar todos si no hay selección
                (selectedState === "activo" && estado === "activo") ||
                (selectedState === "noactivo" && estado === "inactivo")
            ) {
                row.style.display = ""; // Mostrar
            } else {
                row.style.display = "none"; // Ocultar
            }
        });
    });

    // Registrar servicio
    const formRegistrar = document.querySelector("#registrarServicio form");
    formRegistrar.addEventListener("submit", async (event) => {
        event.preventDefault();
        const nombre = document.querySelector("#nombre").value.trim();
        const descripcion = document.querySelector("#descripcion").value.trim();

        if (nombre && descripcion) {
            try {
                const response = await fetch(`${API_URL}/save`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nombre, descripcion }),
                });

                if (response.ok) {
                    const result = await response.json();
                    formRegistrar.reset();
                    $('#registrarServicio').modal('hide');  // Cerrar el modal con jQuery
                    cargarCategorias();
                } else {
                    console.error("Error al registrar el servicio. Verifique los datos.");
                }
            } catch (error) {
                console.error("Error en la solicitud:", error);
                console.error("Hubo un problema al conectar con el servidor.");
            }
        } else {
            console.error("Por favor, complete todos los campos.");
        }
    });

    // Modificar estado
    const formModificarEstado = document.getElementById('formModificarEstado');
    formModificarEstado.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = document.getElementById('idDocente2').value;
        const nuevoEstado = document.getElementById('estadoDocente').value === 'true' ? false : true;

        try {
            const response = await fetch(`${API_URL}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: nuevoEstado }),
            });

            if (response.ok) {
                const result = await response.json();
                $('#modificarEstadoServicio').modal('hide');
                cargarCategorias();
            } else {
                console.error("Error al cambiar el estado.");
            }
        } catch (error) {
            console.error("Error al cambiar el estado:", error);
            console.error("Hubo un problema al conectar con el servidor.");
        }
    });

    // Modificar servicio
    const formModificarServicio = document.getElementById('formModificarServicio');
    formModificarServicio.addEventListener('submit', function (e) {
        e.preventDefault();
        const id = document.getElementById('idMod').value;
        const nombre = document.getElementById('nombreMod').value;
        const descripcion = document.getElementById('descripcionMod').value;

        fetch(`${API_URL}/actualizar`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, nombre, descripcion })
        })
        .then(response => response.json())
        .then(result => {
            formModificarServicio.reset();
            $('#modificarServicio').modal('hide');  // Cerrar el modal con jQuery
            cargarCategorias();
        })
        .catch(error => {
            console.error("Error al modificar la categoría:", error);
        });
    });

    // Agregar eventos a los botones
    function agregarEventos() {
        const btnsModificar = document.querySelectorAll('.btnIcono');
        btnsModificar.forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                const nombre = this.getAttribute('data-nombre');
                const descripcion = this.getAttribute('data-descripcion');
                document.getElementById('idMod').value = id;
                document.getElementById('nombreMod').value = nombre;
                document.getElementById('descripcionMod').value = descripcion;
            });
        });

        const btnsEstado = document.querySelectorAll('.cambiarEstado');
        btnsEstado.forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                const statusActual = this.getAttribute('data-status') === 'true';
                document.getElementById('idDocente2').value = id;
                document.getElementById('estadoDocente').value = statusActual ? 'true' : 'false';
                $('#modificarEstadoServicio').modal('show');
            });
        });
    }

    cargarCategorias();
});
