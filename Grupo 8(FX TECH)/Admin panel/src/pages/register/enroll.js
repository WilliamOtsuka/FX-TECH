document.addEventListener("DOMContentLoaded", () => {
  // Máscara para CPF
  const applyCpfMask = (value) =>
    value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  // Máscara para CEP
  const applyCepMask = (value) =>
    value.replace(/\D/g, "").replace(/(\d{5})(\d{1,3})/, "$1-$2");

  // Máscara para RG
  const applyRgMask = (value) =>
    value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1})$/, "$1-$2");

    // Máscara para contato no formato (xx)xxxxx-xxxx
    const applyContactMask = (value) =>
      value
        .replace(/\D/g, "")
        .replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1)$2-$3")
        .replace(/(-)$/, ""); // Remove traço se não houver dígitos após

  // // Valida CPF
  // const isValidCpf = (cpf) => {
  //   cpf = cpf.replace(/\D/g, "");
  //   if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  //   let sum = 0,
  //     rest;
  //   for (let i = 1; i <= 9; i++) sum += parseInt(cpf[i - 1]) * (11 - i);
  //   rest = (sum * 10) % 11;
  //   if (rest === 10 || rest === 11) rest = 0;
  //   if (rest !== parseInt(cpf[9])) return false;
  //   sum = 0;
  //   for (let i = 1; i <= 10; i++) sum += parseInt(cpf[i - 1]) * (12 - i);
  //   rest = (sum * 10) % 11;
  //   if (rest === 10 || rest === 11) rest = 0;
  //   return rest === parseInt(cpf[10]);
  // };

  // Valida CEP
  const isValidCep = (cep) => /^[0-9]{5}-[0-9]{3}$/.test(cep);

  // Valida datas (min 1900, max 2024)
  const isValidDate = (date) => {
    const selectedDate = new Date(date);
    const minDate = new Date("1900-01-01");
    const maxDate = new Date("2024-12-31");
    return selectedDate >= minDate && selectedDate <= maxDate;
  };

  // Valida nome (mínimo 10 caracteres)
  const isValidName = (name) => name.trim().length >= 10;

  // Adiciona eventos de validação
  const addValidation = (selector, maskFunc, validationFunc, errorMessage) => {
    const input = document.querySelector(selector);
    if (!input) {
      console.warn(`Elemento não encontrado para o seletor: ${selector}`);
      return;
    }
    const errorDiv = document.createElement("div");
    errorDiv.style.color = "red";
    errorDiv.style.fontSize = "12px";
    input.insertAdjacentElement("afterend", errorDiv);

    if (maskFunc) {
      input.addEventListener("input", (e) => {
        e.target.value = maskFunc(e.target.value);
      });
    }

    if (input != null) {
      input.addEventListener("blur", (e) => {
        if (!validationFunc(e.target.value)) {
          errorDiv.textContent = errorMessage;
        } else {
          errorDiv.textContent = "";
        }
      });
    }
  };

  // addValidation("#cpf", applyCpfMask, isValidCpf, "CPF inválido");
  addValidation("#cpf", applyCpfMask, (cpf) => cpf.length === 14, "CPF inválido");
  addValidation("#cep", applyCepMask, isValidCep, "CEP inválido");
  addValidation("#date", null, isValidDate, "Data inválida (1900-2024)");
  addValidation("#rg", applyRgMask, (rg) => rg.length > 6, "RG inválido");
  addValidation(
    "#contato",
    applyContactMask,
    (contact) => contact.length === 15,
    "Contato inválido"
  );
  addValidation(
    "#name",
    null,
    isValidName,
    "O nome deve ter no mínimo 10 caracteres."
  );
});
