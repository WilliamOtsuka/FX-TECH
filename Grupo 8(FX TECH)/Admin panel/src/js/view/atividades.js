let urlParams = new URLSearchParams(window.location.search);
let idDisciplina = urlParams.get('idD');
let idTurma = urlParams.get('idT');

let user = JSON.parse(localStorage.getItem("user"));
let token = localStorage.getItem("token");
console.log("User:", user);

function ajustarCamposPorTipo(tipoSelecionado) {
    let dataInput = document.getElementById("data");
    let horaInput = document.getElementById("hora");

    let hoje = new Date().toISOString().split("T")[0];

    if (tipoSelecionado === "atividade") {
        // Remove todo valor do campo de data
        dataInput.value = ""; // Limpa o campo de data
        horaInput.value = ""; // Limpa o campo de hora
        // Para "atividade", restringe a data mínima para hoje
        dataInput.setAttribute("min", hoje);

        dataInput.addEventListener("change", function () {
            if (dataInput.value === hoje) {
                let agora = new Date();
                let horas = agora.getHours().toString().padStart(2, "0");
                let minutos = agora.getMinutes().toString().padStart(2, "0");
                horaInput.setAttribute("min", `${horas}:${minutos}`);
            } else {
                horaInput.removeAttribute("min");
            }
        });
    } else if (tipoSelecionado === "avaliativa") {
        // Para "avaliativa", permite qualquer data e hora
        dataInput.removeAttribute("min");
        horaInput.removeAttribute("min");
    }
}

function carregarTipos() {
    let tipoContainer = document.querySelector('.tipo-container');

    let tipos = ["atividade", "avaliativa"];

    let wrapper = document.createElement('div');
    wrapper.classList.add('dropdown-tipos-wrapper');

    let selected = document.createElement('div');
    selected.classList.add('dropdown-tipos-selected');
    selected.textContent = tipos[0]; // Define o primeiro valor como selecionado inicialmente

    let list = document.createElement('ul');
    list.classList.add('dropdown-tipos-list');
    list.style.display = 'none';

    tipos.forEach(tipo => {
        let item = document.createElement('li');
        item.textContent = tipo;
        item.addEventListener('click', () => {
            selected.textContent = tipo;
            list.style.display = 'none';
            ajustarCamposPorTipo(tipo);
        });
        list.appendChild(item);
    });

    selected.addEventListener('click', () => {
        list.style.display = list.style.display === 'none' ? 'block' : 'none';
    });

    // Fecha o dropdown ao clicar fora
    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
            list.style.display = 'none';
        }
    });

    wrapper.appendChild(selected);
    wrapper.appendChild(list);
    tipoContainer.appendChild(wrapper);

    ajustarCamposPorTipo(tipos[0]);
}

async function enviarFormulario(event) {
    event.preventDefault();

    // Captura dos valores dos campos
    let titulo = document.getElementById("titulo").value.trim();
    let descricao = document.getElementById("descricao").value.trim();
    let dataEntrega = document.getElementById("data").value;
    let hora = document.getElementById("hora").value;
    let peso = document.getElementById("peso").value;
    let tipo = document.querySelector('.dropdown-tipos-selected').textContent;
    // let arquivo = document.getElementById("arquivo").files[0];

    // Validações
    if (!titulo) {
        errorMessage.textContent = "O título da atividade é obrigatório.";
        return;
    }

    if (!descricao) {
        errorMessage.textContent = "A descrição da atividade é obrigatória.";
        return;
    }

    if (!dataEntrega) {
        errorMessage.textContent = "A data de entrega é obrigatória.";
        return;
    }

    if (!hora) {
        errorMessage.textContent = "A hora de entrega é obrigatória.";
        return;
    }

    if (!peso) {
        errorMessage.textContent = "O peso da atividade é obrigatório.";
        return;
    }

    if (!tipo) {
        errorMessage.textContent = "O tipo da atividade é obrigatório.";
        return;
    }

    try {
        let response = await fetch('http://localhost:3000/atividades', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ titulo, descricao, dataEntrega, hora, peso, idDisciplina, idTurma, tipo }) // Envia o idDisciplina também
        });

        if (response.ok) {
            alert('Atividade adicionada com sucesso!');
            document.getElementById('atividadeForm').reset(); // Limpa o formulário após o envio
        } else {
            let data = await response.json();
            alert(`Erro: ${data.message}`);
        }
    } catch (error) {
        console.error('Erro ao adicionar a atividade:', error);
        alert('Erro de conexão. Tente novamente.');
    }
    window.location.replace('./atividades-disciplina.html?idD=' + idDisciplina + '&idT=' + idTurma); // Redireciona para a página de atividades com idDisciplina e idTurma
}

