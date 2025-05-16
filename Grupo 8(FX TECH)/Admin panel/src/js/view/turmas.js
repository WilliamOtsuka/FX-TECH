let urlParams = new URLSearchParams(window.location.search);
let idTurma = urlParams.get("idT");
let idDisciplina = urlParams.get("idD");

async function carregarParticipantes() {
    try {
        // let response = await fetch(`http://localhost:3000/disciplinas/${idDisciplina}/participantes/${idTurma}`);
        let response = await fetch(`http://localhost:3000/turmas/${idTurma}/disciplina/${idDisciplina}/participantes`);
        if (!response.ok) throw new Error(`Erro ao buscar participantes: ${response.statusText}`);
        let participantes = await response.json();

        console.log("Participantes:", participantes);

        let listaAlunos = document.querySelector('.list-alunos');
        let listaProfessores = document.querySelector('.list-professor');

        if (!listaAlunos || !listaProfessores) {
            console.error("Elementos .list-alunos ou .list-professor não encontrados!");
            return;
        }

        let contadorAlunos = 1; // Inicializa o contador para os alunos

        participantes.forEach(participante => {
            let divParticipante = document.createElement("div");
            divParticipante.classList.add("participante");

            let nomeDiv = document.createElement("div");
            nomeDiv.classList.add("nome");

            // A contagem será inserida antes do nome do aluno
            if (participante.tipo === "aluno") {
                nomeDiv.textContent = `${contadorAlunos} - ${participante.nome}`;
                contadorAlunos++; // Incrementa o contador para alunos
            } else if (participante.tipo === "colaborador") {
                nomeDiv.textContent = participante.nome;
            }

            let emailDiv = document.createElement("div");
            emailDiv.classList.add("email");
            emailDiv.textContent = participante.email_pessoal;

            divParticipante.appendChild(nomeDiv); // Adiciona o nome (com contagem, se for aluno)
            divParticipante.appendChild(emailDiv); // Adiciona o email

            // Adiciona à lista de alunos ou professores
            if (participante.tipo === "aluno") {
                listaAlunos.appendChild(divParticipante);
            } else if (participante.tipo === "colaborador") {
                listaProfessores.appendChild(divParticipante);
            }
        });

        console.log(`Total de alunos: ${contadorAlunos - 1}`);
    } catch (error) {
        console.error("Erro ao carregar participantes:", error);
        alert("Erro ao carregar participantes. Verifique sua conexão ou tente novamente mais tarde.");
    }
}

