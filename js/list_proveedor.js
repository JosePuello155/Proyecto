document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.querySelector("tbody");
    if (!tbody) {
        console.error("No se encontró el elemento <tbody>.");
        return;
    }

    const fetchProveedores = async () => {
        try {
            const response = await fetch("http://localhost:3000/proveedores");
            if (!response.ok) {
                throw new Error("Error en la respuesta de la red.");
            }
            const proveedores = await response.json();
            renderProveedores(proveedores);
        } catch (error) {
            console.error("Error al obtener los proveedores:", error);
        }
    };

    const renderProveedores = (proveedores) => {
        tbody.innerHTML = "";
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

        document.querySelectorAll(".eliminar-btn").forEach(button => {
            button.addEventListener("click", eliminarProveedor);
        });

        document.querySelectorAll(".editar-btn").forEach(button => {
            button.addEventListener("click", editarProveedor);
        });
    };

    const eliminarProveedor = async (event) => {
        const id = event.currentTarget.dataset.id;
        try {
            await fetch(`http://localhost:3000/proveedores/${id}`, {
                method: "DELETE",
            });
            fetchProveedores(); 
        } catch (error) {
            console.error("Error al eliminar el proveedor:", error);
        }
    };

    const editarProveedor = (event) => {
        const id = event.currentTarget.dataset.id;
        window.location.href = `registrar_proveedor.html?id=${id}`;
    };

    const btnSalir = document.getElementById("btn-salir");
    if (btnSalir) {
        btnSalir.addEventListener("click", () => {
            const confirmacion = confirm("¿Estás seguro de que deseas cerrar sesión?");
            if (confirmacion) {
                window.location.href = "/index.html"; 
            }
        });
    } else {
        console.error("No se encontró el botón de cerrar sesión.");
    }

    fetchProveedores();
});
