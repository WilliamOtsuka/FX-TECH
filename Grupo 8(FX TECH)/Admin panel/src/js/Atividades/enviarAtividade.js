const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

console.log("Token:", token);
console.log("User:", user);

const urlParams = new URLSearchParams(window.location.search);
const idAtividade = urlParams.get('idA'); // ID da atividade


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

async function alunosRestantes() {
    const response = await fetch(`http://localhost:3000/atividade/${idAtividade}/tarefa/alunos`);
    if (!response.ok) {
        throw new Error(`Erro ao buscar alunos restantes: ${response.statusText}`);
    }

    const alunos = await response.json();
    console.log("Alunos restantes:", alunos);

    const alunosPendentesContainer = document.getElementById('tarefa-pendente-list');
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
        const alunoItem = document.createElement("li");
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

async function correcaoPendente() {
    const response = await fetch(`http://localhost:3000/atividade/${idAtividade}/tarefa/correcao/pendente`);
    if (!response.ok) {
        throw new Error(`Erro ao buscar correções pendentes: ${response.statusText}`);
    }

    const tarefas = await response.json();
    console.log("Correções pendentes:", tarefas);

    const tarefasEntreguesContainer = document.getElementById('tarefa-entregue-list');
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
        const tarefaItem = document.createElement("li");
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
            window.location.href = `atividadeEnviada.html?idAtividade=${tarefa.idAtividade}&idAluno=${tarefa.idAluno}`;
        };
        tarefasEntreguesContainer.appendChild(tarefaItem);
    });
}

async function alunosAtividadeCorrigida() {
    const response = await fetch(`http://localhost:3000/atividade/${idAtividade}/tarefa/correcao/corrigida`);
    if (!response.ok) {
        throw new Error(`Erro ao buscar atividades corrigidas: ${response.statusText}`);
    }

    const tarefasCorrigidas = await response.json();
    console.log("Atividades corrigidas:", tarefasCorrigidas);

    const tarefasCorrigidasContainer = document.getElementById('tarefa-corrigida-list');
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
        const tarefaItem = document.createElement("li");
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
            window.location.href = `atividadeEnviada.html?idAtividade=${tarefa.idAtividade}&idAluno=${tarefa.idAluno}`;
        };

        tarefasCorrigidasContainer.appendChild(tarefaItem);
    });
}

async function carregarAtividadeAluno(idAtividade, idAluno) {
    const response = await fetch(`http://localhost:3000/atividade/${idAtividade}/tarefa/${idAluno}`);
    if (!response.ok) {
        throw new Error(`Erro ao buscar atividade entregue: ${response.statusText}`);
    }
    return response.json();
}

async function salvarCorrecao(event) {
    event.preventDefault();

    const idAtividade = urlParams.get('idAtividade');
    const idAluno = urlParams.get('idAluno');

    const nota = parseFloat(document.getElementById("nota").value);
    const feedback = document.getElementById("feedback").value;

    try {
        const response = await fetch(`http://localhost:3000/atividade/${idAtividade}/tarefa/${idAluno}/corrigir`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nota, feedback })
        });

        const data = await response.json();

        if (!response.ok) {
            // Se a atividade estiver como "disponível", o back retorna 403
            if (response.status === 403) {
                alert(data.message); // "Não é possível corrigir uma atividade ainda disponível."
            } else {
                alert(data.message || "Erro ao salvar correção.");
            }
            return;
        }

        alert("Correção salva com sucesso!");
        // Você pode atualizar a interface, recarregar a página ou redirecionar, se quiser
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
            <button type="button" class="btnEditarCorrecao" onclick="ativarEdicao('${nota}', '${feedback}')">Editar Correção</button>
            <button type="button" class="btnExcluirCorrecao" onclick="excluirCorrecao()">Excluir Correção</button>
        </div>
    `;
}

async function buscarResposta(idAtividade, idAluno) {
    const resposta = await fetch(`http://localhost:3000/atividade/${idAtividade}/tarefa/${idAluno}/resposta`);
    if (!resposta.ok) throw new Error("Erro ao buscar resposta do aluno.");
    return await resposta.json();
}

function ativarEdicao(nota, feedback) {
    document.getElementById("nota-container").innerHTML = `
        <label for="nota">Nota:</label>
        <input type="number" id="nota" value="${nota}" min="0" max="10" step="0.01">
    `;
    document.getElementById("feedback-container").innerHTML = `
        <label for="feedback-edit">Feedback:</label>
        <textarea id="feedback-edit" rows="4">${feedback}</textarea>
    `;

    document.querySelector(".btnsFormCorrecao").innerHTML = `
        <button type="button" class="btnEditarCorrecao" onclick="salvarEdicao()">Salvar</button>
        <button type="button" class="btnCancelarCorrecao" onclick="carregarAtividadeEntregue()">Cancelar</button>
    `;
}

