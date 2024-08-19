document.getElementById("guardar").addEventListener("click", function() {
  // Obtener los valores de los campos
  const documentNumber = document.getElementById("document").value.trim();
  const name = document.getElementById("name").value.trim();
  const phoneNumber = document.getElementById("number").value.trim();
  const address = document.getElementById("addres").value.trim();
  const email = document.getElementById("email").value.trim();

  // Array para almacenar errores de validación
  let errors = [];

  // Validaciones
  if (!documentNumber || isNaN(documentNumber)) {
      errors.push("Número de documento es requerido y debe ser un número.");
  }

  if (!name) {
      errors.push("El nombre es requerido.");
  }

  if (!phoneNumber || isNaN(phoneNumber)) {
      errors.push("El teléfono es requerido y debe ser un número.");
  }

  if (!address) {
      errors.push("La dirección es requerida.");
  }

  if (!email || !validateEmail(email)) {
      errors.push("El correo electrónico es requerido y debe ser válido.");
  }

  // Mostrar errores si los hay
  if (errors.length > 0) {
      alert("Errores:\n" + errors.join("\n"));
  } else {
      // Si no hay errores, enviamos los datos al servidor JSON
      const formData = {
          document: documentNumber,
          name: name,
          number: phoneNumber,
          addres: address,
          email: email
      };

      saveDataToJsonServer(formData);
  }
});

// Función para validar el formato del email
function validateEmail(email) {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
}

// Función para guardar los datos en el servidor JSON
function saveDataToJsonServer(data) {
  fetch('http://localhost:3000/clientes', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
      alert('Datos guardados exitosamente');
      // Resetear el formulario
      document.getElementById("registro-formulario").reset();
  })
  .catch(error => {
      console.error('Error:', error);
      alert('Hubo un problema al guardar los datos.');
  });
}
