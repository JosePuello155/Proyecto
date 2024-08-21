document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.querySelector("tbody");

    // Función para obtener y renderizar los clientes
    const fetchClientes = async () => {
        try {
            const response = await fetch("http://localhost:3000/clientes");
            const clientes = await response.json();
            renderClientes(clientes);
        } catch (error) {
            console.error("Error al obtener los clientes:", error);
        }
    };

    // Renderizar los clientes en la tabla
    const renderClientes = (clientes) => {
        tbody.innerHTML = ""; // Limpiar la tabla antes de renderizar
        clientes.forEach((cliente) => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${cliente.document}</td>
                <td>${cliente.name}</td>
                <td>${cliente.number}</td>
                <td>${cliente.addres}</td>
                <td>${cliente.email}</td>
                <td>
                    <button class="editar-btn" data-id="${cliente.id}">Editar</button>
                    <button class="eliminar-btn" data-id="${cliente.id}">Eliminar</button>
                </td>
            `;

            tbody.appendChild(tr);
        });

        // Añadir eventos a los botones de eliminar y editar
        document.querySelectorAll(".eliminar-btn").forEach(button => {
            button.addEventListener("click", eliminarCliente);
        });

        document.querySelectorAll(".editar-btn").forEach(button => {
            button.addEventListener("click", editarCliente);
        });
    };

    // Función para eliminar un cliente
    const eliminarCliente = async (event) => {
        const id = event.target.dataset.id;

        try {
            await fetch(`http://localhost:3000/clientes/${id}`, {
                method: "DELETE",
            });
            fetchClientes(); // Recargar la lista después de eliminar
        } catch (error) {
            console.error("Error al eliminar el cliente:", error);
        }
    };

    // Función para redirigir al formulario de edición con los datos del cliente
    const editarCliente = async (event) => {
        const id = event.target.dataset.id;
        window.location.href = `registrar_clientes.html?id=${id}`;
    };
    
    // Iniciar obteniendo los clientes
    fetchClientes();
});
