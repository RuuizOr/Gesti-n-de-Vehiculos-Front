document.addEventListener('DOMContentLoaded', function () { 
    // URLs de la API
    const API_URL_SERVICIOS = "http://localhost:8080/servicios";
    const API_URL_CATEGORIAS = "http://localhost:8080/CategoriasDeServicios/all";

    const tableBody = document.getElementById("serviciosTableBody");
    const categoriaSelect = document.querySelector("#categoriaser");
    const categoriaSelectMod = document.querySelector("#categoriaMod");

    // Obtener el token JWT desde localStorage
    const token = localStorage.getItem('jwt');
    console.log("Token JWT obtenido:", token);

    // Verificar si el token existe
    if (!token) {
        mostrarAlerta('error', ' No se encontró el token. Por favor, inicie sesión.');
        return;
    }

    // Función para mostrar alertas personalizadas
    function mostrarAlerta(mensaje, tipo) {
        const alertaExistente = document.querySelector('.alerta');
        if (alertaExistente) {
            alertaExistente.classList.remove('mostrar');
            alertaExistente.classList.add('ocultar');
            // Esperamos que la animación de desaparición termine antes de eliminarla
            setTimeout(() => alertaExistente.remove(), 500);
        }

        const alerta = document.createElement('div');
        alerta.classList.add('alerta', 'mostrar');

        const icono = tipo === 'success' ? '&#x1f698;' : '&#x1f698;'; // Icono de vehículo
        alerta.innerHTML = `${icono}  <span class="texto">   ${mensaje}</span><button class="btn-cerrar"><i class="fa fa-times"></i></button>`;
        
        document.body.appendChild(alerta);

        const btnCerrar = alerta.querySelector('.btn-cerrar');
        btnCerrar.addEventListener('click', () => {
            alerta.classList.remove('mostrar');
            alerta.classList.add('ocultar');
            setTimeout(() => alerta.remove(), 500);
        });

        setTimeout(() => {
            alerta.classList.remove('mostrar');
            alerta.classList.add('ocultar');
            setTimeout(() => alerta.remove(), 500);
        }, 3000);
    }

    // Función para cargar las categorías y llenar el <select> de registro y modificación
    async function cargarCategorias() {
        try {
            const response = await fetch(`${API_URL_CATEGORIAS}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();

            console.log("Datos de categorías recibidos:", data);

            if (data && Array.isArray(data.result)) {
                categoriaSelect.innerHTML = '<option value="">Seleccione una categoría</option>';
                categoriaSelectMod.innerHTML = '<option value="">Seleccione una categoría</option>';

                data.result.forEach(categoria => {
                    const option = document.createElement("option");
                    option.value = categoria.id;
                    option.textContent = categoria.nombre;

                    categoriaSelect.appendChild(option);
                    categoriaSelectMod.appendChild(option.cloneNode(true));
                });
            } else {
                mostrarAlerta(" No se encontraron categorías.", 'error');
            }
        } catch (error) {
            mostrarAlerta(" Error al cargar las categorías.", 'error');
            console.error("Error al cargar las categorías:", error);
        }
    }

    // Función para cargar y mostrar los servicios
    async function mostrarServicios() {
        try {
            const response = await fetch(`${API_URL_SERVICIOS}/all`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();

            console.log("Datos de servicios recibidos:", data);

            if (data.type === "SUCCESS" && Array.isArray(data.result)) {
                tableBody.innerHTML = "";
                data.result.forEach(servicio => {
                    const row = `
                        <tr align="center">
                            <td>${servicio.nombre}</td>
                            <td>${servicio.descripcion}</td>
                            <td>${servicio.categoria.nombre}</td>
                            <td>
                                <button class="btn btn-sm ${servicio.status ? 'btn-success' : 'btn-danger'} cambiarEstado"
                                        data-id="${servicio.id}" 
                                        data-status="${servicio.status}" 
                                        data-toggle="modal" 
                                        data-target="#modificarEstadoServicio">
                                    ${servicio.status ? "Activo" : "Inactivo"}
                                </button>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-primary btnIcono" 
                                    data-id="${servicio.id}" 
                                    data-nombre="${servicio.nombre}" 
                                    data-descripcion="${servicio.descripcion}" 
                                    data-categoria="${servicio.categoria.id}" 
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
            } else {
                mostrarAlerta(" No se encontraron servicios.", 'error');
            }
        } catch (error) {
            mostrarAlerta(" Error al cargar los servicios.", 'error');
            console.error("Error al cargar los servicios:", error);
        }
    }
    
    // Función para registrar un servicio
    document.querySelector("#formRegistrarServicio").addEventListener("submit", async (event) => {
        event.preventDefault();

        const nombre = document.querySelector("#nombreser").value.trim();
        const descripcion = document.querySelector("#descripcionser").value.trim();
        const categoriaId = categoriaSelect.value;

        if (nombre && descripcion && categoriaId) {
            const payload = {
                nombre: nombre,
                descripcion: descripcion,
                categoria: { id: parseInt(categoriaId) },
            };

            try {
                const response = await fetch(`${API_URL_SERVICIOS}/save`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`, // Incluir el token en el encabezado
                    },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    document.querySelector("#formRegistrarServicio").reset();
                    $("#registrarServicio").modal("hide");
                    mostrarServicios();
                    mostrarAlerta(" Servicio registrado exitosamente.", 'success');
                } else {
                    mostrarAlerta(" Error al registrar el servicio.", 'error');
                }
            } catch (error) {
                mostrarAlerta(" Error en la solicitud.", 'error');
                console.error("Error en la solicitud:", error);
            }
        } else {
            mostrarAlerta(" Por favor, completa todos los campos.", 'error');
        }
    });

    // Función para modificar un servicio
    document.querySelector("#formModificarServicio").addEventListener("submit", async (event) => {
        event.preventDefault();

        const id = document.querySelector("#idMod").value;
        const nombre = document.querySelector("#nombreMod").value.trim();
        const descripcion = document.querySelector("#descripcionMod").value.trim();
        const categoriaId = categoriaSelectMod.value;

        if (nombre && descripcion && categoriaId) {
            const payload = {
                id: parseInt(id),
                nombre: nombre,
                descripcion: descripcion,
                categoria: { id: parseInt(categoriaId) },
            };

            try {
                const response = await fetch(`${API_URL_SERVICIOS}/actualizar`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`, // Incluir el token en el encabezado
                    },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    $("#modificarServicio").modal("hide");
                    mostrarServicios();
                    mostrarAlerta(" Servicio actualizado exitosamente.", 'success');
                } else {
                    mostrarAlerta(" Error al modificar el servicio.", 'error');
                }
            } catch (error) {
                mostrarAlerta(" Error en la solicitud.", 'error');
                console.error("Error en la solicitud:", error);
            }
        } else {
            mostrarAlerta(" Por favor, completa todos los campos.", 'error');
        }
    });

    // Función para cambiar el estado de un servicio
    document.querySelector("#formModificarEstado").addEventListener("submit", async (event) => {
        event.preventDefault();

        const id = document.querySelector("#idServicio").value;
        const status = document.querySelector("#estadoServicio").value === "Activo";

        try {
            const payload = {
                id: parseInt(id),
                status: !status, // Cambiar el estado al contrario
            };

            const response = await fetch(`${API_URL_SERVICIOS}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`, // Incluir el token en el encabezado
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                $("#modificarEstadoServicio").modal("hide");
                mostrarServicios(); // Recargar la tabla
                mostrarAlerta(" Estado actualizado exitosamente.", 'success');
            } else {
                mostrarAlerta(" Error al actualizar el estado.", 'error');
            }
        } catch (error) {
            mostrarAlerta(" Error en la solicitud.", 'error');
            console.error("Error en la solicitud:", error);
        }
    });

    // Función para agregar eventos a los botones
    function agregarEventos() {
        const btnsModificar = document.querySelectorAll(".btnIcono");
        btnsModificar.forEach((btn) => {
            btn.addEventListener("click", function () {
                const id = this.getAttribute("data-id");
                const nombre = this.getAttribute("data-nombre");
                const descripcion = this.getAttribute("data-descripcion");
                const categoriaId = this.getAttribute("data-categoria");

                document.querySelector("#idMod").value = id;
                document.querySelector("#nombreMod").value = nombre;
                document.querySelector("#descripcionMod").value = descripcion;
                categoriaSelectMod.value = categoriaId;
            });
        });

        const btnsEstado = document.querySelectorAll(".cambiarEstado");
        btnsEstado.forEach((btn) => {
            btn.addEventListener("click", function () {
                const id = this.getAttribute("data-id");
                const status = this.getAttribute("data-status") === "true";

                // Rellenar los campos ocultos del modal
                document.querySelector("#idServicio").value = id;
                document.querySelector("#estadoServicio").value = status ? "Activo" : "Inactivo";
            });
        });
    }

    // Función para filtrar los usuarios
    function filtrarUsuarios() {
        const nombre = document.getElementById('filterName').value.toLowerCase();
        const estado = document.getElementById('filterState').value;

        // Obtener todas las filas de la tabla
        const filas = document.querySelectorAll('#serviciosTableBody tr');

        // Iterar sobre todas las filas
        filas.forEach(fila => {
            const nombreUsuario = fila.cells[0].textContent.toLowerCase();
            // Obtener el estado desde el botón dentro de la fila
            const estadoBoton = fila.querySelector('button').getAttribute('data-status'); // Obtener el estado del botón

            // Comprobar si la fila cumple con los filtros
            const coincideNombre = nombreUsuario.includes(nombre);

            let coincideEstado = true; // Si no se selecciona estado, coincide siempre
            if (estado) {
                // Compara si el estado seleccionado corresponde con el estado del usuario
                coincideEstado = (estado === 'Activo' && estadoBoton === 'true') ||
                     (estado === 'NoActivo' && estadoBoton === 'false');

            }

            // Mostrar u ocultar la fila según los filtros
            if (coincideNombre && coincideEstado) {
                fila.style.display = ''; // Mostrar la fila
            } else {
                fila.style.display = 'none'; // Ocultar la fila
            }
        });
    }

    // Agregar eventos a los filtros
    document.getElementById('filterName').addEventListener('input', filtrarUsuarios);
    document.getElementById('filterState').addEventListener('change', filtrarUsuarios);

    // Inicializar la página
    cargarCategorias();
    mostrarServicios();
});
