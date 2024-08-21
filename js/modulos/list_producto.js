document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.querySelector("tbody");

    // Función para obtener y renderizar los productos
    const fetchProductos = async () => {
        try {
            // Obtener productos
            const productosResponse = await fetch("http://localhost:3000/productos");
            const productos = await productosResponse.json();

            // Obtener proveedores
            const proveedoresResponse = await fetch("http://localhost:3000/proveedores");
            const proveedores = await proveedoresResponse.json();

            // Crear un mapa de proveedores para fácil acceso por ID
            const proveedoresMap = proveedores.reduce((map, proveedor) => {
                map[proveedor.id] = proveedor.name;
                return map;
            }, {});

            renderProductos(productos, proveedoresMap);
        } catch (error) {
            console.error("Error al obtener los productos o proveedores:", error);
        }
    };

    // Renderizar los productos en la tabla
    const renderProductos = (productos, proveedoresMap) => {
        tbody.innerHTML = ""; // Limpiar la tabla antes de renderizar
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

        // Añadir eventos a los botones de eliminar y editar
        document.querySelectorAll(".eliminar-btn").forEach(button => {
            button.addEventListener("click", eliminarProducto);
        });

        document.querySelectorAll(".editar-btn").forEach(button => {
            button.addEventListener("click", editarProducto);
        });
    };

    // Función para eliminar un producto
    const eliminarProducto = async (event) => {
        const id = event.target.dataset.id;

        try {
            await fetch(`http://localhost:3000/productos/${id}`, {
                method: "DELETE",
            });
            fetchProductos(); // Recargar la lista después de eliminar
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        }
    };

    // Función para redirigir al formulario de edición con los datos del producto
    const editarProducto = async (event) => {
        const id = event.target.dataset.id;
        window.location.href = `registrar_producto.html?id=${id}`;
    };

    // Iniciar obteniendo los productos y proveedores
    fetchProductos();
});

