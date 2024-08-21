import is_letters from "../js/is_letters.js";

document.getElementById('registro-formulario').addEventListener('submit', async function(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const contraseña = document.getElementById('contraseña').value.trim();
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.success').forEach(el => el.classList.remove('success'));

    let formIsValid = true;
    if (nombre == "" || correo == "" ||  contraseña == "") {
        alert("Por favor, complete todos los campos correctamente.");
        return;
    }else{
        if (nombre === "" || !is_letters(nombre)){
            document.getElementById('nombre').classList.add('error');
            formIsValid = false;
            
            alert("El nombre solo debe tener letras no numeros");
            
        }else{
            if (!validateEmail(correo)) {
                document.getElementById('correo').classList.add('error');
                formIsValid = false;
                if (!correo.includes('@')) {
                    alert("El correo debe contener un '@'.");
                } else if (!correo.includes('.')) {
                    alert("El correo debe contener un punto ('.').");
                } else {
                    alert("Por favor, ingrese un correo válido.");
                }
            }else{
                if (contraseña.length === 0) { 
                    document.getElementById('contraseña').classList.add('error');
                    formIsValid = false;
                }else {
                    const verificarRegistro = async () => {
                        try {
                            const responseCorreo = await fetch(`http://localhost:3000/usuarios?correo=${encodeURIComponent(correo)}`);
                            const usuariosPorCorreo = await responseCorreo.json();
                
                            if (usuariosPorCorreo.length > 0) {
                                document.getElementById('correo').classList.add('error');
                                alert("El correo electrónico ya está registrado.");
                                return false;
                            }
                            return true;
                        } catch (error) {
                            console.error("Error al verificar el correo:", error);
                            alert("Error al conectar con el servidor.");
                            return false;
                        }
                    };
                    const isValid = await verificarRegistro();
                    if (isValid) {
                        const usuario = {
                            nombre: nombre,
                            correo: correo,
                            contraseña: contraseña
                        };
                
                        try {
                            const response = await fetch("http://localhost:3000/usuarios", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(usuario)
                            });
                
                            if (response.ok) {
                                alert("Registro exitoso");
                                document.getElementById('registro-formulario').reset();
                                window.location.href = "/index.html"; 
                            } else {
                                alert("Hubo un error en el registro.");
                            }
                        } catch (error) {
                            console.error("Error:", error);
                            alert("Error al conectar con el servidor.");
                        }
                    }
                }
            }
        }
    }

    

});

function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}