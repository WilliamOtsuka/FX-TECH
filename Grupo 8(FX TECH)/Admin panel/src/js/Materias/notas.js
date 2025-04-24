const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));
const urlParams = new URLSearchParams(window.location.search);
const idMateria = urlParams.get("idT");
const idTurma = urlParams.get("idM");

function criarDropdownAlunos() {
    const mainNotas = document.querySelector(".main-notas");

    const dropdownContainer = document.createElement("div");
    dropdownContainer.style.marginBottom = "16px";

    const label = document.createElement("label");
    label.setAttribute("for", "alunoSelect");
    label.textContent = "Selecione o aluno:";

    const select = document.createElement("select");
    select.id = "alunoSelect";
    select.innerHTML = `<option value="">-- Selecione um aluno --</option>`;

    select.addEventListener("change", () => {
        // Torna impossível selecionar a opção com value=""
        const defaultOption = select.querySelector('option[value=""]');
        if (defaultOption) defaultOption.disabled = true;
    });

    dropdownContainer.appendChild(label);
    dropdownContainer.appendChild(document.createElement("br"));
    dropdownContainer.appendChild(select);

    // Insere o dropdown no início do main, antes dos bimestres
    mainNotas.insertBefore(dropdownContainer, mainNotas.querySelector(".bimestre-container"));
}

// async function buscarNotasDoAluno(idAluno) {
//     try {
//         const response = await fetch(`http://localhost:3000/notas-aluno/${idAluno}/${idMateria}/${idTurma}`);
//         if (!response.ok) throw new Error("Erro ao buscar notas do aluno");
//         const dados = await response.json();

//         // Limpar tabelas
//         document.querySelectorAll(".tabela-notas").forEach(tabela => tabela.innerHTML = "");

//         // Iterar pelos bimestres e criar as tabelas
//         for (let bimestre = 1; bimestre <= 4; bimestre++) {
//             const tabelaContainer = document.querySelectorAll(".tabela-notas")[bimestre - 1];
//             const atividades = dados[bimestre] || [];
//             let somaPesos = 0;
//             let somaNotas = 0;

//             atividades.forEach(atividade => {
//                 const row = document.createElement("div");
//                 row.innerHTML = `
//                     <div><strong>Atividade:</strong> ${atividade.nome}</div>
//                     <div><strong>Nota:</strong> ${atividade.nota}</div>
//                     <div><strong>Peso:</strong> ${atividade.peso}</div>
//                     <hr/>
//                 `;
//                 tabelaContainer.appendChild(row);

//                 somaNotas += atividade.nota * atividade.peso;
//                 somaPesos += atividade.peso;
//             });

//             // Exibir média ponderada
//             const notaFinal = somaPesos > 0 ? (somaNotas / somaPesos).toFixed(2) : "-";
//             const finalDiv = document.createElement("div");
//             finalDiv.innerHTML = `<strong>Nota final do ${bimestre}º Bimestre:</strong> ${notaFinal}`;
//             tabelaContainer.appendChild(finalDiv);
//         }
//     } catch (error) {
//         console.error("Erro ao buscar/exibir notas:", error);
//     }
// }

async function carregarAlunosDropdown() {
    try {
        const response = await fetch(`http://localhost:3000/materias/${idMateria}/participantes/${idTurma}`);
        if (!response.ok) throw new Error("Erro ao buscar participantes");

        const participantes = await response.json();
        const select = document.getElementById("alunoSelect");

        participantes
            .filter(p => p.tipo === "aluno")
            .sort((a, b) => a.nome.localeCompare(b.nome))
            .forEach(aluno => {
                const option = document.createElement("option");
                option.value = aluno.id;
                option.textContent = aluno.nome;
                select.appendChild(option);
            });

        select.addEventListener("change", () => {
            const idAluno = select.value;
            if (idAluno) buscarNotasProfessor(idAluno);
        });
    } catch (error) {
        console.error("Erro ao carregar dropdown de alunos:", error);
    }
}

