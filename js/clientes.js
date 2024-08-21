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
        
        if (!validateEmail(emailInput.value.trim())) {
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
        const cliente = {
            document: documentInput.value.trim(),
            name: nameInput.value.trim(),
            number: numberInput.value.trim(),
            addres: addressInput.value.trim(),
            email: emailInput.value.trim(),
        };

        const urlParams = new URLSearchParams(window.location.search);
        const clientId = urlParams.get("id");

        if (clientId) {
            try {
                await fetch(`http://localhost:3000/clientes/${clientId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(cliente)
                });

                alert('Cliente actualizado con éxito.');
                window.location.href = "clientes.html"; 
            } catch (error) {
                console.error('Error al actualizar el cliente:', error);
                alert('Hubo un problema al actualizar el cliente.');
            }
        } else {
            try {
                await fetch('http://localhost:3000/clientes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(cliente)
                });

                alert('Cliente registrado con éxito.');
                form.reset();
            } catch (error) {
                console.error('Error al registrar el cliente:', error);
                alert('Hubo un problema al registrar el cliente.');
            }
        }
    };

    guardarBtn.addEventListener('click', handleSave);

    const urlParams = new URLSearchParams(window.location.search);
    const clientId = urlParams.get("id");

    if (clientId) {
        try {
            const response = await fetch(`http://localhost:3000/clientes/${clientId}`);
            const cliente = await response.json();

            if (documentInput) documentInput.value = cliente.document;
            if (nameInput) nameInput.value = cliente.name;
            if (numberInput) numberInput.value = cliente.number;
            if (addressInput) addressInput.value = cliente.addres;
            if (emailInput) {
                emailInput.value = cliente.email;
                if (!validateEmail(cliente.email)) {
                    emailInput.classList.add('error');
                } else {
                    emailInput.classList.add('correcto');
                }
            }
        } catch (error) {
            console.error("Error al cargar los datos del cliente:", error);
        }
    }
});
function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}