async function modalDisciplinas(idTurma, token) {
    try {
        // Busca disciplinas da turma
        const response = await fetch(`http://localhost:3000/turmas/${idTurma}/disciplinas`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Erro ao buscar as disciplinas da turma");
        let disciplinasTurma = await response.json();

        // Busca todas as disciplinas disponíveis
        const allDisciplinasRes = await fetch("http://localhost:3000/disciplinas", {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!allDisciplinasRes.ok) throw new Error("Erro ao buscar todas as disciplinas");
        let todasDisciplinas = await allDisciplinasRes.json();

        // Inicializa listas
        let disciplinasDisponiveis = todasDisciplinas.filter(
            disc => !disciplinasTurma.some(turmaDisc => turmaDisc.idDisciplina === disc.idDisciplina)
        );
        let disciplinasAdicionadas = [];
        let disciplinasRemovidas = [];

        // Renderiza as listas na modal
        function renderizarListas() {
            const ulTurma = document.getElementById("disciplinasTurma");
            const ulDisponiveis = document.getElementById("disciplinasDisponiveis");
            ulTurma.innerHTML = "";
            ulDisponiveis.innerHTML = "";

            disciplinasTurma.forEach(d => {
                const li = document.createElement("li");
                li.textContent = d.nome;
                li.onclick = () => {
                    disciplinasTurma = disciplinasTurma.filter(item => item.idDisciplina !== d.idDisciplina);
                    disciplinasDisponiveis.push(d);
                    if (!disciplinasRemovidas.some(item => item.idDisciplina === d.idDisciplina)) {
                        disciplinasRemovidas.push(d);
                    }
                    disciplinasAdicionadas = disciplinasAdicionadas.filter(item => item.idDisciplina !== d.idDisciplina);
                    renderizarListas();
                    atualizarBotaoSalvar();
                };
                ulTurma.appendChild(li);
            });

            disciplinasDisponiveis.forEach(d => {
                const li = document.createElement("li");
                li.textContent = d.nome;
                li.onclick = () => {
                    disciplinasDisponiveis = disciplinasDisponiveis.filter(item => item.idDisciplina !== d.idDisciplina);
                    disciplinasTurma.push(d);
                    if (!disciplinasAdicionadas.some(item => item.idDisciplina === d.idDisciplina)) {
                        disciplinasAdicionadas.push(d);
                    }
                    disciplinasRemovidas = disciplinasRemovidas.filter(item => item.idDisciplina !== d.idDisciplina);
                    renderizarListas();
                    atualizarBotaoSalvar();
                };
                ulDisponiveis.appendChild(li);
            });
        }

        // Atualiza o estado do botão de salvar
        function atualizarBotaoSalvar() {
            const botaoSalvar = document.querySelector(".btn-disciplina-modal");
            const habilitar = disciplinasAdicionadas.length > 0 || disciplinasRemovidas.length > 0;
            botaoSalvar.disabled = !habilitar;
            botaoSalvar.style.cursor = habilitar ? "pointer" : "not-allowed";
            botaoSalvar.style.opacity = habilitar ? "1" : "0.5";
        }

        renderizarListas();
        atualizarBotaoSalvar();

        // Exibe a modal
        const modal = document.getElementById("disciplinasModal");
        modal.style.display = "flex";
        modal.classList.add("fade-in");

        // Fecha modal
        document.getElementById("closeDisciplinasModal").onclick = () => {
            modal.style.display = "none";
        };

        // Salvar alterações
        document.querySelector(".btn-disciplina-modal").onclick = async () => {
            try {
                // Adiciona disciplinas
                if (disciplinasAdicionadas.length > 0) {
                    const resAdd = await fetch(`http://localhost:3000/disciplinas/turma/${idTurma}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            adicionadas: disciplinasAdicionadas.map(d => d.idDisciplina)
                        })
                    });
                    if (!resAdd.ok) throw new Error("Erro ao adicionar disciplinas à turma");
                }

                // Remove disciplinas
                if (disciplinasRemovidas.length > 0) {
                    const resRemove = await fetch(`http://localhost:3000/disciplinas/turma/${idTurma}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            removidas: disciplinasRemovidas.map(d => d.idDisciplina)
                        })
                    });
                    if (!resRemove.ok) throw new Error("Erro ao remover disciplinas da turma");
                }

                alert("Disciplinas atualizadas com sucesso!");
                modal.style.display = "none";
            } catch (error) {
                console.error("Erro ao atualizar/remover disciplinas:", error);
                alert("Erro ao atualizar/remover as disciplinas. Tente novamente.");
            }
        };

    } catch (error) {
        console.error(error);
        alert("Erro ao carregar as disciplinas.");
    }
}

async function modalParticipantes(idTurma, token) {
    try {
        let response = await fetch(`http://localhost:3000/turmas/${idTurma}/disciplina/participantes`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error("Erro ao buscar os participantes");
        }
        let participantes = await response.json();
        console.log(participantes);

        // Seleciona a lista de participantes
        let participantesList = document.querySelector("#participantesList");
        if (participantesList) {
            // Limpa o conteúdo existente na lista
            participantesList.innerHTML = "";

            // Adiciona os participantes na lista
            participantes.forEach((participante) => {
                let listItem = document.createElement("li");
                listItem.textContent = `${participante.nome} - ${participante.ra}`;
                participantesList.appendChild(listItem);
            });

            // Exibe a modal
            let modal = document.querySelector("#participantesModal");
            if (modal) {
                modal.style.display = "flex";
                modal.classList.add("fade-in");

            }

            // Fecha a modal ao clicar no botão de fechar
            let closeModalBtn = document.querySelector("#closeParticipantesModal");
            if (closeModalBtn) {
                closeModalBtn.onclick = () => {
                    modal.style.display = "none";
                };
            }
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao carregar os participantes.");
    }
}

async function deleteTurma(id, token) {
    try {
        let response = await fetch(`http://localhost:3000/turmas/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error("Erro ao excluir a turma");
        }
        else {
            alert("Turma excluída com sucesso!");
        }
        window.location.reload(); // Atualiza a página para refletir a exclusão
    }
    catch (error) {
        console.error(error);
        alert("Erro ao excluir a turma.");
    }
}

async function anoLetivo(token) {
    try {
        let response = await fetch("http://localhost:3000/ano_letivo", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error("Erro ao buscar os anos letivos");
        }
        let anos = await response.json();
        console.log(anos);
        // Seleciona o elemento de ano letivo
        let anoSelect = document.querySelector("#editClassYear");
        // Limpa o conteúdo existente
        anoSelect.innerHTML = "";
        // Adiciona as opções de anos letivos
        anos.forEach(ano => {
            let option = document.createElement("option");
            option.value = ano.idAno_letivo;
            option.textContent = ano.ano;
            anoSelect.appendChild(option);
        });
    }
    catch (error) {
        console.error(error);
        alert("Erro ao carregar os anos letivos.");
    }
}

async function editarTurma(id, token) {
    let nome = document.querySelector("#editClassName").value;
    let ano = document.querySelector("#editClassYear").selectedOptions[0].textContent;
    let nivel = document.querySelector("#editClassLevel").value;
    let turma = {
        nome: nome,
        anoLetivo: ano,
        ensino: nivel
    };
    try {
        let response = await fetch(`http://localhost:3000/turmas/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(turma)
        });
        if (!response.ok) {
            throw new Error("Erro ao editar a turma");
        }
        alert("Turma editada com sucesso!");
        let dialogOverlay = document.querySelector("#editDialog");
        if (dialogOverlay) {
            dialogOverlay.style.display = "none";
            dialogOverlay.classList.remove("fade-in");
        }
        window.location.reload(); // Atualiza a página para refletir a edição
    }
    catch (error) {
        console.error(error);
        alert("Erro ao editar a turma.");
    }
}

