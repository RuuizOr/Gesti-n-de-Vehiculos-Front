document.addEventListener('DOMContentLoaded', function () {
    const API_URL = "http://localhost:8080/CategoriasDeServicios"; // URL base
    const tableBody = document.getElementById('aspirantesTableBody');

    // Función para cargar las categorías y llenar la tabla
    function cargarCategorias() {
        fetch(API_URL)
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
                    // Agregar eventos a los botones después de cargar la tabla
                    agregarEventos();
                }
            })
            .catch(error => console.error("Error al cargar las categorías:", error));
    }

    // Llamar a la función al cargar la página
    cargarCategorias();

    // Agregar eventos a los botones (modificar y cambiar estado)
    function agregarEventos() {
        // Botones de modificar
        const btnsModificar = document.querySelectorAll('.btn-modificar');
        btnsModificar.forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                const nombre = this.getAttribute('data-nombre');
                const descripcion = this.getAttribute('data-descripcion');

                // Rellenar los campos del modal
                document.getElementById('idMod').value = id;
                document.getElementById('nombreMod').value = nombre;
                document.getElementById('descripcionMod').value = descripcion;
            });
        });

        // Botones de cambiar estado
        const btnsEstado = document.querySelectorAll('.cambiarEstado');
        
        btnsEstado.forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                const statusActual = this.getAttribute('data-status') === 'true';

                // Mostrar el modal para cambiar el estado
                document.getElementById('idDocente2').value = id;
                document.getElementById('estadoDocente').value = statusActual ? 'true' : 'false';

                // Mostrar el modal
                $('#modificarEstadoServicio').modal('show');
            });
        });
    }

    // Función para cambiar el estado al enviar el formulario
    const formModificarEstado = document.getElementById('formModificarEstado');
    formModificarEstado.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evitar recarga de página

        const id = document.getElementById('idDocente2').value;
        const nuevoEstado = document.getElementById('estadoDocente').value === 'true' ? false : true;

        try {
            const response = await fetch("http://localhost:8080/CategoriasDeServicios/status", {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: nuevoEstado }),
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.text || "Estado actualizado");

                // Actualizar el botón en la tabla
                const btn = document.querySelector(`.cambiarEstado[data-id="${id}"]`);
                if (btn) {
                    btn.className = `btn btn-sm ${nuevoEstado ? 'btn-success' : 'btn-danger'} cambiarEstado`;
                    btn.textContent = nuevoEstado ? 'Activo' : 'Inactivo';
                    btn.setAttribute('data-status', nuevoEstado.toString());
                }

                // Cerrar el modal
                $('#modificarEstadoServicio').modal('hide');
            } else {
                alert("Error al cambiar el estado.");
            }
        } catch (error) {
            console.error("Error al cambiar el estado:", error);
            alert("Hubo un problema al conectar con el servidor.");
        }
    });

    agregarEventos();
    

    // Enviar cambios de categoría
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
                alert(result.text || "Categoría actualizada");
                $('#modificarServicio').modal('hide'); // Cerrar modal
                cargarCategorias(); // Recargar la tabla
            })
            .catch(error => console.error("Error al modificar la categoría:", error));
    });
});
