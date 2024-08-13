document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch(`http://localhost:3000/users?username=${username}&password=${password}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                alert('Inicio de sesión exitoso');
                // Puedes redirigir al usuario a otra página aquí
            } else {
                alert('Usuario o contraseña incorrectos');
            }
        })
        .catch(error => {
            console.error('Error en el inicio de sesión:', error);
        });
});
