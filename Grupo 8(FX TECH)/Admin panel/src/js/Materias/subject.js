const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

async function carregarTurmas() {
    const turmas = user.turmas;
    const listaTurmas = document.querySelector('.list-turmas');
    if (!listaTurmas) {
        console.error("Elemento .list-turmas não encontrado!");
        return;
    }

    const wrapper = document.createElement('div');
    wrapper.classList.add('dropdown-turmas-wrapper');

    const selected = document.createElement('div');
    selected.classList.add('dropdown-turmas-selected');
    selected.textContent = `${turmas[0].nome} - ${turmas[0].anoLetivo}`;

    const list = document.createElement('ul');
    list.classList.add('dropdown-turmas-list');
    list.style.display = 'none';

    turmas.forEach(turma => {
        const item = document.createElement('li');
        item.textContent = `${turma.nome} - ${turma.anoLetivo}`;
        item.id = turma.idTurma;
        item.addEventListener('click', () => {
            selected.textContent = `${turma.nome} - ${turma.anoLetivo}`;
            list.style.display = 'none';
            carregarMateriasTurma(turma.materias, turma.idTurma);
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

    // Carrega matérias da primeira turma
    carregarMateriasTurma(turmas[0].materias, turmas[0].idTurma);
}


function carregarMateriasTurma(materias, idTurma) {
    console.log("ID da turma:", idTurma);
    const listaDisciplinas = document.querySelector('.list-disciplinas');
    if (!listaDisciplinas) {
        console.error("Elemento .list-disciplinas não encontrado!");
        return;
    }

    listaDisciplinas.innerHTML = ""; // Limpa antes

    materias.forEach(materia => {
        const link = document.createElement("a");
        link.classList.add("disciplinas");
        link.id = materia.idMateria;
        link.href = `atividadesMateria.html?idM=${materia.idMateria}&idT=${idTurma}`;
        link.textContent = materia.nome;

        listaDisciplinas.appendChild(link);
    });
}

// async function carregarMaterias() {
//     try {
//         let response;
//         try {
//             response = await fetch('http://localhost:3000/materias');
//             console.log(response.data, "DATA")
//         } catch (err) {
//             console.error(err, "NO TRU ADAMDAMId")
//         }
//         if (!response.ok) {
//             console.log("Esto noe DADIMADAUDUW")
//             throw new Error(`HTTP error! Status: ${response}`);
//         }
//         const materias = await response.json();

//         console.log("Lista de todas as matérias:", materias);

//         const listaDisciplinas = document.querySelector('.list-disciplinas');
//         if (!listaDisciplinas) {
//             console.error("Elemento .list-disciplinas não encontrado!");
//             return;
//         }

//         listaDisciplinas.innerHTML = ""; // Limpa a lista antes de adicionar os elementos

//         materias.forEach(materia => {
//             const link = document.createElement("a");
//             link.classList.add("disciplinas");
//             link.id = materia.idMateria;
//             link.href = `atividadesMateria.html?idM=${materia.idMateria}&idT=${materia.idTurma}`; // Adicione o idTurma aqui se necessário
//             link.textContent = materia.nome;

//             listaDisciplinas.appendChild(link);
//         });
//     } catch (error) {
//         console.error('Erro ao carregar matérias: o error', error);
//         alert('Erro ao carregar matérias. Verifique sua conexão ou tente novamente mais tarde.');
//     }
// }

document.addEventListener("DOMContentLoaded", () => {
    carregarTurmas();
    // carregarMaterias();

    console.log("Token:", token);
    console.log("User:", user);
    // <div class="list-content">
    //             <i data-lucide="user"></i> Gustavo Althmann
    //</div>
    document.querySelector(".user-name").innerHTML = user.perfil.nome;
    document.querySelector(".user-ra").innerHTML = user.perfil.RA;

});