async function salvarEdicao() {
    const nota = document.getElementById("nota").value;
    const feedback = document.getElementById("feedback-edit").value;
    const idAluno = urlParams.get('idAluno');
    const idAtividade = urlParams.get('idAtividade');

    try {
        const response = await fetch(`http://localhost:3000/atividade/${idAtividade}/tarefa/${idAluno}/corrigir`, {
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
    const idAluno = urlParams.get('idAluno');
    const idAtividade = urlParams.get('idAtividade');

    if (!confirm("Tem certeza que deseja excluir esta correção?")) return;

    try {
        const response = await fetch(`http://localhost:3000/atividade/${idAtividade}/tarefa/${idAluno}/corrigir`, {
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
    const idAtividade = urlParams.get('idAtividade');
    const idAluno = urlParams.get('idAluno');

    const backarrow = document.querySelector('.back-area-btn');
    if (backarrow) {
        backarrow.addEventListener('click', function (e) {
            e.preventDefault(); 
            window.location.href = `./atividade.html?idA=${idAtividade}`;  
        });
    }

    const tituloMateria = document.getElementById('titulo-materia');
    tituloMateria.textContent = `${user.turmas[0].materias[0].nome}`; // Exemplo de como pegar o nome da matéria, ajuste conforme necessário

    try {
        const atividade = await carregarAtividadeAluno(idAtividade, idAluno);
        const container = document.querySelector(".atividade-enviada");

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
        if (user.tipo === "professor") {
            if (atividade.correcao === 'pendente') {
                formHTML += renderFormularioNota();
            } else {
                const resposta = await buscarResposta(idAtividade, idAluno);
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

function areaProfessor() {
    alunosRestantes();
    correcaoPendente();
    alunosAtividadeCorrigida();
}

async function carregarAtividade() {
    if (!idAtividade || isNaN(idAtividade)) {
        console.error("ID da atividade não encontrado ou inválido na URL.");
        return;
    }

    console.log("ID da Atividade:", idAtividade);

    try {
        const response = await fetch(`http://localhost:3000/atividades/${idAtividade}/`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar atividade: ${response.statusText}`);
        }

        const atividade = await response.json();
        console.log("Atividade carregada:", atividade);

        const materiaAtivdade = document.getElementById('titulo-materia');
        const tituloAtividade = document.getElementById('titulo-atividade');
        const descricaoAtividade = document.getElementById('descricao-atividade');
        const dataEntrega = document.getElementById('data-entrega');
        const horaEntrega = document.getElementById('hora-entrega');

        const materia = user.turmas.flatMap(turma => turma.materias)
            .find(materia => materia.idMateria == atividade.idMateria);
        if (materia) {
            materiaAtivdade.textContent = materia.nome;
        }

        tituloAtividade.textContent = atividade.titulo;
        descricaoAtividade.textContent = atividade.descricao;
        dataEntrega.textContent = `Data de Entrega - ${formatarData(atividade.dataEntrega)}`;
        horaEntrega.textContent = `Até às ${formatarHora(atividade.hora)}`;

        const resposta = await carregarAtividadeAluno(idAtividade, user.idReferencia);
        const respostaContainer = document.getElementById('resposta-container');
        respostaContainer.innerHTML = resposta
            ? `
                <h3>Resposta do Aluno:</h3>
                <p>Descrição: ${resposta.descricao}</p>
              `
            : `<p>Nenhuma resposta encontrada.</p>`;

        const btnEnviar = document.querySelector(".submit-btn");
        const fileInput = document.querySelector("#arquivo");
        const descricaoInput = document.querySelector("#descricao");

        if (atividade.status === "indisponivel" || user.tipo === "professor") {
            [fileInput, descricaoInput, btnEnviar].forEach(element => {
                element.disabled = true;
                element.style.backgroundColor = "#cccccc52";
                element.style.cursor = "not-allowed";
            });
            btnEnviar.style.backgroundColor = "#ccc";
        }
    } catch (error) {
        console.error("Erro ao carregar atividade:", error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const backarrow = document.querySelector('.back-area-btn');
    if (backarrow) {
        backarrow.addEventListener('click', function (e) {
            e.preventDefault(); 
            window.location.href = `./atividadesMateria.html?idM=${user.turmas[0].materias[0].idMateria}&idT=${user.turmas[0].idTurma}`;  
        });
    }

    const atividadeEnviada = document.querySelector('.atividade-enviada');
    if (atividadeEnviada) {
        carregarAtividadeEntregue();
    }

    const menuLateral = document.querySelector('.menu-lateral');
    if (menuLateral) {
        carregarAtividade();
        if (user.tipo == "professor") {
            areaProfessor();
        }
        else {
            const professorContainer = document.querySelector(".professor-container");
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
                const response = await fetch('http://localhost:3000/entregar-atividade', {
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
                    const data = await response.json();
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