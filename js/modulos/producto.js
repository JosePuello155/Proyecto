import isNumber from './is_number.js';
import isValid from './is_valid.js';

const form = document.getElementById('registro-formulario');
const codigoInput = document.getElementById('codigo');
const nameInput = document.getElementById('name');
const stockInput = document.getElementById('stock');
const precioInput = document.getElementById('precio');
const proveedorSelect = document.getElementById('proveedor');
const guardarBtn = document.getElementById('guardar');
const newBtn = document.getElementById('new');


codigoInput.addEventListener('keypress', isNumber);
stockInput.addEventListener('keypress', isNumber);
precioInput.addEventListener('keypress', isNumber);


newBtn.addEventListener('click', () => {
    form.reset();
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.classList.remove('error', 'correcto');
    });
    proveedorSelect.selectedIndex = 0;
});


const isCodigoRegistered = async (codigo) => {
    try {
        const response = await fetch(`http://localhost:3000/productos?codigo=${codigo}`);
        if (!response.ok) {
            throw new Error('Error en la respuesta al verificar el código');
        }
        const productos = await response.json();
        return productos.length > 0;
    } catch (error) {
        console.error('Error al verificar el código:', error);
        return false;
    }
};


const handleSave = async (event) => {
    event.preventDefault();

    
    const formValid = isValid(event, 'input');
    if (!formValid) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

   
    const codigo = codigoInput.value.trim();
    const codigoRegistrado = await isCodigoRegistered(codigo);

    if (codigoRegistrado) {
        alert('El código del producto ya está registrado.');
        return;
    }

    const producto = {
        codigo: codigo,
        name: nameInput.value.trim(),
        stock: stockInput.value.trim(),
        precio: precioInput.value.trim(),
        proveedor: proveedorSelect.value 
    };

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (productId) {
        
        try {
            await fetch(`http://localhost:3000/productos/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(producto)
            });

            alert('Producto actualizado con éxito.');
            window.location.href = "producto.html"; 
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            alert('Hubo un problema al actualizar el producto.');
        }
    } else {
        
        try {
            await fetch('http://localhost:3000/productos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(producto)
            });

            alert('Producto registrado con éxito.');
            form.reset();
        } catch (error) {
            console.error('Error al registrar el producto:', error);
            alert('Hubo un problema al registrar el producto.');
        }
    }
};


guardarBtn.addEventListener('click', handleSave);


document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (productId) {
        try {
            const response = await fetch(`http://localhost:3000/productos/${productId}`);
            const producto = await response.json();

           
            codigoInput.value = producto.codigo;
            nameInput.value = producto.name;
            stockInput.value = producto.stock;
            precioInput.value = producto.precio;
            proveedorSelect.value = producto.proveedor; 
        } catch (error) {
            console.error("Error al cargar los datos del producto:", error);
        }
    }

    try {
        const response = await fetch('http://localhost:3000/proveedores');
        if (!response.ok) {
            throw new Error('Error en la respuesta al cargar proveedores');
        }
        const proveedores = await response.json();

 
        proveedorSelect.innerHTML = '';

        proveedores.forEach(proveedor => {
            const option = document.createElement('option');
            option.value = proveedor.id; 
            option.textContent = proveedor.name; 
            proveedorSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar los proveedores:', error);
    }
});
