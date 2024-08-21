document.addEventListener("DOMContentLoaded", () => {
    const baseUrl = "http://localhost:3000"; // Cambia esta URL según tu entorno
    const tbody = document.querySelector(".cja-tabla tbody");

    // Función para obtener las ventas desde el servidor
    async function fetchVentas() {
        try {
            const response = await fetch(`${baseUrl}/ventas`);
            const ventas = await response.json();
            return ventas;
        } catch (error) {
            console.error("Error al obtener las ventas:", error);
            alert("Hubo un problema al obtener las ventas. Inténtalo de nuevo.");
            return [];
        }
    }

    // Función para listar las ventas en la tabla
    function listarVentas(ventas) {
        ventas.forEach((venta, index) => {
            venta.productos.forEach((producto, i) => {
                const tr = document.createElement("tr");

                // Si es el primer producto de la venta, agrega el índice y el ID de la venta en la primera celda
                tr.innerHTML = `
                    <td>${index + 1}${i === 0 ? ` (${venta.id})` : ''}</td>
                    <td>${producto.descripcion}</td>
                    <td>${producto.cantidad}</td>
                    <td>${producto.precio.toFixed(2)}</td>
                    <td>${producto.total.toFixed(2)}</td>
                `;

                tbody.appendChild(tr);
            });

            // Fila para mostrar el total de la venta
            const trTotal = document.createElement("tr");
            trTotal.innerHTML = `
                <td colspan="4" style="text-align: right;"><strong>Total Venta:</strong></td>
                <td><strong>${venta.totalPago.toFixed(2)}</strong></td>
            `;
            tbody.appendChild(trTotal);

            // Agregar una fila vacía para separar las ventas
            const trEmpty = document.createElement("tr");
            trEmpty.innerHTML = `<td colspan="5">&nbsp;</td>`;
            tbody.appendChild(trEmpty);
        });
    }

    // Inicializar el listado de ventas
    async function init() {
        const ventas = await fetchVentas();
        listarVentas(ventas);
    }

    init();
});
