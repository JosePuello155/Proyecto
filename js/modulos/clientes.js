import isEmail from './is_email.js';
import is_letters from './is_letters.js';
import is_number from './is_number.js';
import is_valid from './is_valid.js';

const dom = document;

// Selecciona el formulario y los elementos necesarios
const form = dom.getElementById('registro-formulario');
const documentInput = dom.getElementById('document');
const nameInput = dom.getElementById('name');
const numberInput = dom.getElementById('number');
const addressInput = dom.getElementById('addres');
const emailInput = dom.getElementById('email');
const guardarBtn = dom.getElementById('guardar');
const newBtn = dom.getElementById('new');
const salirBtn = dom.getElementById('btn-salir');

// Asociar validaciones en tiempo real
nameInput.addEventListener('input', is_letters);
documentInput.addEventListener('input', is_number);
numberInput.addEventListener('input', is_number);
emailInput.addEventListener('input', () => isEmail(null, emailInput));

// Manejar la acción de guardar
guardarBtn.addEventListener('click', (event) => {
    event.preventDefault(); // Evita el envío del formulario por defecto

    // Validar el formulario antes de enviar
    const formValid = is_valid(event, 'input');
    if (formValid) {
        const cliente = {
            document: documentInput.value,
            name: nameInput.value,
            number: numberInput.value,
            addres: addressInput.value,
            email: emailInput.value
        };

        // Enviar los datos a JSON Server
        fetch('http://localhost:3000/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        })
        .then(response => response.json())
        .then(data => {
            alert('Cliente registrado con éxito');
            form.reset(); // Limpiar el formulario después del registro
            const inputs = document.querySelectorAll('input');
            inputs.forEach(input => {
                input.classList.remove('error', 'correcto'); // Limpia las clases de validación
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema al registrar el cliente');
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
        input.classList.remove('error', 'correcto'); // Limpia las clases de validación
    });
});

// Manejar la acción de "Salir"
salirBtn.addEventListener('click', () => {
    window.location.href = '/inicio'; // Redirige a la página de inicio
});