function formatarData(dataISO) {
    let data = new Date(dataISO);
    let dia = String(data.getDate()).padStart(2, '0');
    let mes = String(data.getMonth() + 1).padStart(2, '0');
    let ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function formatarHora(horaISO) {
    let [horas, minutos, segundos] = horaISO.split(":").map(Number);
    if (isNaN(horas) || isNaN(minutos)) {
        console.error("Data inválida fornecida para formatarHora:", horaISO);
        return "Hora inválida";
    }
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
}

async function carregarAtividades() {
    try {
        // Busca as atividades da turma e disciplina
        // let response = await fetch(`http://localhost:3000/disciplinas/${idDisciplina}/atividades/${idTurma}`);
        let response = await fetch(`http://localhost:3000/atividades/disciplina/${idDisciplina}/turma/${idTurma}`);

        if (!response.ok) throw new Error(`Erro ao buscar atividades: ${response.statusText}`);
        let atividades = await response.json();
        // Busca os períodos letivos (bimestres) da turma
        let resPeriodo = await fetch(`http://localhost:3000/turmas/${idTurma}/periodos`);
        if (!resPeriodo.ok) throw new Error(`Erro ao buscar períodos: ${resPeriodo.statusText}`);
        let periodos = await resPeriodo.json();

        let listaAtividades = document.querySelector('.list-atividades');
        if (!listaAtividades) return console.error("Elemento .list-atividades não encontrado!");

        listaAtividades.innerHTML = "";

        if (atividades.length === 0) {
            listaAtividades.innerHTML = "<p>Nenhuma atividade encontrada para esta disciplina.</p>";
            return;
        }

        // Organiza as atividades por bimestre
        let atividadesPorPeriodo = {};

        periodos.forEach(periodo => {
            atividadesPorPeriodo[periodo.nome] = [];
        });

        atividades.forEach(atividade => {
            let dataEntrega = new Date(atividade.dataEntrega);
            let periodoCorrespondente = periodos.find(p => {
                return new Date(p.data_inicio) <= dataEntrega && dataEntrega <= new Date(p.data_fim);
            });

            let nomePeriodo = periodoCorrespondente ? periodoCorrespondente.nome : 'Fora do período';
            if (!atividadesPorPeriodo[nomePeriodo]) {
                atividadesPorPeriodo[nomePeriodo] = [];
            }

            atividadesPorPeriodo[nomePeriodo].push(atividade);
        });

        for (let [nomePeriodo, atividadesPeriodo] of Object.entries(atividadesPorPeriodo)) {
            if (atividadesPeriodo.length === 0) continue;

            let titulo = document.createElement('h3');
            titulo.textContent = nomePeriodo;
            listaAtividades.appendChild(titulo);

            atividadesPeriodo.forEach(atividade => {
                let divAtividade = document.createElement("div");
                divAtividade.classList.add("div-atividade");

                let link = document.createElement("a");
                link.id = `${atividade.idAtividade}`;
                link.classList.add("atividade", "botao-atividade");
                link.classList.add(atividade.status === "indisponivel" ? "indisponivel" : "disponivel");

                link.href = `atividade.html?idA=${atividade.idAtividade}`;
                link.textContent = `${atividade.titulo} - Data de entrega: ${formatarData(atividade.dataEntrega)} - Até às: ${formatarHora(atividade.hora)}`;

                divAtividade.appendChild(link);

                // Exibe os botões apenas se o usuário for professor
                if (user.perfil.cargo === "professor") {
                    let divBotoes = document.createElement("div");
                    divBotoes.classList.add("div-botao");

                    let botaoExcluir = document.createElement("a");
                    botaoExcluir.classList.add("atividade", "botao-excluir");
                    botaoExcluir.textContent = "Excluir";
                    botaoExcluir.onclick = async () => {
                        if (confirm("Você tem certeza que deseja excluir esta atividade?")) {
                            try {
                                let deleteResponse = await fetch(`http://localhost:3000/atividades/${atividade.idAtividade}`, {
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

                    let botaoEditar = document.createElement("a");
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
let modal = document.querySelector(".modal-container");

function closeModal() {
    let modalContainer = document.querySelector(".modal-container");
    if (modalContainer) {
        modalContainer.classList.add("closing");

        setTimeout(() => {
            modalContainer.remove();
        }, 400); // Tempo da animação de fechamento
    }
}

async function criarFormularioEdicao(atividade) {
    // Remove o modal anterior, se existir
    let modalExistente = document.querySelector(".modal-container");
    if (modalExistente) {
        modalExistente.remove();
    }

    try {
        let response = await fetch(`http://localhost:3000/atividades/${atividade.idAtividade}`);
        if (!response.ok) throw new Error(`Erro ao buscar disciplina: ${response.statusText}`);

        let disciplina = await response.json();
        let nomeDisciplina = disciplina.nome;
        let data = atividade.dataEntrega.split("T")[0];

        // Criando a estrutura do modal
        let modalContainer = document.createElement("div");
        modalContainer.classList.add("modal-container");

        let modal = document.createElement("div");
        modal.classList.add("modal");

        modal.innerHTML = `
            <h2>Editar Tarefa</h2>
            <hr />
            <form id="editTaskForm">
                <label for="subject">Disciplina:</label>
                <input type="text" id="subject" name="subject" readonly value="${nomeDisciplina}">	
                
                <label for="title">Título:</label>
                <input type="text" id="title" name="title" value="${atividade.titulo}">
                
                <label for="description">Descrição:</label>
                <textarea id="description" name="description">${atividade.descricao}</textarea>
                
                <label for="dueDate">Data de Entrega:</label>
                <input type="date" id="dueDate" name="dueDate" value="${data}">
                
                <label for="dueTime">Hora de Entrega:</label>
                <input type="time" id="dueTime" name="dueTime" value="${atividade.hora}">

                <label for="weight">Peso:</label>
                <input type="number" id="weight" name="weight" value="${atividade.peso || 0}" min="0" max="100" step="0.01">

                <hr />
                <div class="btns">
                    <button type="button" class="btnClose" onclick="closeModal()">Cancelar</button>
                    <button type="submit" class="btnOK">Salvar</button>
                </div>
            </form>
        `;
        console.log("Atividade:", atividade);

        modalContainer.appendChild(modal);
        document.body.appendChild(modalContainer);
        modalContainer.classList.add("active");

        // Validação de data e hora ao carregar o formulário
        let dueDateInput = modal.querySelector("#dueDate");
        let dueTimeInput = modal.querySelector("#dueTime");

        let hoje = new Date().toISOString().split("T")[0];
        dueDateInput.setAttribute("min", hoje);

        dueDateInput.addEventListener("change", () => {
            if (dueDateInput.value === hoje) {
                let agora = new Date();
                let horas = agora.getHours().toString().padStart(2, "0");
                let minutos = agora.getMinutes().toString().padStart(2, "0");
                dueTimeInput.setAttribute("min", `${horas}:${minutos}`);
            } else {
                dueTimeInput.removeAttribute("min");
            }
        });

        // Ao clicar em salvar
        let form = modal.querySelector("#editTaskForm");
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            await salvarEdicao(atividade);
        });

    } catch (error) {
        console.error("Erro ao criar formulário de edição:", error);
    }
}

async function salvarEdicao(atividade) {
    let form = document.getElementById("editTaskForm");
    let formData = new FormData(form);

    let atividadeAtualizada = {
        idAtividade: atividade.idAtividade,
        idDisciplina: idDisciplina,
        titulo: formData.get("title"),
        descricao: formData.get("description"),
        dataEntrega: formData.get("dueDate"),
        hora: formData.get("dueTime"),
        peso: formData.get("weight")
    };

    console.log("Dados da atividade atualizada:", atividadeAtualizada);

    try {
        let response = await fetch(`http://localhost:3000/atividades/${atividade.idAtividade}`, {
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


async function alunosRestantes(idAtividade) {
    // let response = await fetch(`http://localhost:3000/atividade/${idAtividade}/tarefa/alunos`);
    let response = await fetch(`http://localhost:3000/atividades/${idAtividade}/entrega/pendente/alunos`);
    if (!response.ok) {
        throw new Error(`Erro ao buscar alunos restantes: ${response.statusText}`);
    }

    let alunos = await response.json();
    console.log("Alunos restantes:", alunos);

    let alunosPendentesContainer = document.getElementById('tarefa-pendente-list');
    if (!alunosPendentesContainer) {
        console.error("Elemento #tarefa-pendente-list não encontrado!");
        return;
    }

    alunosPendentesContainer.innerHTML = ""; // Limpa a lista antes de adicionar novos alunos

    if (alunos.length === 0) {
        alunosPendentesContainer.innerHTML = "<li>Nenhum aluno restante encontrado.</li>";
        return;
    }

    alunos.forEach(aluno => {
        let alunoItem = document.createElement("li");
        alunoItem.classList.add("aluno-item");
        alunoItem.textContent = `${aluno.nome} - ${aluno.ra}`;
        alunoItem.style.cursor = "pointer";
        alunoItem.onmouseover = () => {
            alunoItem.style.color = "#2d75bd";
        };
        alunoItem.onmouseleave = () => {
            alunoItem.style.color = "#000000";
        };
        alunosPendentesContainer.appendChild(alunoItem);
    });
}

async function correcaoPendente(idAtividade) {
    // let response = await fetch(`http://localhost:3000/atividade/${idAtividade}/tarefa/correcao/pendente`);
    let response = await fetch(`http://localhost:3000/atividades/${idAtividade}/correcao/pendente/alunos`);
    if (!response.ok) {
        throw new Error(`Erro ao buscar correções pendentes: ${response.statusText}`);
    }

    let tarefas = await response.json();
    console.log("Correções pendentes:", tarefas);

    let tarefasEntreguesContainer = document.getElementById('tarefa-entregue-list');
    if (!tarefasEntreguesContainer) {
        console.error("Elemento #tarefa-entregue-list não encontrado!");
        return;
    }

    tarefasEntreguesContainer.innerHTML = ""; // Limpa a lista antes de adicionar novas tarefas

    if (tarefas.length === 0) {
        tarefasEntreguesContainer.innerHTML = "<li>Nenhuma correção pendente encontrada.</li>";
        return;
    }

    tarefas.forEach(tarefa => {
        let tarefaItem = document.createElement("li");
        tarefaItem.classList.add("tarefa-item");
        tarefaItem.textContent = `${tarefa.nome} - ${tarefa.ra}`;
        tarefaItem.style.cursor = "pointer";
        tarefaItem.onmouseover = () => {
            tarefaItem.style.color = "#2d75bd";
        };
        tarefaItem.onmouseleave = () => {
            tarefaItem.style.color = "#000000";
        };
        tarefaItem.onclick = () => {
            window.location.href = `atividade-feedback.html?idAtividade=${tarefa.idAtividade}&idAluno=${tarefa.idAluno}`;
        };
        tarefasEntreguesContainer.appendChild(tarefaItem);
    });
}

async function alunosAtividadeCorrigida(idAtividade) {
    // let response = await fetch(`http://localhost:3000/atividade/${idAtividade}/tarefa/correcao/corrigida`);
    let response = await fetch(`http://localhost:3000/atividades/${idAtividade}/correcao/corrigida/alunos`);
    if (!response.ok) {
        throw new Error(`Erro ao buscar atividades corrigidas: ${response.statusText}`);
    }

    let tarefasCorrigidas = await response.json();
    console.log("Atividades corrigidas:", tarefasCorrigidas);

    let tarefasCorrigidasContainer = document.getElementById('tarefa-corrigida-list');
    if (!tarefasCorrigidasContainer) {
        console.error("Elemento #tarefa-corrigida-list não encontrado!");
        return;
    }

    tarefasCorrigidasContainer.innerHTML = ""; // Limpa a lista antes de adicionar novas tarefas

    if (tarefasCorrigidas.length === 0) {
        tarefasCorrigidasContainer.innerHTML = "<li>Nenhuma tarefa corrigida encontrada.</li>";
        return;
    }

    tarefasCorrigidas.forEach(tarefa => {
        let tarefaItem = document.createElement("li");
        tarefaItem.classList.add("tarefa-item");
        tarefaItem.textContent = `${tarefa.nome} - ${tarefa.ra}`;
        tarefaItem.style.cursor = "pointer";
        tarefaItem.onmouseover = () => {
            tarefaItem.style.color = "#2d75bd";
        };
        tarefaItem.onmouseleave = () => {
            tarefaItem.style.color = "#000000";
        };
        tarefaItem.onclick = () => {
            window.location.href = `atividade-feedback.html?idAtividade=${tarefa.idAtividade}&idAluno=${tarefa.idAluno}`;
        };

        tarefasCorrigidasContainer.appendChild(tarefaItem);
    });
}

async function carregarAtividadeAluno(idAtividade, idAluno) {
    let response = await fetch(`http://localhost:3000/atividades/${idAtividade}/resposta/aluno/${idAluno}`);
    if (!response.ok) {
        throw new Error(`Erro ao buscar atividade entregue: ${response.statusText}`);
    }
    return response.json();
}

async function salvarCorrecao(event) {
    event.preventDefault();

    let idAtividade = urlParams.get('idAtividade');
    let idAluno = urlParams.get('idAluno');

    let nota = parseFloat(document.getElementById("nota").value);
    let feedback = document.getElementById("feedback").value;

    try {
        let response = await fetch(`http://localhost:3000/atividades/${idAtividade}/correcao/aluno/${idAluno}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nota, feedback })
        });

        let data = await response.json();

        if (!response.ok) {
            // Verifica se o erro é devido ao status "disponível"
            if (response.status === 403) {
                alert(data.message); // "Não é possível corrigir uma atividade ainda disponível."
            } else {
                alert(data.message + " Erro ao salvar correção.");
            }
            return;
        }

        alert("Correção salva com sucesso!");
        location.reload();
    } catch (error) {
        console.error("Erro ao salvar correção:", error);
        alert("Erro inesperado ao salvar correção.");
    }
}

function renderFormularioNota() {
    return `
        <div class="form-groupCorrecao">
            <label for="nota">Nota:</label>
            <input type="number" id="nota" name="nota" min="0" max="10" step="0.01" required>
        </div>
        <div class="form-groupCorrecao">
            <label for="feedback">Feedback (opcional):</label>
            <textarea id="feedback" name="feedback" rows="4"></textarea>
        </div>
        <button type="submit" class="btnCorrecao">Salvar Correção</button>
    `;
}

function renderRespostaNota({ nota, feedback }) {
    const notaEncoded = encodeURIComponent(nota);
    const feedbackEncoded = encodeURIComponent(feedback);

    return `
        <div class="form-groupCorrecao" id="nota-container">
            <label>Nota:</label>
            <p id="nota-text">${nota}</p>
        </div>
        <div class="form-groupCorrecao" id="feedback-container">
            <label>Feedback:</label>
            <p id="feedback-text">${feedback}</p>
        </div>
        <div class="btnsFormCorrecao">
        <button type="button" class="btnExcluirCorrecao" onclick="excluirCorrecao()">Excluir Correção</button>
            <button type="button" class="btnEditarCorrecao" onclick="ativarEdicao('${notaEncoded}', '${feedbackEncoded}')">Editar Correção</button>
        </div>
    `;
}

async function buscarResposta(idAtividade, idAluno) {
    // let resposta = await fetch(`http://localhost:3000/atividade/${idAtividade}/tarefa/${idAluno}/resposta`);
    let resposta = await fetch(`http://localhost:3000/atividades/${idAtividade}/feedback/aluno/${idAluno}`);
    if (!resposta.ok) throw new Error("Erro ao buscar resposta do aluno.");
    return await resposta.json();
}

function ativarEdicao(nota, feedback) {
    nota = decodeURIComponent(nota);
    feedback = decodeURIComponent(feedback);

    document.getElementById("nota-container").innerHTML = `
        <label for="nota">Nota:</label>
        <input type="number" id="nota" value="${nota}" min="0" max="10" step="0.01" required>
    `;
    let notaInput = document.getElementById("nota");
    notaInput.addEventListener("input", function () {
        if (notaInput.value < 0) {
            notaInput.value = 0;
        } else if (notaInput.value > 10) {
            notaInput.value = 10;
        }
    });
    document.getElementById("feedback-container").innerHTML = `
        <label for="feedback-edit">Feedback:</label>
        <textarea id="feedback-edit" rows="4">${feedback}</textarea>
    `;

    document.querySelector(".btnsFormCorrecao").innerHTML = `
    <button type="button" class="btnCancelarCorrecao" onclick="carregarAtividadeEntregue()">Cancelar</button>
        <button type="button" class="btnEditarCorrecao" onclick="salvarEdicaoFeedback()">Salvar</button>
    `;
}

async function salvarEdicaoFeedback() {
    let nota = document.getElementById("nota").value;
    let feedback = document.getElementById("feedback-edit").value;
    let idAluno = urlParams.get('idAluno');
    let idAtividade = urlParams.get('idAtividade');

    try {
        // let response = await fetch(`http://localhost:3000/atividade/${idAtividade}/tarefa/${idAluno}/corrigir`, {
        let response = await fetch(`http://localhost:3000/atividades/${idAtividade}/correcao/aluno/${idAluno}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nota, feedback })
        });

        if (!response.ok) throw new Error("Erro ao atualizar correção");
        alert("Correção atualizada com sucesso!");
        carregarAtividadeEntregue();
    } catch (error) {
        console.error("Erro ao editar correção:", error);
        alert("Erro ao atualizar correção.");
    }
}

async function excluirCorrecao() {
    let idAluno = urlParams.get('idAluno');
    let idAtividade = urlParams.get('idAtividade');

    if (!confirm("Tem certeza que deseja excluir esta correção?")) return;

    try {
        // let response = await fetch(`http://localhost:3000/atividade/${idAtividade}/tarefa/${idAluno}/corrigir`, {
        let response = await fetch(`http://localhost:3000/atividades/${idAtividade}/correcao/aluno/${idAluno}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error("Erro ao excluir correção");
        alert("Correção excluída com sucesso!");
        window.location.href = `atividade.html?idA=${idAtividade}`;
    } catch (error) {
        console.error("Erro ao excluir correção:", error);
        alert("Erro ao excluir correção.");
    }
}

async function carregarAtividadeEntregue() {
    let idAtividade = urlParams.get('idAtividade');
    let idAluno = urlParams.get('idAluno');

    let backarrow = document.querySelector('.back-area-btn');
    if (backarrow) {
        backarrow.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = `./atividade.html?idA=${idAtividade}`;
        });
    }

    let tituloDisciplina = document.getElementById('titulo-disciplina');
    tituloDisciplina.textContent = `${user.turmas[0].disciplinas[0].nome}`;

    try {
        let atividade = await carregarAtividadeAluno(idAtividade, idAluno);
        let container = document.querySelector(".atividade-enviada");

        if (atividade.descricaoAluno === null) {
            atividade.descricaoAluno = "Nenhuma descrição fornecida."
        }

        let formHTML = `
            <form id="form-correcao" class="form-correcao">
                <h2>Correção de Atividade</h2>
                <div class="flex-container">
                    <div class="flex-item">
                        <p><strong>Aluno:</strong> ${atividade.nome}</p>
                        <p><strong>RA:</strong> ${atividade.ra}</p>
                    </div>
                    <div class="flex-item">
                        <p><strong>Título da Tarefa:</strong> ${atividade.titulo}</p>
                        <p><strong>Descrição da Tarefa:</strong> ${atividade.descricaoAtividade}</p>
                    </div>
                    <div class="flex-item">
                        <p><strong>Descrição do Aluno:</strong> ${atividade.descricaoAluno}</p>
                        <p><strong>Peso da Atividade (%):</strong> ${atividade.peso}</p>
                    </div>
                </div>
        `;
        if (user.tipo === "colaborador") {
            if (atividade.correcao === 'pendente') {
                formHTML += renderFormularioNota();
            } else {
                let resposta = await buscarResposta(idAtividade, idAluno);
                formHTML += renderRespostaNota(resposta);
            }

            formHTML += `</form>`;
            container.innerHTML = formHTML;

            if (atividade.correcao === 'pendente') {
                document.getElementById("form-correcao").addEventListener("submit", salvarCorrecao);
            }
        }
    } catch (error) {
        console.error("Erro ao carregar atividade entregue:", error);
        alert("Erro ao carregar dados da atividade.");
    }
}

function areaProfessor(idAtividade) {
    alunosRestantes(idAtividade);
    correcaoPendente(idAtividade);
    alunosAtividadeCorrigida(idAtividade);
}

async function carregarAtividade(idAtividade) {
    try {
        let response = await fetch(`http://localhost:3000/atividades/${idAtividade}/`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar atividade: ${response.statusText}`);
        }

        let atividade = await response.json();
        console.log("Atividade carregada:", atividade);

        let disciplinaAtivdade = document.getElementById('titulo-disciplina');
        let tituloAtividade = document.getElementById('titulo-atividade');
        let descricaoAtividade = document.getElementById('descricao-atividade');
        let dataEntrega = document.getElementById('data-entrega');
        let horaEntrega = document.getElementById('hora-entrega');

        let disciplina = user.turmas.flatMap(turma => turma.disciplinas)
            .find(disciplina => disciplina.idDisciplina == atividade.idDisciplina);
        if (disciplina) {
            disciplinaAtivdade.textContent = disciplina.nome;
        }

        tituloAtividade.textContent = atividade.titulo;
        descricaoAtividade.textContent = atividade.descricao;
        dataEntrega.textContent = `Data de Entrega - ${formatarData(atividade.dataEntrega)}`;
        horaEntrega.textContent = `Até às ${formatarHora(atividade.hora)}`;

        let resposta = null;

        try {
            resposta = await carregarAtividadeAluno(idAtividade, user.idReferencia);
        } catch (error) {
            console.warn("Erro ao carregar resposta do aluno:", error);
            resposta = { descricaoAluno: "Nenhuma descrição fornecida." };
        }

        let respostaContainer = document.getElementById('resposta-container');
        if (respostaContainer && user.tipo === "aluno") {
            if(resposta.descricaoAluno === null) {
                resposta.descricaoAluno = "Nenhuma descrição fornecida."
            }
            respostaContainer.innerHTML = resposta
                ? `
                    <h3>Resposta do Aluno:</h3>
                    <p>Descrição: ${resposta.descricaoAluno}</p>
                `
                : `<p>Nenhuma resposta encontrada.</p>`;
        }
        let btnEnviar = document.querySelector(".submit-btn");
        let fileInput = document.querySelector("#arquivo");
        let descricaoInput = document.querySelector("#descricao");

        if (btnEnviar && fileInput && descricaoInput) {
            if (atividade.status === "indisponivel" || user.tipo === "colaborador") {
                [fileInput, descricaoInput, btnEnviar].forEach(element => {
                    element.disabled = true;
                    element.style.backgroundColor = "#cccccc52";
                    element.style.cursor = "not-allowed";
                });
                btnEnviar.style.backgroundColor = "#ccc";
            }
        }
    } catch (error) {
        console.error("Erro ao carregar atividade:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    let toggleMenu = document.getElementById('toggle-menu');
    if (toggleMenu) {
        document.getElementById('toggle-menu').addEventListener('click', () => {
            let sidebar = document.querySelector('.side-menu');
            sidebar.classList.toggle('collapsed');
        });
    }


    let tipoContainer = document.querySelector('.tipo-container');
    if (tipoContainer) {
        carregarTipos();
    }

    let pesoSelect = document.getElementById("peso");
    if (pesoSelect) {
        pesoSelect.addEventListener("input", function () {
            let valor = parseInt(pesoSelect.value, 10);
            if (valor < 1 || valor > 100) {
                pesoSelect.value = "";
                return;
            }
        });
    }

    // ---------------------------------------------------------------------------
    //Adicionar atividade
    let atividadeForm = document.getElementById("atividadeForm");
    if (atividadeForm) {
        document.getElementById("atividadeForm").addEventListener("submit", async function (event) {
            enviarFormulario(event);
        });
    }

    // ---------------------------------------------------------------------
    // Carregar atividades
    let containerAtividades = document.querySelector('.list-atividades');
    if (containerAtividades)
        carregarAtividades();

    if (containerAtividades && user.tipo === "colaborador") {
        // Cria o link para adicionar atividades
        let link = document.createElement("a");
        link.classList.add("adicionarAtividade");
        link.href = `cadastro-atividade.html?idD=${idDisciplina}&idT=${idTurma}`; // Adiciona o idTurma aqui
        link.textContent = `Adicionar Atividades +`;

        // Insere o link antes da lista de atividades
        containerAtividades.insertAdjacentElement('beforebegin', link);
    }

    // -------------------------------------------------------------------------

    let backarrow = document.querySelector('.back-area-btn');
    if (backarrow) {
        backarrow.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = `./atividades-disciplina.html?idD=${user.turmas[0].disciplinas[0].idDisciplina}&idT=${user.turmas[0].idTurma}`;
        });
    }


    let atividadeEnviada = document.querySelector('.atividade-enviada');
    if (atividadeEnviada) {
        carregarAtividadeEntregue();
    }


    let menuLateral = document.querySelector('.menu-lateral');
    if (menuLateral) {
        let idAtividade = urlParams.get('idA');
        carregarAtividade(idAtividade);
        if (user.tipo == "colaborador") {
            areaProfessor(idAtividade);
        }
        else {
            let professorContainer = document.querySelector(".professor-container");
            if (professorContainer) {
                professorContainer.remove();
            }
        }

        document.getElementById('entregaForm').addEventListener('submit', async function (event) {
            event.preventDefault(); // Previne o comportamento padrão do formulário
            let idAluno = user.idReferencia; // ID do aluno (colaborador)
            let descricao = document.getElementById('descricao').value.trim() || "Sem descrição";
            let dataEntrega = new Date().toISOString().split('T')[0];

            if (!descricao) {
                alert('A descrição da atividade é obrigatória.');
                return;
            }
            if (!idAtividade) {
                alert('ID da atividade não encontrado.');
                return;
            }
            if (!idAluno) {
                alert('ID do aluno não encontrado.');
                return;
            }
            if (!dataEntrega) {
                alert('Data atual não encontrada.');
                return;
            }

            try {
                // let response = await fetch('http://localhost:3000/entregar-atividade', {
                let response = await fetch('http://localhost:3000/atividades/aluno', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ idAluno, idAtividade, descricao, dataEntrega }),
                });
                if (response.ok) {
                    alert('Atividade enviada com sucesso!');
                    document.getElementById('entregaForm').reset(); // Limpa o formulário após o envio
                } else {
                    let data = await response.json();
                    alert(`Erro: ${data.message}`);
                }
            } catch (error) {
                console.error('Erro ao enviar a atividade:', error);
                alert('Erro de conexão. Tente novamente.');
            }
            window.location.reload(); // Atualiza a página após o envio
        });
    }
});
