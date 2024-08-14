import isEmail from './isEmail.js';
import is_valid from './is_valid.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    
    loginButton.addEventListener('click', (e) => {
        e.preventDefault(); // Evita el comportamiento por defecto del botón

        const correo = document.getElementById('user');
        const password = document.getElementById('pass');

        // Verifica si los campos están vacíos o si el email es inválido
        if (!is_valid(e, '#user, #pass') || !isEmail(e, correo)) {
            alert('Por favor, complete todos los campos correctamente.');
            return;
        }

        // Verifica las credenciales con la API
        fetch(`http://localhost:3000/usuarios?correo=${encodeURIComponent(correo.value)}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0 && data[0].contraseña === password.value) {
                    alert('Has ingresado satisfactoriamente.');
                    window.location.href = '/inicio/pedido.html';
                } else {
                    alert('Credenciales incorrectas.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al conectar con el servidor.');
            });
    });
});


