import isEmail from './is_email.js';
import isLetters from './is_letters.js';
import isNumber from './is_number.js';
import isValid from './is_valid.js';

const form = document.getElementById('registro-formulario');
const documentInput = document.getElementById('document');
const nameInput = document.getElementById('name');
const numberInput = document.getElementById('number');
const addressInput = document.getElementById('addres');
const emailInput = document.getElementById('email');
const guardarBtn = document.getElementById('guardar');
const newBtn = document.getElementById('new');

// Asociar validaciones en tiempo real
nameInput.addEventListener('keypress', isLetters);
documentInput.addEventListener('keypress', isNumber);
numberInput.addEventListener('keypress', isNumber);
emailInput.addEventListener('input', (event) => isEmail(event, emailInput));

// Manejar la acción de guardar
guardarBtn.addEventListener('click', (event) => {
    event.preventDefault();

    const formValid = isValid(event, 'input');
    if (formValid) {
        const proveedor = {
            document: documentInput.value,
            name: nameInput.value,
            number: numberInput.value,
            addres: addressInput.value,
            email: emailInput.value
        };

        // Enviar los datos a JSON Server
        fetch('http://localhost:3000/proveedores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(proveedor)
        })
        .then(response => response.json())
        .then(data => {
            alert('Proveedor registrado con éxito');
            form.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema al registrar el proveedor');
        });
    } else {
        alert('Por favor, completa todos los campos correctamente.');
    }
});

// Manejar la acción de "Nuevo" (limpiar el formulario)
newBtn.addEventListener('click', () => {
    form.reset();
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.classList.remove('error', 'correcto');
    });
});
