let token = localStorage.getItem("token");
let user = JSON.parse(localStorage.getItem("user"));
console.log("Token:", token);
console.log("User:", user);

let urlParams = new URLSearchParams(window.location.search);
let idAtividade = urlParams.get('idA'); // ID da atividade

document.addEventListener('DOMContentLoaded', function () {


});
