let token = localStorage.getItem("token");
let user = JSON.parse(localStorage.getItem("user"));

let urlParams = new URLSearchParams(window.location.search);
let idDisciplina = urlParams.get("idD");
let idTurma = urlParams.get("idT");

function criarDropdownAlunos() {
    let mainNotas = document.querySelector(".main-notas");

    let dropdownContainer = document.createElement("div");
    dropdownContainer.style.marginBottom = "16px";

    let label = document.createElement("label");
    label.setAttribute("for", "alunoSelect");
    label.textContent = "Selecione o aluno:";

    let select = document.createElement("select");
    select.id = "alunoSelect";
    select.innerHTML = `<option value="">-- Selecione um aluno --</option>`;

    select.addEventListener("change", () => {
        // Torna impossível selecionar a opção com value=""
        let defaultOption = select.querySelector('option[value=""]');
        if (defaultOption) defaultOption.disabled = true;
    });

    dropdownContainer.appendChild(label);
    dropdownContainer.appendChild(document.createElement("br"));
    dropdownContainer.appendChild(select);

    // Insere o dropdown no início do main, antes dos bimestres
    mainNotas.insertBefore(dropdownContainer, mainNotas.querySelector(".bimestre-container"));
}

async function carregarAlunosDropdown() {
    try {
        // let response = await fetch(`http://localhost:3000/disciplinas/${idDisciplina}/participantes/${idTurma}`);
        let response = await fetch(`http://localhost:3000/turmas/${idTurma}/disciplina/${idDisciplina}/participantes`);
        if (!response.ok) throw new Error("Erro ao buscar participantes");

        let participantes = await response.json();
        let select = document.getElementById("alunoSelect");

        participantes
            .filter(p => p.tipo === "aluno")
            .sort((a, b) => a.nome.localeCompare(b.nome))
            .forEach(aluno => {
                let option = document.createElement("option");
                option.value = aluno.id;
                option.textContent = aluno.nome;
                select.appendChild(option);
            });

        select.addEventListener("change", () => {
            let idAluno = select.value;
            if (idAluno) buscarNotasProfessor(idAluno);
        });
    } catch (error) {
        console.error("Erro ao carregar dropdown de alunos:", error);
    }
}

