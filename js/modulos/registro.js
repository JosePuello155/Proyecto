document.getElementById('registro-formulario').addEventListener('submit', function(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const contraseña = document.getElementById('contraseña').value;

    if (nombre.trim() === "" || correo.trim() === "" || contraseña.trim() === "") {
        alert("Por favor, complete todos los campos.");
        return;
    }
    const verificarRegistro = async () => {
        try {
            const responseCorreo = await fetch(`http://localhost:3000/usuarios?correo=${encodeURIComponent(correo)}`);
            const usuariosPorCorreo = await responseCorreo.json();

            if (usuariosPorCorreo.length > 0) {
                alert("El correo electrónico ya está registrado.");
                return false;
            }
            return true;
        } catch (error) {
            console.error("Error al verificar el nombre o correo:", error);
            alert("Error al conectar con el servidor.");
            return false;
        }
    };

    verificarRegistro().then(isValid => {
        if (isValid) {
            const usuario = {
                nombre: nombre,
                correo: correo,
                contraseña: contraseña
            };

            fetch("http://localhost:3000/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(usuario)
            })
            .then(response => {
                if (response.ok) {
                    alert("Registro exitoso");
                    
                    
                    window.location.href = "/index.html"; 

                    document.getElementById('registro-formulario').reset();
                } else {
                    alert("Hubo un error en el registro.");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Error al conectar con el servidor.");
            });
        }
    });
});
