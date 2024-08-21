document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    
    loginButton.addEventListener('click', (e) => {
        e.preventDefault();

        const correo = document.getElementById('user');
        const password = document.getElementById('pass');

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!correo.value.trim() || !password.value.trim()) {
            alert('Por favor, complete todos los campos correctamente.');
            return;
        }

        if (!emailPattern.test(correo.value)) {
            alert('Por favor, ingrese un correo electrónico válido.');
            return;
        }

        fetch(`http://localhost:3000/usuarios?correo=${encodeURIComponent(correo.value)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud al servidor');
                }
                return response.json();
            })
            .then(data => {
                console.log('Datos recibidos:', data); 

                if (data.length > 0 && data[0].contraseña === password.value) {
                    alert('Has ingresado satisfactoriamente.');
                    window.location.href ='/inicio/pedido.html';
                } else {
                    alert('Correo o contraseña incorrecta.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al conectar con el servidor.');
            });
    });
});


