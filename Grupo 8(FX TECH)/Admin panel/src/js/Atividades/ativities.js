// Obtém o ID da matéria ou atividade da URL
const urlParams = new URLSearchParams(window.location.search);
const idMateria = urlParams.get('idM'); // ID da matéria
const idTurma = urlParams.get('idT');


const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

console.log("Token:", token);
console.log("User:", user);

function formatarData(dataISO) {
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function formatarHora(horaISO) {
    const [horas, minutos, segundos] = horaISO.split(":").map(Number);
    if (isNaN(horas) || isNaN(minutos)) {
        console.error("Data inválida fornecida para formatarHora:", horaISO);
        return "Hora inválida";
    }
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
}

async function carregarAtividades() {
    try {
        // Busca as atividades da turma e matéria
        const response = await fetch(`http://localhost:3000/materias/${idMateria}/atividades/${idTurma}`);
        if (!response.ok) throw new Error(`Erro ao buscar atividades: ${response.statusText}`);
        const atividades = await response.json();

        // Busca os períodos letivos (bimestres) da turma
        const resPeriodo = await fetch(`http://localhost:3000/turmas/${idTurma}/periodos`);
        if (!resPeriodo.ok) throw new Error(`Erro ao buscar períodos: ${resPeriodo.statusText}`);
        const periodos = await resPeriodo.json();

        const listaAtividades = document.querySelector('.list-atividades');
        if (!listaAtividades) return console.error("Elemento .list-atividades não encontrado!");

        listaAtividades.innerHTML = "";

        if (atividades.length === 0) {
            listaAtividades.innerHTML = "<p>Nenhuma atividade encontrada para esta matéria.</p>";
            return;
        }

        // Organiza as atividades por bimestre
        const atividadesPorPeriodo = {};

        periodos.forEach(periodo => {
            atividadesPorPeriodo[periodo.nome] = [];
        });

        atividades.forEach(atividade => {
            const dataEntrega = new Date(atividade.dataEntrega);
            const periodoCorrespondente = periodos.find(p => {
                return new Date(p.data_inicio) <= dataEntrega && dataEntrega <= new Date(p.data_fim);
            });

            const nomePeriodo = periodoCorrespondente ? periodoCorrespondente.nome : 'Fora do período';
            if (!atividadesPorPeriodo[nomePeriodo]) {
                atividadesPorPeriodo[nomePeriodo] = [];
            }

            atividadesPorPeriodo[nomePeriodo].push(atividade);
        });

        for (const [nomePeriodo, atividadesPeriodo] of Object.entries(atividadesPorPeriodo)) {
            if (atividadesPeriodo.length === 0) continue;

            const titulo = document.createElement('h3');
            titulo.textContent = nomePeriodo;
            listaAtividades.appendChild(titulo);

            atividadesPeriodo.forEach(atividade => {
                const divAtividade = document.createElement("div");
                divAtividade.classList.add("div-atividade");

                const link = document.createElement("a");
                link.classList.add("atividade", "botao-atividade");
                link.classList.add(atividade.status === "indisponivel" ? "indisponivel" : "disponivel");

                link.href = `atividade.html?idA=${atividade.idAtividade}`;
                link.textContent = `${atividade.titulo} - Data de entrega: ${formatarData(atividade.dataEntrega)} - Até às: ${formatarHora(atividade.hora)}`;

                divAtividade.appendChild(link);

                // Exibe os botões apenas se o usuário for professor
                if (user.perfil.cargo === "professor") {
                    const divBotoes = document.createElement("div");
                    divBotoes.classList.add("div-botao");

                    const botaoExcluir = document.createElement("a");
                    botaoExcluir.classList.add("atividade", "botao-excluir");
                    botaoExcluir.textContent = "Excluir";
                    botaoExcluir.onclick = async () => {
                        if (confirm("Você tem certeza que deseja excluir esta atividade?")) {
                            try {
                                const deleteResponse = await fetch(`http://localhost:3000/atividades/${atividade.idAtividade}`, {
                                    method: 'DELETE',
                                    headers: { 'Content-Type': 'application/json' }
                                });
                                if (!deleteResponse.ok)
                                    throw new Error(`Erro ao excluir atividade: ${deleteResponse.statusText}`);

                                alert("Atividade excluída com sucesso!");
                                carregarAtividades();
                            } catch (error) {
                                console.error("Erro ao excluir atividade:", error);
                                alert("Erro ao excluir atividade. Tente novamente mais tarde.");
                            }
                        }
                    };

                    const botaoEditar = document.createElement("a");
                    botaoEditar.classList.add("atividade", "botao-editar");
                    botaoEditar.textContent = "Editar";
                    botaoEditar.onclick = () => criarFormularioEdicao(atividade);

                    divBotoes.appendChild(botaoExcluir);
                    divBotoes.appendChild(botaoEditar);

                    divAtividade.appendChild(divBotoes);
                }

                listaAtividades.appendChild(divAtividade);
            });
        }
    } catch (error) {
        console.error("Erro ao carregar atividades:", error);
        alert("Erro ao carregar atividades. Verifique sua conexão ou tente novamente mais tarde.");
    }
}
const modal = document.querySelector(".modal-container");

function closeModal() {
    const modalContainer = document.querySelector(".modal-container");
    if (modalContainer) {
        modalContainer.classList.add("closing");

        setTimeout(() => {
            modalContainer.remove();
        }, 400); // Tempo da animação de fechamento
    }
}

async function criarFormularioEdicao(atividade) {
    // Remove o modal anterior, se existir
    const modalExistente = document.querySelector(".modal-container");
    if (modalExistente) {
        modalExistente.remove();
    }

    try {
        const response = await fetch(`http://localhost:3000/materias/${atividade.idMateria}`);
        if (!response.ok) throw new Error(`Erro ao buscar matéria: ${response.statusText}`);

        const materia = await response.json();
        const nomeMateria = materia.nome;
        const data = atividade.dataEntrega.split("T")[0];

        // Criando a estrutura do modal
        const modalContainer = document.createElement("div");
        modalContainer.classList.add("modal-container");

        const modal = document.createElement("div");
        modal.classList.add("modal");

        modal.innerHTML = `
            <h2>Editar Tarefa</h2>
            <hr />
            <form id="editTaskForm">
                <label for="subject">Matéria:</label>
                <input type="text" id="subject" name="subject" readonly value="${nomeMateria}">	
                
                <label for="title">Título:</label>
                <input type="text" id="title" name="title" value="${atividade.titulo}">
                
                <label for="description">Descrição:</label>
                <textarea id="description" name="description">${atividade.descricao}</textarea>
                
                <label for="dueDate">Data de Entrega:</label>
                <input type="date" id="dueDate" name="dueDate" value="${data}">
                
                <label for="dueTime">Hora de Entrega:</label>
                <input type="time" id="dueTime" name="dueTime" value="${atividade.hora}">
            </form>
            <hr />
            <div class="btns">
                <button class="btnClose" onclick="closeModal()">Cancelar</button>
                <button class="btnOK">Salvar</button>
            </div>
        `;

        modalContainer.appendChild(modal);
        document.body.appendChild(modalContainer);
        modalContainer.classList.add("active");

        // Validação de data e hora ao carregar o formulário
        const dueDateInput = modal.querySelector("#dueDate");
        const dueTimeInput = modal.querySelector("#dueTime");

        const hoje = new Date().toISOString().split("T")[0];
        dueDateInput.setAttribute("min", hoje);

        dueDateInput.addEventListener("change", () => {
            if (dueDateInput.value === hoje) {
                const agora = new Date();
                const horas = agora.getHours().toString().padStart(2, "0");
                const minutos = agora.getMinutes().toString().padStart(2, "0");
                dueTimeInput.setAttribute("min", `${horas}:${minutos}`);
            } else {
                dueTimeInput.removeAttribute("min");
            }
        });

        // Ao clicar em salvar
        const btnOK = modal.querySelector(".btnOK");
        btnOK.addEventListener("click", () => salvarEdicao(atividade));

    } catch (error) {
        console.error("Erro ao criar formulário de edição:", error);
    }
}

async function salvarEdicao(atividade) {
    console.log(atividade);

    const form = document.getElementById("editTaskForm");
    const formData = new FormData(form);

    const atividadeAtualizada = {
        idAtividade: atividade.idAtividade,
        idMateria: idMateria,
        titulo: formData.get("title"),
        descricao: formData.get("description"),
        dataEntrega: formData.get("dueDate"),
        hora: formData.get("dueTime")
    };

    try {
        const response = await fetch(`http://localhost:3000/atividades/edit/${atividade.idAtividade}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(atividadeAtualizada)
        });

        if (!response.ok) {
            throw new Error(`Erro ao atualizar atividade: ${response.statusText}`);
        }

        alert("Atividade atualizada com sucesso!");
        closeModal();
        window.location.reload();
    } catch (error) {
        console.error("Erro ao salvar edição:", error);
    }
}

async function carregarParticipantes() {
    try {
        const response = await fetch(`http://localhost:3000/materias/${idMateria}/participantes/${idTurma}`);
        if (!response.ok) throw new Error(`Erro ao buscar participantes: ${response.statusText}`);
        const participantes = await response.json();

        console.log("Participantes:", participantes);

        const listaAlunos = document.querySelector('.list-alunos');
        const listaProfessores = document.querySelector('.list-professor');

        if (!listaAlunos || !listaProfessores) {
            console.error("Elementos .list-alunos ou .list-professor não encontrados!"); 
            return;
        }

        let contadorAlunos = 1; // Inicializa o contador para os alunos

        participantes.forEach(participante => {
            const divParticipante = document.createElement("div");
            divParticipante.classList.add("participante");

            const nomeDiv = document.createElement("div");
            nomeDiv.classList.add("nome");

            // A contagem será inserida antes do nome do aluno
            if (participante.tipo === "aluno") {
                nomeDiv.textContent = `${contadorAlunos} - ${participante.nome}`;
                contadorAlunos++; // Incrementa o contador para alunos
            } else if (participante.tipo === "professor") {
                nomeDiv.textContent = participante.nome;
            }

            const emailDiv = document.createElement("div");
            emailDiv.classList.add("email");
            emailDiv.textContent = participante.email_pessoal;

            divParticipante.appendChild(nomeDiv); // Adiciona o nome (com contagem, se for aluno)
            divParticipante.appendChild(emailDiv); // Adiciona o email

            // Adiciona à lista de alunos ou professores
            if (participante.tipo === "aluno") {
                listaAlunos.appendChild(divParticipante);
            } else if (participante.tipo === "professor") {
                listaProfessores.appendChild(divParticipante);
            }
        });

        console.log(`Total de alunos: ${contadorAlunos - 1}`);
    } catch (error) {
        console.error("Erro ao carregar participantes:", error);
        alert("Erro ao carregar participantes. Verifique sua conexão ou tente novamente mais tarde.");
    }
}



// Evento para carregar as atividades ou uma atividade específica ao carregar a página
document.addEventListener('DOMContentLoaded', function () {

    const containerAtividades = document.querySelector('.list-atividades');
    if (containerAtividades)
        carregarAtividades();
    else
        console.error("Elemento .list-atividades não encontrado!");

    const containerParticipantes = document.querySelector('.list-participantes');
    if (containerParticipantes) {
        carregarParticipantes();
    }

    if (containerAtividades && user.tipo === "professor") {
        // Cria o link para adicionar atividades
        const link = document.createElement("a");
        link.classList.add("adicionarAtividade");
        link.href = `adicionarAtividade.html?id=${idMateria}&idT=${urlParams.get('idT')}`; // Adiciona o idTurma aqui
        link.textContent = `Adicionar Atividades +`;

        // Insere o link antes da lista de atividades
        containerAtividades.insertAdjacentElement('beforebegin', link);
    }
});

document.getElementById('toggle-menu').addEventListener('click', () => {
    const sidebar = document.querySelector('.side-menu');
    sidebar.classList.toggle('collapsed');
  });