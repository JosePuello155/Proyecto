const isEmail = (emailInput) => {
  const expresion = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (expresion.test(emailInput.value.trim())) { 
      emailInput.classList.remove("error");
      emailInput.classList.add("correcto");
      return true;
  } else {
      emailInput.classList.remove("correcto");
      emailInput.classList.add("error");
      return false;
  }
};
export default isEmail;

