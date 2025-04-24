document.querySelector(".user-logout").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = `${location.origin}/Admin panel/src/pages/login/index.html`;
});

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const idMateria = urlParams.get('idM'); // ID da matéria
    const idTurma = urlParams.get('idT');


    const linkTurma = document.querySelector('a[href="participantes.html"]'); // Seleciona o link da turma
    if (linkTurma && idTurma && idMateria) {
        linkTurma.href = `participantes.html?idT=${idTurma}&idM=${idMateria}`; // Adiciona os parâmetros ao href
    }
    const linkMateria = document.querySelector('a[href="notas-materia.html"]'); // Seleciona o link da materia
    if (linkMateria && idTurma && idMateria) {
        linkMateria.href = `notas-materia.html?idT=${idTurma}&idM=${idMateria}`; // Adiciona os parâmetros ao href
    }
});