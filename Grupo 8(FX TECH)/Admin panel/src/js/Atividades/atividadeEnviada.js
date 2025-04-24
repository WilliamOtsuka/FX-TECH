const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));
console.log("Token:", token);
console.log("User:", user);

const urlParams = new URLSearchParams(window.location.search);
const idAtividade = urlParams.get('idA'); // ID da atividade

document.addEventListener('DOMContentLoaded', function () {


});
