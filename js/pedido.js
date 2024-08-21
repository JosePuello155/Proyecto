import { URL } from "./config.js";
document.addEventListener("DOMContentLoaded", () => {
    const baseUrl = URL;  

    const codigoInput = document.getElementById("codigo");
    const descripcionInput = document.getElementById("descripcion");
    const cantidadInput = document.getElementById("cantidad");
    const precioInput = document.getElementById("precio");
    const totalPagoInput = document.getElementById("total-pago");
    const guardarBtn = document.getElementById("guardar");
    const pagarBtn = document.getElementById("pagar");

    let totalPago = 0;
    let productosPedido = [];

    
    codigoInput.addEventListener("keypress", async (e) => {
        if (e.key === "Enter") {
            const codigo = codigoInput.value.trim();

            if (codigo) {
                const producto = await fetchProductoByCodigo(codigo);

                if (producto) {
                    descripcionInput.value = producto.name;
                    precioInput.value = producto.precio;
                    cantidadInput.value = 1;  
                    cantidadInput.focus(); 
                } else {
                    alert("Producto no encontrado. Verifica el código e intenta nuevamente.");
                    descripcionInput.value = "";
                    precioInput.value = "";
                    cantidadInput.value = "";
                }
            } else {
                alert("Por favor ingresa un código válido.");
            }
        }
    });

    guardarBtn.addEventListener("click", async () => {
        const codigo = codigoInput.value.trim();
        const descripcion = descripcionInput.value.trim();
        const cantidad = parseInt(cantidadInput.value.trim());
        const precio = parseFloat(precioInput.value.trim());
    
        if (codigo && descripcion && cantidad > 0 && precio > 0) {
            const producto = await fetchProductoByCodigo(codigo);
    
            if (producto && cantidad <= producto.stock) {
                const productoExistente = productosPedido.find(producto => producto.codigo === codigo);
    
                if (productoExistente) {
                    productoExistente.cantidad += cantidad;
                    productoExistente.total = productoExistente.cantidad * productoExistente.precio;
    
                    actualizarFilaTabla(codigo, productoExistente.cantidad, productoExistente.total);
                } else {
                    const total = cantidad * precio;
                    totalPago += total;
    
                    const nuevoProducto = { codigo, descripcion, cantidad, precio, total };
                    productosPedido.push(nuevoProducto);
                    agregarProductoTabla(codigo, descripcion, cantidad, precio, total);
                }
    
                totalPagoInput.value = totalPago.toFixed(2);
                limpiarFormulario();
                codigoInput.focus();
            } else { 
                alert(`Stock insuficiente para el producto ${descripcion}. Solo quedan ${producto ? producto.stock : 0} unidades disponibles.`);
            }
        } else {
            alert("Por favor, completa todos los campos correctamente antes de guardar.");
        }
    });
    function actualizarFilaTabla(codigo, nuevaCantidad, nuevoTotal) {
        const filas = document.querySelectorAll(".cja-tabla tbody tr");
    
        filas.forEach((fila) => {
            const codigoFila = fila.querySelector("td:first-child").textContent;
    
            if (codigoFila === codigo) {
                
                fila.querySelector("td:nth-child(3)").textContent = nuevaCantidad;
                fila.querySelector("td:nth-child(5)").textContent = nuevoTotal.toFixed(2);
    
                
                totalPago += nuevoTotal - parseFloat(fila.querySelector("td:nth-child(5)").textContent);
            }
        });
    }

    pagarBtn.addEventListener("click", async () => {
        if (productosPedido.length > 0) {
            const pedido = { productos: productosPedido, totalPago };
            await guardarPedido(pedido);

            for (let producto of productosPedido) {
                await actualizarStockProducto(producto.codigo, producto.cantidad);
            }

            productosPedido = [];
            totalPago = 0;
            totalPagoInput.value = "0.00";
            limpiarTabla();
        } else {
            alert("No hay productos en el pedido. Agrega productos antes de pagar.");
        }
    });

    function agregarProductoTabla(codigo, descripcion, cantidad, precio, total) {
        const tbody = document.querySelector(".cja-tabla tbody");
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${codigo}</td>
            <td>${descripcion}</td>
            <td>${cantidad}</td>
            <td>${precio.toFixed(2)}</td>
            <td>${total.toFixed(2)}</td>
            <td><button class="eliminar-btn">Eliminar</button></td>
        `;

        tbody.appendChild(tr);
        tr.querySelector('.eliminar-btn').addEventListener('click', () => {
            eliminarProductoDeTabla(tr, total);
        });
    }

    function limpiarFormulario() {
        codigoInput.value = "";
        descripcionInput.value = "";
        cantidadInput.value = "";
        precioInput.value = "";
    }

    function limpiarTabla() {
        const tbody = document.querySelector(".cja-tabla tbody");
        tbody.innerHTML = "";
    }

    async function fetchProductoByCodigo(codigo) {
        try {
            const response = await fetch(`${baseUrl}/productos?codigo=${codigo}`);
            const data = await response.json();
            console.log(data);  
            return data.length > 0 ? data[0] : null;
        } catch (error) {
            console.error("Error al obtener el producto:", error);
            alert("Hubo un problema al obtener el producto. Inténtalo de nuevo.");
            return null;
        }
    }

    async function guardarPedido(pedido) {
        try {
            await fetch(`${baseUrl}/pedidos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(pedido)
            });

            await fetch(`${baseUrl}/ventas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(pedido)
            });
        } catch (error) {
            console.error("Error al guardar el pedido:", error);
            alert("Hubo un problema al guardar el pedido. Inténtalo de nuevo.");
        }
    }
    function eliminarProductoDeTabla(fila, total) {
        
        fila.remove();
    
        
        totalPago -= total;
        totalPagoInput.value = totalPago.toFixed(2);
    
        
        const codigo = fila.querySelector('td:first-child').textContent;
        productosPedido = productosPedido.filter(producto => producto.codigo !== codigo);
    }

    async function actualizarStockProducto(codigo, cantidad) {
        try {
            const producto = await fetchProductoByCodigo(codigo);

            if (producto) {
                const nuevoStock = producto.stock - cantidad;

                await fetch(`${baseUrl}/productos/${producto.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ stock: nuevoStock })
                });
            }
        } catch (error) {
            console.error("Error al actualizar el stock:", error);
            alert("Hubo un problema al actualizar el stock del producto. Inténtalo de nuevo.");
        }
    }
    const btnSalir = document.getElementById("btn-salir");
    btnSalir.addEventListener("click", () => {
        const confirmacion = confirm("¿Estás seguro de que deseas cerrar sesión?");
        if (confirmacion) {
            window.location.href = "/index.html";
        }
    });
});
