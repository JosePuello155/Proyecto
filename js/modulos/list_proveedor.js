document.addEventListener("DOMContentLoaded", () => {
    // Obtener la tabla donde se listarán los proveedores
    const tbody = document.querySelector("tbody");

    // Función para obtener proveedores desde el servidor JSON
    const fetchProveedores = async () => {
        try {
            const response = await fetch("http://localhost:3000/proveedores");
            const proveedores = await response.json();
            renderProveedores(proveedores);
        } catch (error) {
            console.error("Error al obtener los proveedores:", error);
        }
    };

    // Función para renderizar la lista de proveedores
    const renderProveedores = (proveedores) => {
        tbody.innerHTML = ""; // Limpiar la tabla antes de renderizar
        proveedores.forEach((proveedor) => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${proveedor.document}</td>
                <td>${proveedor.name}</td>
                <td>${proveedor.number}</td>
                <td>${proveedor.addres}</td>
                <td>${proveedor.email}</td>
                <td>
                    <button class="editar-btn" data-id="${proveedor.id}"><i class="fa-solid fa-edit"></i> Editar</button>
                    <button class="eliminar-btn" data-id="${proveedor.id}"><i class="fa-solid fa-trash"></i> Eliminar</button>
                </td>
            `;

            tbody.appendChild(tr);
        });

        // Añadir eventos a los botones de eliminar y editar
        document.querySelectorAll(".eliminar-btn").forEach(button => {
            button.addEventListener("click", eliminarProveedor);
        });

        document.querySelectorAll(".editar-btn").forEach(button => {
            button.addEventListener("click", editarProveedor);
        });
    };

    // Función para eliminar un proveedor
    const eliminarProveedor = async (event) => {
        const id = event.target.dataset.id;

        try {
            await fetch(`http://localhost:3000/proveedores/${id}`, {
                method: "DELETE",
            });
            fetchProveedores(); // Recargar la lista después de eliminar
        } catch (error) {
            console.error("Error al eliminar el proveedor:", error);
        }
    };

    // Función para editar un proveedor
    const editarProveedor = async (event) => {
        const id = event.target.dataset.id;
        const proveedor = await obtenerProveedorPorId(id);

        if (proveedor) {
            // Prellenar el formulario con los datos existentes
            document.getElementById("document").value = proveedor.document;
            document.getElementById("name").value = proveedor.name;
            document.getElementById("number").value = proveedor.number;
            document.getElementById("addres").value = proveedor.addres;
            document.getElementById("email").value = proveedor.email;

            // Actualizar el botón de guardar para manejar actualizaciones
            document.getElementById("guardar").innerText = "Actualizar";
            document.getElementById("guardar").onclick = () => {
                guardarEdicion(id);
            };
        }
    };

    // Función para obtener un proveedor por su ID
    const obtenerProveedorPorId = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/proveedores/${id}`);
            return await response.json();
        } catch (error) {
            console.error("Error al obtener el proveedor:", error);
        }
    };

    // Función para guardar la edición del proveedor
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
            await fetch(`http://localhost:3000/proveedores/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
            });

            document.getElementById("guardar").innerText = "Guardar";
            document.getElementById("guardar").onclick = agregarProveedor;
            document.getElementById("registro-formulario").reset();
            fetchProveedores(); // Recargar la lista después de la edición
        } catch (error) {
            console.error("Error al actualizar el proveedor:", error);
        }
    };

    // Función para agregar un nuevo proveedor
    const agregarProveedor = async () => {
        const documentNumber = document.getElementById("document").value.trim();
        const name = document.getElementById("name").value.trim();
        const phoneNumber = document.getElementById("number").value.trim();
        const address = document.getElementById("addres").value.trim();
        const email = document.getElementById("email").value.trim();

        const newProvider = {
            document: documentNumber,
            name: name,
            number: phoneNumber,
            addres: address,
            email: email,
        };

        try {
            await fetch("http://localhost:3000/proveedores", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newProvider),
            });

            fetchProveedores(); // Recargar la lista después de agregar
        } catch (error) {
            console.error("Error al agregar el proveedor:", error);
        }
    };

    // Iniciar obteniendo los proveedores
    fetchProveedores();
});
