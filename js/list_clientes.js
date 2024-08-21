document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.querySelector("tbody");
    const fetchClientes = async () => {
        try {
            const response = await fetch("http://localhost:3000/clientes");
            const clientes = await response.json();
            renderClientes(clientes);
        } catch (error) {
            console.error("Error al obtener los clientes:", error);
        }
    };
    const renderClientes = (clientes) => {
        tbody.innerHTML = ""; 
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

        document.querySelectorAll(".eliminar-btn").forEach(button => {
            button.addEventListener("click", eliminarCliente);
        });

        document.querySelectorAll(".editar-btn").forEach(button => {
            button.addEventListener("click", editarCliente);
        });
    };

    const eliminarCliente = async (event) => {
        const id = event.target.dataset.id;
        try {
            await fetch(`http://localhost:3000/clientes/${id}`, {
                method: "DELETE",
            });
            fetchClientes(); 
        } catch (error) {
            console.error("Error al eliminar el cliente:", error);
        }
    };

    const editarCliente = async (event) => {
        const id = event.target.dataset.id;
        window.location.href = `registrar_clientes.html?id=${id}`;
    };
    
    const btnSalir = document.getElementById("btn-salir");
    btnSalir.addEventListener("click", () => {
        const confirmacion = confirm("¿Estás seguro de que deseas cerrar sesión?");
        if (confirmacion) {
            window.location.href = "/index.html";
        }
    });
    fetchClientes();
});
