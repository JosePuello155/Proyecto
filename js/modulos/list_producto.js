document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.querySelector("tbody");
    const fetchProductos = async () => {
        try {
           
            const productosResponse = await fetch("http://localhost:3000/productos");
            const productos = await productosResponse.json();

            const proveedoresResponse = await fetch("http://localhost:3000/proveedores");
            const proveedores = await proveedoresResponse.json();

            const proveedoresMap = proveedores.reduce((map, proveedor) => {
                map[proveedor.id] = proveedor.name;
                return map;
            }, {});

            renderProductos(productos, proveedoresMap);
        } catch (error) {
            console.error("Error al obtener los productos o proveedores:", error);
        }
    };

    const renderProductos = (productos, proveedoresMap) => {
        tbody.innerHTML = ""; 
        productos.forEach((producto) => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${producto.codigo}</td>
                <td>${producto.name}</td>
                <td>${producto.stock}</td>
                <td>${producto.precio}</td>
                <td>${proveedoresMap[producto.proveedor] || "Desconocido"}</td>
                <td>
                    <button class="editar-btn" data-id="${producto.id}">Editar</button>
                    <button class="eliminar-btn" data-id="${producto.id}">Eliminar</button>
                </td>
            `;

            tbody.appendChild(tr);
        });

        document.querySelectorAll(".eliminar-btn").forEach(button => {
            button.addEventListener("click", eliminarProducto);
        });

        document.querySelectorAll(".editar-btn").forEach(button => {
            button.addEventListener("click", editarProducto);
        });
    };

    const eliminarProducto = async (event) => {
        const id = event.target.dataset.id;

        try {
            await fetch(`http://localhost:3000/productos/${id}`, {
                method: "DELETE",
            });
            fetchProductos(); 
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        }
    };

    const editarProducto = async (event) => {
        const id = event.target.dataset.id;
        window.location.href = `registrar_producto.html?id=${id}`;
    };
    
    const btnSalir = document.getElementById("btn-salir");
    btnSalir.addEventListener("click", () => {
        const confirmacion = confirm("¿Estás seguro de que deseas cerrar sesión?");
        if (confirmacion) {
            window.location.href = "/index.html";
        }
    });

    fetchProductos();
});

