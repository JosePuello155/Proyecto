document.addEventListener("DOMContentLoaded", () => {
    // Obtener la tabla donde se listarán los clientes
    const tbody = document.querySelector("tbody");

    // Función para obtener clientes desde el servidor JSON
    const fetchClientes = async () => {
        try {
            const response = await fetch("http://localhost:3000/clientes");
            const clientes = await response.json();
            renderClientes(clientes);
        } catch (error) {
            console.error("Error al obtener los clientes:", error);
        }
    };

    // Función para renderizar la lista de clientes
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
                    <button class="editar-btn" data-id="${cliente.id}"><i class="fa-solid fa-edit"></i> Editar</button>
                    <button class="eliminar-btn" data-id="${cliente.id}"><i class="fa-solid fa-trash"></i> Eliminar</button>
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

    // Función para editar un cliente
    const editarCliente = async (event) => {
        const id = event.target.dataset.id;
        const cliente = await obtenerClientePorId(id);

        if (cliente) {
            // Prefill the form with existing data
            document.getElementById("document").value = cliente.document;
            document.getElementById("name").value = cliente.name;
            document.getElementById("number").value = cliente.number;
            document.getElementById("addres").value = cliente.addres;
            document.getElementById("email").value = cliente.email;

            // Update the form's save button to handle updates
            document.getElementById("guardar").innerText = "Actualizar";
            document.getElementById("guardar").onclick = () => {
                guardarEdicion(id);
            };
        }
    };

    // Función para obtener un cliente por su ID
    const obtenerClientePorId = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/clientes/${id}`);
            return await response.json();
        } catch (error) {
            console.error("Error al obtener el cliente:", error);
        }
    };

    // Función para guardar la edición del cliente
    const guardarEdicion = async (id) => {
        const documentNumber = document.getElementById("document").value.trim();
        const name = document.getElementById("name").value.trim();
        const phoneNumber = document.getElementById("number").value.trim();
        const address = document.getElementById("addres").value.trim();
        const email = document.getElementById("email").value.trim();

        const updatedData = {
            document: documentNumber,
            name: name,
            number: phoneNumber,
            addres: address,
            email: email,
        };

        try {
            await fetch(`http://localhost:3000/clientes/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
            });

            document.getElementById("guardar").innerText = "Guardar";
            document.getElementById("guardar").onclick = agregarCliente;
            document.getElementById("registro-formulario").reset();
            fetchClientes(); // Recargar la lista después de la edición
        } catch (error) {
            console.error("Error al actualizar el cliente:", error);
        }
    };

    // Función para agregar un nuevo cliente
    const agregarCliente = async () => {
        const documentNumber = document.getElementById("document").value.trim();
        const name = document.getElementById("name").value.trim();
        const phoneNumber = document.getElementById("number").value.trim();
        const address = document.getElementById("addres").value.trim();
        const email = document.getElementById("email").value.trim();

        const newClient = {
            document: documentNumber,
            name: name,
            number: phoneNumber,
            addres: address,
            email: email,
        };

        try {
            await fetch("http://localhost:3000/clientes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newClient),
            });

            fetchClientes(); // Recargar la lista después de agregar
        } catch (error) {
            console.error("Error al agregar el cliente:", error);
        }
    };

    // Iniciar obteniendo los clientes
    fetchClientes();
});
