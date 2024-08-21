const dom = document;

const valid = (event, form) => {
    event.preventDefault();
    const elemts = document.querySelectorAll(form);
    let bandera = true;

    elemts.forEach(element => {
        if (element.value.trim() === "") { 
            element.classList.add("error");
            bandera = false;
        } else {
            element.classList.remove("error"); 
        }
    });

    return bandera;
};

export default valid;