async function tabelaClasse() {
    let token = localStorage.getItem("token");
    try {
        let response = await fetch("http://localhost:3000/turmas", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error("Erro ao buscar as turmas");
        }
        let turmas = await response.json();
        console.log(turmas);
        // Seleciona o corpo da tabela
        let tableBody = document.querySelector("#userTable tbody");
        // Limpa o conteúdo existente na tabela
        tableBody.innerHTML = "";
        // Adiciona as turmas na tabela
        turmas.forEach(turma => {
            let row = document.createElement("tr");
            row.id = turma.idTurma;
            row.innerHTML = `
                <td class="class-name">${turma.nome}</td>
                <td class="class-year">${turma.anoLetivo}</td>
                <td class="class-level">${turma.ensino}</td>
                <td class="class-disciplines"><button class="btn-disciplinas">Disciplinas</button></td>
                <td class="class-participants"><button class="btn-participantes">Participantes</button></td>
                <td class="class-actions">
                    <button class="btn-edit"><i class="material-icons editBtn">edit</i></button>
                    <button class="btn-delete"><i class="material-icons deleteBtn">delete</i></button>
                </td>
            `;
            // Adiciona o evento de ver disciplinas
            row.querySelector(".btn-disciplinas").onclick = () => {
                modalDisciplinas(turma.idTurma, token);
            };
            // Adiciona o evento de ver participantes
            row.querySelector(".btn-participantes").onclick = () => {
                modalParticipantes(turma.idTurma, token);
            };

            // Adiciona o evento de exclusão
            row.querySelector(".btn-delete").onclick = async () => {
                if (confirm("A TURMA PODE CONTER DADOS DE ALUNOS E DISCIPLINAS, TEM CERTEZA QUE DESEJA EXCLUIR?")) {
                    try {
                        await deleteTurma(row.id, token);
                        tabelaClasse();
                    } catch (err) {
                        console.error("Erro ao excluir turma:", err);
                        alert("Erro ao excluir turma. Tente novamente.");
                    }
                }
            };
            // Adiciona o evento de edição
            row.querySelector(".btn-edit").onclick = async () => {
                let dialogOverlay = document.querySelector("#editDialog");
                dialogOverlay.style.display = "flex";
                dialogOverlay.classList.add("fade-in");

                // Aguarda o carregamento das opções do ano letivo
                await anoLetivo(token); // <-- importante

                // Preenche os campos com os dados da turma
                document.querySelector("#editClassName").value = turma.nome;
                document.querySelector("#editClassLevel").value = turma.ensino;

                // Seleciona o ano letivo correto no <select>
                const selectAno = document.querySelector("#editClassYear");
                for (let option of selectAno.options) {
                    if (option.textContent == turma.anoLetivo || option.value == turma.anoLetivo) {
                        option.selected = true;
                        break;
                    }
                }

                document.querySelector("#confirmEdit").onclick = () => editarTurma(turma.idTurma, token);
            };

            tableBody.appendChild(row);
        });
        document.addEventListener("click", (event) => {
            if (event.target.classList.contains("closeBtn") || event.target.id === "closeEditDialog") {
                let dialogOverlay = document.querySelector("#editDialog");
                if (dialogOverlay) {
                    dialogOverlay.style.display = "none";
                    dialogOverlay.classList.remove("fade-in");
                }
            }
        });
    } catch (error) {
        console.error(error);
        alert("Erro ao carregar as turmas.");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    let containerParticipantes = document.querySelector('.list-participantes');
    if (containerParticipantes) {
        carregarParticipantes();
    }

    let listTurma = document.querySelector("#class-list");
    if (listTurma) {
        lucide.createIcons();
        tabelaClasse();
    }
});