async function buscarNotasAluno() {
    const idAluno = user.idReferencia;

    try {
        const response = await fetch(`http://localhost:3000/buscar-notas/${idMateria}/${idTurma}/${user.idReferencia}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error("Erro ao buscar notas");

        const dados = await response.json();

        // Filtrar apenas as notas do aluno
        const notasAluno = dados.filter(item => item.idAluno === idAluno);
        console.log("Notas do aluno:", notasAluno);

        // Estrutura para organizar as notas por bimestre
        const bimestres = {
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
            const container = Array.from(document.querySelectorAll('.bimestre-container'))
                .find(div => div.querySelector('h2')?.textContent.includes(bimestre));

            if (!container) return; // Se o contêiner não existir, pula para o próximo bimestre

            const tabelaContainer = container.querySelector('.tabela-notas');
            tabelaContainer.innerHTML = ''; // Limpa o conteúdo anterior

            if (atividades.length === 0) {
                tabelaContainer.innerHTML = `<p>Sem atividades registradas para este bimestre.</p>`;
                return;
            }

            // Cria a tabela
            const tabela = document.createElement("table");
            tabela.classList.add("tabela", `tabela-${bimestre.replace('º ', '').toLowerCase()}`); // Adiciona classes específicas para o bimestre

            // Cria o cabeçalho da tabela
            const thead = document.createElement("thead");
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
            const tbody = document.createElement("tbody");
            tbody.classList.add("tabela-body");

            let notaFinal = 0;

            atividades.forEach(({ nomeAtividade, peso, nota }) => {
                let notaCalculada = (nota * (peso / 100)).toFixed(2); // Calcula a nota final da atividade
                notaFinal += parseFloat(notaCalculada); // Soma a nota calculada para o bimestre
                const linha = document.createElement("tr");
                linha.classList.add("tabela-body-row");
                linha.innerHTML = `
                    <td class="tabela-body-cell">${nomeAtividade}</td>
                    <td class="tabela-body-cell">${peso}</td>
                    <td class="tabela-body-cell">${nota}</td>
                    <td class="tabela-body-cell">${notaCalculada}</td>
                `;
                tbody.appendChild(linha);
            });

            // Adiciona uma linha final com a nota final do bimestre
            const linhaFinal = document.createElement("tr");
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
        const response = await fetch(`http://localhost:3000/notas-aluno/${idAluno}/${idMateria}/${idTurma}`);
        if (!response.ok) throw new Error("Erro ao buscar notas do aluno");

        const dados = await response.json();
        console.log("Notas do aluno selecionado:", dados);

        // Estrutura para organizar as notas por bimestre
        const bimestres = {
            '1º Bimestre': [],
            '2º Bimestre': [],
            '3º Bimestre': [],
            '4º Bimestre': [],
        };

        // Organiza os dados nos bimestres corretos
        dados.forEach(item => {
            if (bimestres[item.bimestre]) {
                bimestres[item.bimestre].push(item);
            }
        });

        // Limpa os containers das tabelas
        document.querySelectorAll(".tabela-notas").forEach(tabela => tabela.innerHTML = "");

        // Itera e gera as tabelas por bimestre
        Object.entries(bimestres).forEach(([bimestre, atividades]) => {
            const container = Array.from(document.querySelectorAll('.bimestre-container'))
                .find(div => div.querySelector('h2')?.textContent.includes(bimestre));

            if (!container) return;

            const tabelaContainer = container.querySelector('.tabela-notas');
            tabelaContainer.innerHTML = '';

            if (atividades.length === 0) {
                tabelaContainer.innerHTML = `<p>Sem atividades registradas para este bimestre.</p>`;
                return;
            }

            const tabela = document.createElement("table");
            tabela.classList.add("tabela", `tabela-${bimestre.replace('º ', '').toLowerCase()}`);

            const thead = document.createElement("thead");
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

            const tbody = document.createElement("tbody");
            tbody.classList.add("tabela-body");

            let notaFinal = 0;

            atividades.forEach(({ nomeAtividade, peso, nota }) => {
                const notaCalculada = (nota * (peso / 100)).toFixed(2);
                notaFinal += parseFloat(notaCalculada);

                const linha = document.createElement("tr");
                linha.classList.add("tabela-body-row");
                linha.innerHTML = `
                    <td class="tabela-body-cell">${nomeAtividade}</td>
                    <td class="tabela-body-cell">${peso}</td>
                    <td class="tabela-body-cell">${nota}</td>
                    <td class="tabela-body-cell">${notaCalculada}</td>
                `;
                tbody.appendChild(linha);
            });

            const linhaFinal = document.createElement("tr");
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

document.addEventListener("DOMContentLoaded", async function () {
    if (user.tipo == "aluno")
        buscarNotasAluno();

    else
        if (user.tipo == "professor") {
            criarDropdownAlunos();
            carregarAlunosDropdown();

            select.addEventListener("change", () => {
                const idAluno = select.value;
                if (idAluno) buscarNotasProfessor(idAluno);
            });
        }
});