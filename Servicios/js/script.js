document.addEventListener('DOMContentLoaded', function () {
    // URLs de la API
    const API_URL_SERVICIOS = "http://localhost:8080/servicios";
    const API_URL_CATEGORIAS = "http://localhost:8080/CategoriasDeServicios/activos";

    const tableBody = document.getElementById("serviciosTableBody");
    const categoriaSelect = document.querySelector("#categoria");
    const categoriaSelectMod = document.querySelector("#categoriaMod");

    // Función para cargar las categorías y llenar el <select> de registro y modificación
    async function cargarCategorias() {
        try {
            const response = await fetch(API_URL_CATEGORIAS);
            const data = await response.json();

            if (data && Array.isArray(data.result)) {
                data.result.forEach(categoria => {
                    const option = document.createElement("option");
                    option.value = categoria.id;
                    option.textContent = categoria.nombre;

                    // Agregar categorías a ambos selects
                    categoriaSelect.appendChild(option);
                    categoriaSelectMod.appendChild(option.cloneNode(true));
                });
            } else {
                console.error("No se encontraron categorías.");
            }
        } catch (error) {
            console.error("Error al cargar las categorías:", error);
        }
    }

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
      const estado = row.children[3].textContent.trim().toLowerCase();
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

    // Función para cargar y mostrar los servicios
    async function mostrarServicios() {
        try {
            const response = await fetch(`${API_URL_SERVICIOS}/all`);
            const data = await response.json();

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
                agregarEventos(); // Agregar eventos a los botones
            } else {
                console.error("No se encontraron servicios.");
            }
        } catch (error) {
            console.error("Error al cargar los servicios:", error);
        }
    }

    // Función para registrar un servicio
    document.querySelector("#formRegistrarServicio").addEventListener("submit", async (event) => {
        event.preventDefault();

        const nombre = document.querySelector("#nombre").value.trim();
        const descripcion = document.querySelector("#descripcion").value.trim();
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
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    document.querySelector("#formRegistrarServicio").reset();
                    $("#registrarServicio").modal("hide");
                    mostrarServicios();
                } else {
                    console.error("Error al registrar el servicio.");
                }
            } catch (error) {
                console.error("Error en la solicitud:", error);
            }
        } else {
            console.error("Por favor, completa todos los campos.");
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
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    $("#modificarServicio").modal("hide");
                    mostrarServicios();
                } else {
                    console.error("Error al modificar el servicio.");
                }
            } catch (error) {
                console.error("Error en la solicitud:", error);
            }
        } else {
            console.error("Por favor, completa todos los campos.");
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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
    
            if (response.ok) {
                $("#modificarEstadoServicio").modal("hide");
                mostrarServicios(); // Recargar la tabla
            } else {
                console.error("Error al actualizar el estado del servicio.");
            }
        } catch (error) {
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

    // Inicializar la página
    cargarCategorias();
    mostrarServicios();
});