import isNumber from './is_number.js';
import isLetters from './is_letters.js';
import isValid from './is_valid.js';

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('registro-formulario');
    const documentInput = document.getElementById('document');
    const nameInput = document.getElementById('name');
    const numberInput = document.getElementById('number');
    const addressInput = document.getElementById('addres');
    const emailInput = document.getElementById('email');
    const guardarBtn = document.getElementById('guardar');
    const newBtn = document.getElementById('new');
    documentInput.addEventListener('keypress', isNumber);
    numberInput.addEventListener('keypress', isNumber);
    nameInput.addEventListener('input', isLetters);
    emailInput.addEventListener('input', () => {
        
        if (!/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(emailInput.value.trim())) {
            emailInput.classList.add('error');
        } else {
            emailInput.classList.remove('error');
            emailInput.classList.add('correcto');
        }
    });

    newBtn.addEventListener('click', () => {
        form.reset();
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.classList.remove('error', 'correcto');
        });
    });

    const handleSave = async (event) => {
        event.preventDefault();

        if (!documentInput || !nameInput || !numberInput || !addressInput || !emailInput) {
            console.error('Uno o más elementos del formulario son nulos.');
            return;
        }
        const formValid = isValid(event, 'input') && !emailInput.classList.contains('error');
        if (!formValid) {
            alert('Por favor, completa todos los campos correctamente.');
            return;
        }
        if(/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(emailInput.value)){
            const proveedor = {
                document: documentInput.value.trim(),
                name: nameInput.value.trim(),
                number: numberInput.value.trim(),
                addres: addressInput.value.trim(),
                email: emailInput.value.trim(),
            };
            const urlParams = new URLSearchParams(window.location.search);
            const proveedorId = urlParams.get("id");
        
            if (proveedorId) {
                try {
                    await fetch(`http://localhost:3000/proveedores/${proveedorId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(proveedor)
                    });
                    alert('Proveedor actualizado con éxito.');
                    window.location.href = "proveedores.html"; 
                } catch (error) {
                    console.error('Error al actualizar el proveedor:', error);
                    alert('Hubo un problema al actualizar el proveedor.');
                }
            } else {
                try {
                    await fetch('http://localhost:3000/proveedores', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(proveedor)
                    });
                    alert('Proveedor registrado con éxito.');
                    form.reset();
                } catch (error) {
                    console.error('Error al registrar el proveedor:', error);
                    alert('Hubo un problema al registrar el proveedor.');
                }
            }
        } 
        else{
            alert("Correo no valido");
        }
    };
    guardarBtn.addEventListener('click', handleSave);

    const urlParams = new URLSearchParams(window.location.search);
    const proveedorId = urlParams.get("id");

    if (proveedorId) {
        try {
            const response = await fetch(`http://localhost:3000/proveedores/${proveedorId}`);
            const proveedor = await response.json();

            if (documentInput) documentInput.value = proveedor.document;
            if (nameInput) nameInput.value = proveedor.name;
            if (numberInput) numberInput.value = proveedor.number;
            if (addressInput) addressInput.value = proveedor.addres;
            if (emailInput) {
                emailInput.value = proveedor.email;
                if (!/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(proveedor.email)) {
                    emailInput.classList.add('error');
                } else {
                    emailInput.classList.add('correcto');
                }
            }
        } catch (error) {
            console.error("Error al cargar los datos del proveedor:", error);
        }
    }
});

