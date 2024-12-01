document.addEventListener('DOMContentLoaded', function () {
    // Función para cargar los servicios y llenar la tabla
    const API_URL = "http://localhost:8080/servicios"; // URL base
    const tableBody = document.getElementById('serviciosTableBody');
  
    // Cargar los servicios en la tabla
    function cargarServicios() {
      fetch(API_URL + '/all')
        .then(response => response.json())
        .then(data => {
          if (data.type === "SUCCESS" && Array.isArray(data.result)) {
            tableBody.innerHTML = ""; // Limpiar tabla
            data.result.forEach(servicio => {
              const row = `
                <tr align="center" style="height: 20px; font-size: 15px">
                  <td>${servicio.nombre}</td>
                  <td>${servicio.descripcion}</td>
                  <td>${servicio.categoria.nombre}</td>
                  <td>
                    <button class="btn btn-sm ${servicio.status ? 'btn-success' : 'btn-danger'} cambiarEstado" 
                            data-id="${servicio.id}" 
                            data-status="${servicio.status}">
                      ${servicio.status ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-primary btnIcono" 
                            data-id="${servicio.id}" 
                            data-nombre="${servicio.nombre}" 
                            data-descripcion="${servicio.descripcion}" 
                            data-categoria-id="${servicio.categoria.id}"
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
        .catch(error => console.error("Error al cargar los servicios:", error));
    }
  
    // Registrar nuevo servicio
    const formRegistrar = document.querySelector("#registrarServicio form");
    formRegistrar.addEventListener("submit", async (event) => {
      event.preventDefault();
      const nombre = document.querySelector("#nombre").value.trim();
      const descripcion = document.querySelector("#descripcion").value.trim();
      const categoriaId = document.querySelector("#categoria").value;
  
      if (nombre && descripcion && categoriaId) {
        try {
          const response = await fetch(`${API_URL}/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, descripcion, categoria: { id: categoriaId }, status: true }),
          });
  
          if (response.ok) {
            formRegistrar.reset();
            $('#registrarServicio').modal('hide');  // Cerrar el modal
            cargarServicios();
          } else {
            console.error("Error al registrar el servicio.");
          }
        } catch (error) {
          console.error("Error en la solicitud:", error);
        }
      } else {
        console.error("Por favor, complete todos los campos.");
      }
    });
  
    // Modificar estado de servicio
    const formModificarEstado = document.getElementById('formModificarEstado');
    formModificarEstado.addEventListener('submit', async (event) => {
      event.preventDefault();
      const id = document.getElementById('idServicioEstado').value;
      const nuevoEstado = document.getElementById('estadoServicio').value === 'true' ? false : true;
  
      try {
        const response = await fetch(`${API_URL}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, status: nuevoEstado }),
        });
  
        if (response.ok) {
          $('#modificarEstadoServicio').modal('hide');
          cargarServicios();
        } else {
          console.error("Error al cambiar el estado.");
        }
      } catch (error) {
        console.error("Error al cambiar el estado:", error);
      }
    });
  
    // Modificar servicio
    const formModificarServicio = document.getElementById('formModificarServicio');
    formModificarServicio.addEventListener('submit', function (e) {
      e.preventDefault();
      const id = document.getElementById('idMod').value;
      const nombre = document.getElementById('nombreMod').value;
      const descripcion = document.getElementById('descripcionMod').value;
      const categoriaId = document.getElementById('categoriaMod').value;
  
      fetch(`${API_URL}/actualizar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, nombre, descripcion, categoria: { id: categoriaId }, status: true })
      })
      .then(response => response.json())
      .then(result => {
        formModificarServicio.reset();
        $('#modificarServicio').modal('hide');
        cargarServicios();
      })
      .catch(error => console.error("Error al modificar el servicio:", error));
    });
  
    // Agregar eventos a los botones de modificar y cambiar estado
    function agregarEventos() {
      // Eventos de modificar
      const btnsModificar = document.querySelectorAll('.btnIcono');
      btnsModificar.forEach(btn => {
        btn.addEventListener('click', function () {
          const id = this.getAttribute('data-id');
          const nombre = this.getAttribute('data-nombre');
          const descripcion = this.getAttribute('data-descripcion');
          const categoriaId = this.getAttribute('data-categoria-id');
          document.getElementById('idMod').value = id;
          document.getElementById('nombreMod').value = nombre;
          document.getElementById('descripcionMod').value = descripcion;
          document.getElementById('categoriaMod').value = categoriaId;
        });
      });
  
      // Eventos de cambio de estado
      const btnsEstado = document.querySelectorAll('.cambiarEstado');
      btnsEstado.forEach(btn => {
        btn.addEventListener('click', function () {
          const id = this.getAttribute('data-id');
          const statusActual = this.getAttribute('data-status') === 'true';
          document.getElementById('idServicioEstado').value = id;
          document.getElementById('estadoServicio').value = statusActual ? 'true' : 'false';
          $('#modificarEstadoServicio').modal('show');
        });
      });
    }
  
    cargarServicios();
  });
  