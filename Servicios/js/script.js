document.addEventListener('DOMContentLoaded', function () {
    // Modals
    $('#exampleModal').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget);
      var recipient = button.data('whatever');
      var modal = $(this);
      modal.find('.modal-title').text('New message to ' + recipient);
      modal.find('.modal-body input').val(recipient);
    });
  
    // Constantes para las URLs de la API
    const API_URL_SERVICIOS = "http://localhost:8080/servicios"; // URL de servicios
    const API_URL_CATEGORIAS = "http://localhost:8080/CategoriasDeServicios/activos"; // URL de categorías
    const tableBody = document.getElementById("serviciosTableBody");
    const categoriaSelect = document.querySelector("#categoria");
  
    // Función para cargar las categorías y llenar el <select>
    async function cargarCategorias() {
      try {
        const response = await fetch(API_URL_CATEGORIAS);
        const data = await response.json();
  
        if (data && Array.isArray(data.result)) {
          data.result.forEach(categoria => {
            const option = document.createElement("option");
            option.value = categoria.id; // ID de la categoría
            option.textContent = categoria.nombre; // Nombre de la categoría
            categoriaSelect.appendChild(option);
          });
        } else {
          console.error("No se encontraron categorías.");
        }
      } catch (error) {
        console.error("Error al cargar las categorías:", error);
      }
    }
  
    // Función para cargar y mostrar los servicios
    async function mostrarServicios() {
      try {
        const response = await fetch(`${API_URL_SERVICIOS}/all`);
        const data = await response.json();
  
        if (data.type === "SUCCESS" && Array.isArray(data.result)) {
          tableBody.innerHTML = ""; // Limpiar la tabla antes de llenarla
          data.result.forEach((servicio) => {
            const row = `
              <tr align="center">
                  <td>${servicio.nombre}</td>
                  <td>${servicio.descripcion}</td>
                  <td>${servicio.categoria.nombre}</td>
                  <td>
                      <button class="btn btn-sm ${servicio.status ? "btn-success" : "btn-danger"} cambiarEstado" 
                          data-id="${servicio.id}" 
                          data-status="${servicio.status}">
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
          agregarEventos(); // Agregar eventos a los botones después de llenar la tabla
        } else {
          console.error("Error al cargar los servicios. No se encontraron resultados.");
        }
      } catch (error) {
        console.error("Error en la solicitud de servicios:", error);
      }
    }
  
    // Función para registrar un servicio
    document.querySelector("#formRegistrarServicio").addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const nombre = document.querySelector("#nombre").value.trim();
      const descripcion = document.querySelector("#descripcion").value.trim();
      const categoriaId = document.querySelector("#categoria").value; // Asume que es un <select>
  
      if (nombre && descripcion && categoriaId) {
        const payload = {
          nombre: nombre,
          descripcion: descripcion,
          categoria: { id: parseInt(categoriaId) }, // Estructura esperada por el backend
        };
  
        try {
          const response = await fetch(`${API_URL_SERVICIOS}/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
  
          if (response.ok) {
            const result = await response.json();
            console.log("Servicio registrado:", result);
            document.querySelector("#formRegistrarServicio").reset();
            $("#registrarServicio").modal("hide"); // Cerrar el modal
            mostrarServicios(); // Cargar la lista actualizada de servicios
          } else {
            console.error("Error al registrar el servicio. Verifica los datos.");
          }
        } catch (error) {
          console.error("Error en la solicitud:", error);
        }
      } else {
        console.error("Por favor, completa todos los campos.");
      }
    });
  
    // Función para agregar eventos a los botones de la tabla
    function agregarEventos() {
      const btnsModificar = document.querySelectorAll(".btnIcono");
      btnsModificar.forEach((btn) => {
        btn.addEventListener("click", function () {
          const id = this.getAttribute("data-id");
          const nombre = this.getAttribute("data-nombre");
          const descripcion = this.getAttribute("data-descripcion");
          const categoriaId = this.getAttribute("data-categoria");
          document.getElementById("idMod").value = id;
          document.getElementById("nombreMod").value = nombre;
          document.getElementById("descripcionMod").value = descripcion;
          document.getElementById("categoriaMod").value = categoriaId;
        });
      });
  
      const btnsEstado = document.querySelectorAll(".cambiarEstado");
      btnsEstado.forEach((btn) => {
        btn.addEventListener("click", function () {
          const id = this.getAttribute("data-id");
          const statusActual = this.getAttribute("data-status") === "true";
          document.getElementById("idEstado").value = id;
          document.getElementById("estado").value = statusActual ? "true" : "false";
          $("#modificarEstadoServicio").modal("show");
        });
      });
    }
  
    // Llamar a las funciones de carga al inicializar la página
    cargarCategorias();
    mostrarServicios();
  });
  