import { solicitud, enviar } from './ajax.js'; 
import is_valid from './is_valid.js';
import remover from './remover.js';
import is_number from './is_number.js';
import is_letters from './is_letters.js';
import isEmail from './is_email.js';

const dom = document;

// Cargar clientes al iniciar
document.addEventListener('DOMContentLoaded', () => {
  loadClients();

  // Eventos para validaciones
  dom.getElementById('document').addEventListener('input', (e) => remover(e, e.target));
  dom.getElementById('name').addEventListener('input', (e) => remover(e, e.target));
  dom.getElementById('number').addEventListener('keypress', is_number);
  dom.getElementById('name').addEventListener('keypress', is_letters);
  dom.getElementById('email').addEventListener('input', (e) => isEmail(e, e.target));

  // Evento para guardar o actualizar cliente
  dom.getElementById('guardar').addEventListener('click', saveClient);

  // Evento para limpiar el formulario
  dom.getElementById('new').addEventListener('click', clearForm);
});

// Función para cargar los clientes en la tabla
const loadClients = async () => {
  const data = await solicitud('clientes');
  const tableBody = dom.querySelector('tbody');
  tableBody.innerHTML = '';

  data.forEach(cliente => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${cliente.documento}</td>
      <td>${cliente.nombre}</td>
      <td>${cliente.telefono}</td>
      <td>${cliente.direccion}</td>
      <td>${cliente.correo}</td>
      <td>
        <button class="edit-btn" data-id="${cliente.id}"><i class="fa-solid fa-pencil"></i></button>
        <button class="delete-btn" data-id="${cliente.id}"><i class="fa-solid fa-trash"></i></button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  // Eventos para editar y eliminar
  dom.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', editClient);
  });

  dom.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', deleteClient);
  });
};

// Función para guardar o actualizar cliente
const saveClient = async (e) => {
  e.preventDefault();

  const isValid = is_valid(e, 'input');
  if (!isValid) return;

  const cliente = {
    documento: dom.getElementById('document').value,
    nombre: dom.getElementById('name').value,
    telefono: dom.getElementById('number').value,
    direccion: dom.getElementById('addres').value,
    correo: dom.getElementById('email').value
  };

  const id = dom.getElementById('guardar').dataset.id;

  if (id) {
    // Si hay un ID, actualiza el cliente existente
    await enviar(`clientes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cliente)
    });
  } else {
    // Si no hay ID, crea un nuevo cliente
    await enviar('clientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cliente)
    });
  }

  loadClients();
  clearForm();
};

// Función para editar un cliente
const editClient = async (e) => {
  const id = e.currentTarget.dataset.id;

  const cliente = await solicitud(`clientes/${id}`);

  dom.getElementById('document').value = cliente.documento;
  dom.getElementById('name').value = cliente.nombre;
  dom.getElementById('number').value = cliente.telefono;
  dom.getElementById('addres').value = cliente.direccion;
  dom.getElementById('email').value = cliente.correo;

  dom.getElementById('guardar').dataset.id = cliente.id;
};

// Función para eliminar un cliente
const deleteClient = async (e) => {
  const id = e.currentTarget.dataset.id;

  await enviar(`clientes/${id}`, {
    method: 'DELETE'
  });

  loadClients();
};

// Función para limpiar el formulario
const clearForm = () => {
  dom.getElementById('document').value = '';
  dom.getElementById('name').value = '';
  dom.getElementById('number').value = '';
  dom.getElementById('addres').value = '';
  dom.getElementById('email').value = '';

  dom.getElementById('guardar').dataset.id = '';
};

