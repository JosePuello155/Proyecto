const isEmail = (event, elemento) => {
  let expresion = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  if (expresion.test(elemento.value)) {
      elemento.classList.remove("error");
      elemento.classList.add("correcto");
      return true;
  } else {
      elemento.classList.remove("correcto");
      elemento.classList.add("error");
      return false;
  }
};

export default isEmail;
