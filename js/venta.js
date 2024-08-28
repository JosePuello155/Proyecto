import { URL } from "./config.js";
document.addEventListener("DOMContentLoaded", () => {
    const baseUrl = URL; 
    const tbody = document.querySelector(".cja-tabla tbody");
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

    function listarVentas(ventas) {
        
        ventas.forEach((venta, index) => {
            let totaT = 0;
            venta.productos.forEach((producto, i) => {
                const tr = document.createElement("tr");

                let td1 = document.createElement("td");
                td1.textContent = index + 1;
            if (i === 0) {
                td1.textContent += " (" + venta.id + ")";
            }

            let td2 = document.createElement("td");
            td2.textContent = producto.descripcion;

            let td3 = document.createElement("td");
            td3.textContent = producto.cantidad;

            let td4 = document.createElement("td");
            td4.textContent = producto.precio.toFixed(2);

            let td5 = document.createElement("td");
            let precioP = producto.cantidad * producto.precio
            td5.textContent =   precioP ;

            totaT += precioP;    

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tr.appendChild(td5);


            tbody.appendChild(tr);
            });

            
            const trTotal = document.createElement("tr");
            trTotal.innerHTML = `
                <td colspan="4" style="text-align: right;"><strong>Total Venta:</strong></td>
                <td><strong>${totaT}</strong></td>
              
            `;
            tbody.appendChild(trTotal);

            const trEmpty = document.createElement("tr");
            trEmpty.innerHTML = `<td colspan="5">&nbsp;</td>`;
            tbody.appendChild(trEmpty);
        });
    }

    async function init() {
        const ventas = await fetchVentas();
        listarVentas(ventas);
    }
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

    init();
});