async function buscarNotasAluno() {
    let idAluno = user.idReferencia;

    try {
        // let response = await fetch(`http://localhost:3000/notas-aluno/${idAluno}/${idDisciplina}/${idTurma}`, {
        let response = await fetch(`http://localhost:3000/notas/aluno/${idAluno}/disciplina/${idDisciplina}/turma/${idTurma}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error("Erro ao buscar notas");

        let dados = await response.json();

        // Filtrar apenas as notas do aluno
        let notasAluno = dados.filter(item => item.idAluno === idAluno);
        console.log("Notas do aluno:", notasAluno);

        // Estrutura para organizar as notas por bimestre
        let bimestres = {
            '1º Bimestre': [],
            '2º Bimestre': [],
            '3º Bimestre': [],
            '4º Bimestre': [],
        };

        // Distribuir as notas nos bimestres correspondentes
        notasAluno.forEach(item => {
            if (bimestres[item.bimestre]) {
                bimestres[item.bimestre].push(item);
            }
        });

        // Iterar pelos bimestres e criar as tabelas
        Object.entries(bimestres).forEach(([bimestre, atividades]) => {
            // Seleciona o contêiner do bimestre correspondente
            let container = Array.from(document.querySelectorAll('.bimestre-container'))
                .find(div => div.querySelector('h2')?.textContent.includes(bimestre));

            if (!container) return; // Se o contêiner não existir, pula para o próximo bimestre

            let tabelaContainer = container.querySelector('.tabela-notas');
            tabelaContainer.innerHTML = ''; // Limpa o conteúdo anterior

            if (atividades.length === 0) {
                tabelaContainer.innerHTML = `<p>Sem atividades registradas para este bimestre.</p>`;
                return;
            }

            // Cria a tabela
            let tabela = document.createElement("table");
            tabela.classList.add("tabela", `tabela-${bimestre.replace('º ', '').toLowerCase()}`); // Adiciona classes específicas para o bimestre

            // Cria o cabeçalho da tabela
            let thead = document.createElement("thead");
            thead.classList.add("tabela-head");
            thead.innerHTML = `
                <tr class="tabela-head-row">
                    <th class="tabela-head-cell">Nome da Atividade</th>
                    <th class="tabela-head-cell">Peso</th>
                    <th class="tabela-head-cell">Nota</th>
                    <th class="tabela-head-cell">Nota Calculada</th>
                </tr>
            `;
            tabela.appendChild(thead);

            // Cria o corpo da tabela
            let tbody = document.createElement("tbody");
            tbody.classList.add("tabela-body");

            let notaFinal = 0;

            atividades.forEach(({ nomeAtividade, peso, nota }) => {
                let notaCalculada = nota * (peso / 100); // Calcula a nota final da atividade
                notaFinal += parseFloat(notaCalculada); // Soma a nota calculada para o bimestre
                let linha = document.createElement("tr");
                linha.classList.add("tabela-body-row");
                linha.innerHTML = `
                    <td class="tabela-body-cell">${nomeAtividade}</td>
                    <td class="tabela-body-cell">${peso}</td>
                    <td class="tabela-body-cell">${nota}</td>
                    <td class="tabela-body-cell">${notaCalculada.toFixed(2)}</td>
                `;
                tbody.appendChild(linha);
            });

            // Adiciona uma linha final com a nota final do bimestre
            let linhaFinal = document.createElement("tr");
            linhaFinal.classList.add("tabela-body-row-final");
            linhaFinal.innerHTML = `
                <td class="tabela-body-cell" colspan="3">Nota Final</td>
                <td class="tabela-body-cell"><strong>${notaFinal.toFixed(2)}</strong></td>
            `;
            tbody.appendChild(linhaFinal);

            tabela.appendChild(tbody);
            tabelaContainer.appendChild(tabela);
        });

    } catch (err) {
        console.error("Erro ao carregar notas:", err);
        alert("Erro ao buscar notas. Tente novamente mais tarde.");
    }
}

async function buscarNotasProfessor(idAluno) {
    try {
        // let response = await fetch(`http://localhost:3000/notas-aluno/${idAluno}/${idDisciplina}/${idTurma}`);
        let response = await fetch(`http://localhost:3000/notas/aluno/${idAluno}/disciplina/${idDisciplina}/turma/${idTurma}`);
        if (!response.ok) throw new Error("Erro ao buscar notas do aluno");

        let dados = await response.json();
        console.log("Notas do aluno selecionado:", dados);

        // Estrutura para organizar as notas por bimestre
        let bimestres = {
            '1º Bimestre': [],
            '2º Bimestre': [],
            '3º Bimestre': [],
            '4º Bimestre': [],
        };

        // Organiza os dados nos bimestres corretos
        if (!Array.isArray(dados)) {
            console.error("Dados não é um array:", dados);
            return;
        }

        dados.forEach(item => {
            if (bimestres[item.bimestre]) {
                bimestres[item.bimestre].push(item);
            }
        });

        // Limpa os containers das tabelas
        document.querySelectorAll(".tabela-notas").forEach(tabela => tabela.innerHTML = "");

        // Itera e gera as tabelas por bimestre
        Object.entries(bimestres).forEach(([bimestre, atividades]) => {
            let container = Array.from(document.querySelectorAll('.bimestre-container'))
                .find(div => div.querySelector('h2')?.textContent.includes(bimestre));

            if (!container) return;

            let tabelaContainer = container.querySelector('.tabela-notas');
            tabelaContainer.innerHTML = '';

            if (atividades.length === 0) {
                tabelaContainer.innerHTML = `<p>Sem atividades registradas para este bimestre.</p>`;
                return;
            }

            let tabela = document.createElement("table");
            tabela.classList.add("tabela", `tabela-${bimestre.replace('º ', '').toLowerCase()}`);

            let thead = document.createElement("thead");
            thead.classList.add("tabela-head");
            thead.innerHTML = `
                <tr class="tabela-head-row">
                    <th class="tabela-head-cell">Nome da Atividade</th>
                    <th class="tabela-head-cell">Peso</th>
                    <th class="tabela-head-cell">Nota</th>
                    <th class="tabela-head-cell">Nota Calculada</th>
                </tr>
            `;
            tabela.appendChild(thead);

            let tbody = document.createElement("tbody");
            tbody.classList.add("tabela-body");

            let notaFinal = 0;

            atividades.forEach(({ nomeAtividade, peso, nota }) => {
                let notaCalculada = nota * (peso / 100);
                notaFinal += parseFloat(notaCalculada);

                let linha = document.createElement("tr");
                linha.classList.add("tabela-body-row");
                linha.innerHTML = `
                    <td class="tabela-body-cell">${nomeAtividade}</td>
                    <td class="tabela-body-cell">${peso}</td>
                    <td class="tabela-body-cell">${nota}</td>
                    <td class="tabela-body-cell">${notaCalculada.toFixed(2)}</td>
                `;
                tbody.appendChild(linha);
            });

            let linhaFinal = document.createElement("tr");
            linhaFinal.classList.add("tabela-body-row-final");
            linhaFinal.innerHTML = `
                <td class="tabela-body-cell" colspan="3">Nota Final</td>
                <td class="tabela-body-cell"><strong>${notaFinal.toFixed(2)}</strong></td>
            `;
            tbody.appendChild(linhaFinal);

            tabela.appendChild(tbody);
            tabelaContainer.appendChild(tabela);
        });

    } catch (error) {
        console.error("Erro ao buscar/exibir notas:", error);
        alert("Erro ao buscar as notas do aluno.");
    }
}

async function exibirNotasAlunoP(dados, nomeDisciplina) {
    let tabela = document.querySelector(".fl-table");
    if (!tabela) return console.error("Tabela não encontrada!");

    let bimestres = {
        '1º Bimestre': [],
        '2º Bimestre': [],
        '3º Bimestre': [],
        '4º Bimestre': [],
    };

    // Agrupa as atividades por bimestre
    dados.forEach(item => {
        if (bimestres[item.bimestre]) {
            bimestres[item.bimestre].push(item);
        }
    });

    let tbody = tabela.querySelector("tbody");
    if (!tbody) return console.error("Estrutura da tabela inválida!");

    let linha = tbody.querySelector("tr");
    if (!linha) return console.error("Linha da tabela não encontrada!");

    let celulas = linha.querySelectorAll("td");

    // Define o nome da disciplina na primeira célula
    if (celulas[0]) {
        let divs = celulas[0].querySelectorAll("div");
        if (divs.length > 0) {
            divs[0].textContent = nomeDisciplina;
        }
    }

    let index = 1;
    for (let [bimestre, atividades] of Object.entries(bimestres)) {
        let notaCalculada = 0;
        let notaFinal = 0;

        atividades.forEach(({ nota, peso }) => {
            notaCalculada = nota * (peso / 100);
            notaFinal += parseFloat(notaCalculada);
        });

        if (celulas[index]) celulas[index].textContent = notaFinal.toFixed(2);
        index++;
    }

    // Cálculo e preenchimento da média final
    if (celulas[5]) {
        let somaNotas = Object.values(bimestres).reduce((soma, ativs) => {
            return soma + ativs.reduce((acc, { nota, peso }) => acc + (nota * (peso / 100)), 0);
        }, 0);

        let qtdBimestres = Object.values(bimestres).filter(ativs => ativs.length > 0).length;
        if (qtdBimestres > 0) {
            let mediaFinal = somaNotas / qtdBimestres;
            celulas[5].textContent = mediaFinal.toFixed(2);
        }
    }
}


// Disciplinas gerais
async function tabelaNotasProfessor(idTurma) {
    let tfooter = document.querySelector(".tfoot-notas");
    if (tfooter) tfooter.remove(); // Remove o rodapé se existir

    let ddTurmas = document.querySelector(".list-turmas");
    if (!ddTurmas) return console.error("Elemento .list-turmas não encontrado!");

    // --- Dropdown de Disciplinas ---
    let disciplinaWrapper = document.createElement("div");
    disciplinaWrapper.style.marginTop = "10px";

    let labelDisciplina = document.createElement("label");
    labelDisciplina.setAttribute("for", "disciplinaSelect");
    labelDisciplina.textContent = "Selecione a disciplina: ";

    let selectDisciplina = document.createElement("select");
    selectDisciplina.id = "disciplinaSelect";
    selectDisciplina.innerHTML = `<option value="">-- Selecione uma Disciplina --</option>`;

    // --- Dropdown de Alunos ---
    let alunoWrapper = document.createElement("div");
    alunoWrapper.style.marginTop = "10px";

    let labelAluno = document.createElement("label");
    labelAluno.setAttribute("for", "alunoSelect");
    labelAluno.textContent = "Selecione o aluno: ";

    let selectAluno = document.createElement("select");
    selectAluno.id = "alunoSelect";
    selectAluno.innerHTML = `<option value="">-- Selecione um Aluno --</option>`;

    // Evento: Quando selecionar uma turma
    if (idTurma) {
        document.querySelectorAll(".nota").forEach(tabela => (tabela.innerHTML = ""));

        // Limpa selects
        selectDisciplina.innerHTML = `<option value="">-- Selecione uma Disciplina --</option>`;
        selectAluno.innerHTML = `<option value="">-- Selecione um Aluno --</option>`;

        // Disciplinas da turma
        let turmaSelecionada = user.turmas.find(t => t.idTurma == idTurma);
        if (turmaSelecionada?.disciplinas?.length > 0) {
            turmaSelecionada.disciplinas.forEach(disciplina => {
                let option = document.createElement("option");
                option.value = disciplina.idDisciplina;
                option.textContent = disciplina.nome;
                selectDisciplina.appendChild(option);
            });
        }
    }

    // Evento: Quando selecionar uma disciplina
    selectDisciplina.addEventListener("change", async () => {
        let idDisciplina = selectDisciplina.value;

        // Limpa o select de alunos
        selectAluno.innerHTML = `<option value="">-- Selecione um Aluno --</option>`;

        if (!idDisciplina) return;

        // Buscar alunos da turma e disciplina selecionada
        try {
            // let response = await fetch(`http://localhost:3000/disciplinas/${idDisciplina}/participantes/${idTurma}`);
            let response = await fetch(`http://localhost:3000/turmas/${idTurma}/disciplina/${idDisciplina}/participantes`);
            if (!response.ok) throw new Error("Erro ao buscar alunos da turma e disciplina");

            let alunos = await response.json();
            console.log("Alunos da turma e disciplina:", alunos);
            alunos
                .filter(a => a.tipo === "aluno")
                .sort((a, b) => a.nome.localeCompare(b.nome))
                .forEach(aluno => {
                    let option = document.createElement("option");
                    option.value = aluno.id;
                    option.textContent = `${aluno.nome} - ${aluno.ra}`;

                    selectAluno.appendChild(option);
                });
        } catch (err) {
            console.error("Erro ao buscar alunos:", err);
        }
    });

    // Montar estrutura na tela
    ddTurmas.appendChild(disciplinaWrapper);
    ddTurmas.appendChild(alunoWrapper);

    disciplinaWrapper.appendChild(labelDisciplina);
    disciplinaWrapper.appendChild(selectDisciplina);

    alunoWrapper.appendChild(labelAluno);
    alunoWrapper.appendChild(selectAluno);

    // Evento: Quando selecionar um aluno
    selectAluno.addEventListener("change", async () => {
        let idAluno = selectAluno.value;
        if (idAluno) {
            try {
                let idDisciplina = selectDisciplina.value;
                console.log(`ID do aluno: ${idAluno}, ID da disciplina: ${idDisciplina}, ID da turma: ${idTurma}`);
                // let response = await fetch(`http://localhost:3000/notas-aluno/${idAluno}/${idDisciplina}/${idTurma}`);
                let response = await fetch(
                    `http://localhost:3000/notas/aluno/${idAluno}/disciplina/${idDisciplina}/turma/${idTurma}`
                );
                if (!response.ok) throw new Error("Erro ao buscar notas do aluno");
                let dados = await response.json();
                // Aqui você pode chamar a função para exibir as notas do aluno
                console.log("Notas do aluno:", dados);
                let nomeDisciplina = selectDisciplina.options[selectDisciplina.selectedIndex].textContent;
                exibirNotasAlunoP(dados, nomeDisciplina);
            } catch (err) {
                console.error("Erro ao buscar notas do aluno:", err);
                alert("Erro ao buscar notas do aluno. Tente novamente mais tarde.");
            }
        }
    });
}

async function exibirTodasNotas(dados) {
    const tabela = document.querySelector(".fl-table");
    if (!tabela) return console.error("Tabela não encontrada!");

    const tbody = tabela.querySelector("tbody");
    if (!tbody) return console.error("Corpo da tabela não encontrado!");

    const tfoot = tabela.querySelector(".tfoot-notas tr");
    if (!tfoot) return console.error("Rodapé da tabela não encontrado!");

    // Limpa o corpo da tabela antes de popular
    tbody.innerHTML = "";

    // Agrupa por disciplina
    const disciplinas = {};

    dados.forEach(({ nomeDisciplina, bimestre, nota }) => {
        if (!disciplinas[nomeDisciplina]) {
            disciplinas[nomeDisciplina] = {
                '1º Bimestre': 0,
                '2º Bimestre': 0,
                '3º Bimestre': 0,
                '4º Bimestre': 0
            };
        }

        if (bimestre && disciplinas[nomeDisciplina].hasOwnProperty(bimestre)) {
            disciplinas[nomeDisciplina][bimestre] = parseFloat(nota);
        }
    });

    // Inicializa estrutura para somar as notas dos bimestres
    const somasBimestres = {
        '1º Bimestre': 0,
        '2º Bimestre': 0,
        '3º Bimestre': 0,
        '4º Bimestre': 0
    };

    const qtdDisciplinas = Object.keys(disciplinas).length;

    // Preenche cada linha da tabela com os dados agrupados
    for (const [nomeDisciplina, bimestres] of Object.entries(disciplinas)) {
        const linha = document.createElement("tr");

        const tdDisciplina = document.createElement("td");
        tdDisciplina.style.textAlign = "left";
        tdDisciplina.innerHTML = `<div>${nomeDisciplina}</div><div></div>`;
        linha.appendChild(tdDisciplina);

        let soma = 0, qtdNotas = 0;

        for (let bimestre of ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre']) {
            const tdNota = document.createElement("td");
            const nota = bimestres[bimestre] ?? 0;
            tdNota.textContent = nota.toFixed(2);
            linha.appendChild(tdNota);

            soma += nota;
            somasBimestres[bimestre] += nota;
            qtdNotas++;
        }

        const tdMedia = document.createElement("td");
        const media = soma / qtdNotas;
        tdMedia.textContent = media.toFixed(2);
        linha.appendChild(tdMedia);

        tbody.appendChild(linha);
    }

    // Preenche o rodapé com a média dos bimestres
    let colunas = tfoot.querySelectorAll("td");
    if (colunas.length < 6) return;

    for (let i = 1; i <= 4; i++) {
        let bimestre = `${i}º Bimestre`;
        let mediaBimestre = qtdDisciplinas > 0 ? somasBimestres[bimestre] / qtdDisciplinas : 0;
        colunas[i].textContent = mediaBimestre.toFixed(2);
    }

    // Média final geral (de todos os bimestres)
    let somaTodas = Object.values(somasBimestres).reduce((a, b) => a + b, 0);
    let mediaFinalGeral = qtdDisciplinas > 0 ? somaTodas / (qtdDisciplinas * 4) : 0;
    colunas[5].textContent = mediaFinalGeral.toFixed(2);
}


// async function exibirNotasAlunoA(dados, nomeDisciplina) {
//     let tabela = document.querySelector(".fl-table");
//     if (!tabela) return console.error("Tabela não encontrada!");

//     // Cria objeto com notas por bimestre
//     let notasPorBimestre = {
//         '1º Bimestre': 0,
//         '2º Bimestre': 0,
//         '3º Bimestre': 0,
//         '4º Bimestre': 0
//     };

//     // Preenche o objeto com os dados vindos do backend
//     dados.forEach(({ bimestre, nota }) => {
//         if (bimestre && notasPorBimestre.hasOwnProperty(bimestre)) {
//             notasPorBimestre[bimestre] = parseFloat(nota);
//         }
//     });

//     let tbody = tabela.querySelector("tbody");
//     if (!tbody) return console.error("Estrutura da tabela inválida!");

//     let linha = tbody.querySelector("tr");
//     if (!linha) return console.error("Linha da tabela não encontrada!");

//     let celulas = linha.querySelectorAll("td");

//     // Define o nome da disciplina
//     if (celulas[0]) {
//         let divs = celulas[0].querySelectorAll("div");
//         if (divs.length > 0) {
//             divs[0].textContent = nomeDisciplina;
//         }
//     }

//     // Preenche as notas por bimestre
//     let index = 1;
//     for (let bimestre of ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre']) {
//         if (celulas[index]) {
//             celulas[index].textContent = notasPorBimestre[bimestre].toFixed(2);
//         }
//         index++;
//     }

//     // Calcula e exibe a média final da disciplina
//     if (celulas[5]) {
//         let somaNotas = Object.values(notasPorBimestre).reduce((a, b) => a + b, 0);
//         let qtdNotas = Object.values(notasPorBimestre).filter(n => !isNaN(n)).length;
//         let media = qtdNotas > 0 ? (somaNotas / qtdNotas).toFixed(2) : "0.00";
//         celulas[5].textContent = media;
//     }
// }


async function tabelaNotasAluno(idAluno, idTurma) {
    try {
        // let res = await fetch(`http://localhost:3000/notas-aluno/${idAluno}/${idTurma}`)
        let res = await fetch(`http://localhost:3000/notas/aluno/${idAluno}/turma/${idTurma}`)
            .then(res => res.json())
            .then(dados => exibirTodasNotas(dados))
            .catch(erro => console.error("Erro ao carregar notas:", erro));
    } catch (err) {
        console.error("Erro ao buscar notas do aluno:", err);
        alert("Erro ao buscar notas do aluno. Tente novamente mais tarde.");
    }
}

async function carregarDropdownTurmas(tabela) {
    let dropdown = document.querySelector(".dropdown");
    if (!dropdown) {
        console.error("Elemento .dropdown não encontrado!");
        return;
    }

    let selectTurma = document.getElementById("turmaSelect");
    if (!selectTurma) {
        console.error("Elemento #turmaSelect não encontrado!");
        return;
    }

    if (!user.turmas || user.turmas.length === 0) {
        console.warn("Nenhuma turma encontrada para o usuário.");
        return;
    }

    user.turmas.forEach(turma => {
        let option = document.createElement("option");
        option.value = turma.idTurma;
        option.textContent = `${turma.nome} - ${turma.anoLetivo}`;
        selectTurma.appendChild(option);
    });
}

document.addEventListener("DOMContentLoaded", async function () {
    console.log(user);

    // Notas aluno por disciplina
    let mainNotas = document.querySelector(".main-notas");
    if (mainNotas) {
        if (user.tipo === "aluno") {
            let idAluno = user.idReferencia;
            if (idAluno) await buscarNotasAluno(idAluno);
        } else if (user.tipo === "colaborador") {
            criarDropdownAlunos();
            await carregarAlunosDropdown();

            let select = document.getElementById("alunoSelect");
            if (select) {
                select.addEventListener("change", () => {
                    let idAluno = select.value;
                    if (idAluno) buscarNotasProfessor(idAluno);
                });
            }
        }
    }

    // Notas gerais
    let flTable = document.querySelector(".fl-table");
    if (flTable) {
        await carregarDropdownTurmas(flTable);

        let idTurma = document.getElementById("turmaSelect").value;
        if (user.tipo === "colaborador") {
            let selectTurma = document.getElementById("turmaSelect");
            if (selectTurma) {
                selectTurma.addEventListener("change", () => {
                    let idTurma = selectTurma.value;
                    if (idTurma === "") {
                        flTable.style.display = "none"; // Esconde a tabela se nenhuma turma for selecionada
                        let dropdownDisciplinas = document.querySelector("#disciplinaSelect");
                        if (dropdownDisciplinas) dropdownDisciplinas.parentElement.remove(); // Remove o dropdown de disciplinas
                        let dropdownAlunos = document.querySelector("#alunoSelect");
                        if (dropdownAlunos) dropdownAlunos.parentElement.remove(); // Remove o dropdown de alunos
                    } else {
                        flTable.style.display = "table"; // Mostra a tabela se uma turma for selecionada
                        let dropdownDisciplinas = document.querySelector("#disciplinaSelect");
                        if (dropdownDisciplinas) dropdownDisciplinas.parentElement.remove(); // Remove o dropdown de disciplinas duplicado
                        let dropdownAlunos = document.querySelector("#alunoSelect");
                        if (dropdownAlunos) dropdownAlunos.parentElement.remove(); // Remove o dropdown de alunos duplicado
                        tabelaNotasProfessor(idTurma);
                    }
                });
            }
        } else if (user.tipo === "aluno") {
            let idAluno = user.idReferencia;
            let selectTurma = document.getElementById("turmaSelect");
            if (selectTurma) {
                selectTurma.addEventListener("change", () => {
                    let idTurma = selectTurma.value;
                    if (idTurma == "") {
                        flTable.style.display = "none"; // Esconde a tabela se nenhuma turma for selecionada
                        let dropdownDisciplinas = document.querySelector(".disciplinaSelect");
                        if (dropdownDisciplinas) dropdownDisciplinas.remove(); // Remove o dropdown de disciplinas
                        let  dropdownAlunos = document.querySelector(".alunoSelect");
                        if (dropdownAlunos) dropdownAlunos.remove(); // Remove o dropdown de alunos
                    } else if (idTurma)
                        flTable.style.display = "table"; // Mostra a tabela se uma turma for selecionada
                    tabelaNotasAluno(idAluno, idTurma);
                });
            }
        }
    }
});