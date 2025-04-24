import { MateriaRepository } from './materiaRepository.js';

const materiaRepo = new MateriaRepository();

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const idMateria = parseInt(urlParams.get('id'));

    if (isNaN(idMateria)) {
        console.error("Erro: ID da matéria inválido ou não informado.");
        document.getElementById('titulo-materia').textContent = "ID da matéria inválido!";
        return;
    }

    console.log("ID da Matéria:", idMateria);

    const materia = materiaRepo.buscarPorId(idMateria);

    if (!materia) {
        console.error("Erro: Matéria não encontrada.");
        document.getElementById('titulo-materia').textContent = "Matéria não encontrada!";
        return;
    }


});

