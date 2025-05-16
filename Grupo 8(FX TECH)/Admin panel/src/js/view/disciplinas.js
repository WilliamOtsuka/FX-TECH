let token = localStorage.getItem("token");
let user = JSON.parse(localStorage.getItem("user"));

async function carregarTurmas() {
    let turmas = user.turmas;
    let listaTurmas = document.querySelector('.list-turmas');
    if (!listaTurmas) {
        console.error("Elemento .list-turmas não encontrado!");
        return;
    }

    let wrapper = document.createElement('div');
    wrapper.classList.add('dropdown-turmas-wrapper');

    let selected = document.createElement('div');
    selected.classList.add('dropdown-turmas-selected');
    selected.textContent = `${turmas[0].nome} - ${turmas[0].anoLetivo}`;

    let list = document.createElement('ul');
    list.classList.add('dropdown-turmas-list');
    list.style.display = 'none';

    turmas.forEach(turma => {
        let item = document.createElement('li');
        item.textContent = `${turma.nome} - ${turma.anoLetivo}`;
        item.id = turma.idTurma;
        item.addEventListener('click', () => {
            selected.textContent = `${turma.nome} - ${turma.anoLetivo}`;
            list.style.display = 'none';
            carregarDisciplinasTurma(turma.disciplinas, turma.idTurma);
        });
        list.appendChild(item);
    });

    selected.addEventListener('click', () => {
        list.style.display = list.style.display === 'none' ? 'block' : 'none';
    });

    // fecha ao clicar fora
    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
            list.style.display = 'none';
        }
    });

    wrapper.appendChild(selected);
    wrapper.appendChild(list);
    listaTurmas.appendChild(wrapper);

    // Carrega disciplinas da primeira turma
    carregarDisciplinasTurma(turmas[0].disciplinas, turmas[0].idTurma);
}


function carregarDisciplinasTurma(disciplinas, idTurma) {
    console.log("ID da turma:", idTurma);
    let listaDisciplinas = document.querySelector('.list-disciplinas');
    if (!listaDisciplinas) {
        console.error("Elemento .list-disciplinas não encontrado!");
        return;
    }

    listaDisciplinas.innerHTML = ""; // Limpa antes

    disciplinas.forEach(disciplina => {
        let link = document.createElement("a");
        link.classList.add("disciplinas");
        link.id = disciplina.idDisciplina;
        link.href = `atividades-disciplina.html?idD=${disciplina.idDisciplina}&idT=${idTurma}`;
        link.textContent = disciplina.nome;

        listaDisciplinas.appendChild(link);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    carregarTurmas();
    // carregarDisciplinas();

    console.log("Token:", token);
    console.log("User:", user);
    // <div class="list-content">
    //             <i data-lucide="user"></i> Gustavo Althmann
    //</div>
    document.querySelector(".user-name").innerHTML = user.perfil.nome;
    document.querySelector(".user-ra").innerHTML = user.perfil.RA;

});