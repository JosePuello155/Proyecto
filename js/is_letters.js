const is_letters = (elemnto) => {
  let letras = /^[a-zA-ZÀ-ÿ|\s]+$/;
  if (!letras.test(elemnto)) return false;
  else return true;
}

export default is_letters;