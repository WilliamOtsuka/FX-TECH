
async function deleteFuncionario(id, token) {
    try {
        // let response = await fetch(`http://localhost:3000/funcionarios/${id}`, {
        let response = await fetch(`http://localhost:3000/usuario/funcionario/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error("Erro ao excluir o funcionário");
        }
        alert("Funcionário excluído com sucesso!");
        window.location.reload(); // Atualiza a página para refletir a exclusão
    } catch (error) {
        console.error(error);
        alert("Erro ao excluir o funcionário.");
    }
}

async function editarFuncionario(id, token) {
    let nome = document.querySelector("#editProfessionalName").value;
    let cargo = document.querySelector("#editProfessionalJobName").value;
    let email = document.querySelector("#editProfessionalEmail").value;
    let emailEducacional = document.querySelector("#editProfessionalEducationalEmail").value;
    let contato = document.querySelector("#editProfessionalContact").value;
    let cpf = document.querySelector("#editProfessionalCpf").value;
    let ra = document.querySelector("#editProfessionalRa").value;

    if (!nome || !cargo || !email || !emailEducacional || !contato || !cpf || !ra) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    let funcionarioAtualizado = {
        nome,
        cargo,
        email_pessoal: email,
        email_educacional: emailEducacional,
        contato,
        cpf,
        RA: ra
    };

    try {
        let response = await fetch(`http://localhost:3000/usuario/funcionario/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(funcionarioAtualizado),
        });

        if (!response.ok) {
            throw new Error("Erro ao editar o funcionário");
        }

        alert("Funcionário atualizado com sucesso!");
        document.querySelector(".dialog-overlay").style.display = "none";
        window.location.reload(); // Atualiza a página para refletir a edição
    } catch (error) {
        console.error(error);
        alert("Erro ao atualizar o funcionário.");
    }
}

async function tabelaFuncionarios() {
    let token = localStorage.getItem("token");
    try {
        let response = await fetch("http://localhost:3000/usuario/funcionarios", {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Erro ao buscar os funcionários");
        let funcionarios = await response.json();

        let tableBody = document.querySelector("#userTable tbody");
        tableBody.innerHTML = "";

        funcionarios.forEach(funcionario => {
            let row = document.createElement("tr");
            row.id = funcionario.idUsuario;

            row.innerHTML = `
                <td class="ra">${funcionario.RA}</td>
                <td class="cargo">${funcionario.cargo}</td>
                <td class="nome">${funcionario.nome}</td>
                <td class="cpf">${funcionario.cpf}</td>
                <td class="email">${funcionario.email_pessoal}</td>
                <td class="emailEducacional">${funcionario.email_educacional}</td>
                <td class="contato">${funcionario.contato}</td>
                <td>
                    <button class="btn-edit"><i class="material-icons">edit</i></button>
                    <button class="btn-delete"><i class="material-icons">delete</i></button>
                </td>
            `;

            // Botão de editar
            row.querySelector(".btn-edit").onclick = () => {
                let dialogOverlay = document.querySelector(".dialog-overlay");
                dialogOverlay.style.display = "flex";
                dialogOverlay.classList.add("fade-in");

                document.querySelector("#editProfessionalName").value = funcionario.nome;
                document.querySelector("#editProfessionalJobName").value = funcionario.cargo;

                let user = JSON.parse(localStorage.getItem("user"));
                if (user.perfil.permition != 3) {
                    let jobInput = document.querySelector("#editProfessionalJobName");
                    jobInput.setAttribute("readonly", "true");
                    jobInput.style.backgroundColor = "#e0e0e0";
                    jobInput.style.color = "#0000008a";
                    jobInput.style.cursor = "not-allowed";
                }

                document.querySelector("#editProfessionalEmail").value = funcionario.email_pessoal;
                document.querySelector("#editProfessionalEducationalEmail").value = funcionario.email_educacional;
                document.querySelector("#editProfessionalContact").value = funcionario.contato;
                document.querySelector("#editProfessionalCpf").value = funcionario.cpf;
                document.querySelector("#editProfessionalRa").value = funcionario.RA;

                document.querySelector("#confirmEdit").onclick = () =>
                    editarFuncionario(funcionario.idUsuario, token);
            };

            // Botão de excluir
            row.querySelector(".btn-delete").onclick = async () => {
                if (confirm("Tem certeza que deseja excluir este funcionário?")) {
                    try {
                        await deleteFuncionario(funcionario.idUsuario, token);
                        alert("Funcionário excluído com sucesso!");
                        tabelaFuncionarios();
                    } catch (err) {
                        console.error("Erro ao excluir funcionário:", err);
                        alert("Erro ao excluir funcionário. Tente novamente.");
                    }
                }
            };

            tableBody.appendChild(row);
        });

        document.addEventListener("click", (event) => {
            if (event.target.classList.contains("closeBtn") || event.target.id === "closeEditDialog") {
                let dialogOverlay = document.querySelector(".dialog-overlay");
                if (dialogOverlay) {
                    dialogOverlay.style.display = "none";
                    dialogOverlay.classList.remove("fade-in");
                }
            }
        });

    } catch (error) {
        console.error(error);
        alert("Erro ao carregar os funcionários.");
    }
}

function aplicarFiltrosProfessor() {
    let raValue = document.getElementById("raInput").value.replace(/\D/g, "").slice(0, 9).toLowerCase();
    let nameValue = document.getElementById("nameInput").value.toLowerCase();
    let jobValue = document.getElementById("jobInput").value.toLowerCase();

    let tableRows = document.querySelectorAll("#userTable tbody tr");
    tableRows.forEach((row) => {
        let raCell = row.querySelector(".ra");     // Use classe, não ID duplicado
        let nameCell = row.querySelector(".nome");
        let jobCell = row.querySelector(".cargo");

        let raMatch = !raValue || (raCell && raCell.textContent.toLowerCase().includes(raValue));
        let nameMatch = !nameValue || (nameCell && nameCell.textContent.toLowerCase().includes(nameValue));
        let jobMatch = !jobValue || (jobCell && jobCell.textContent.toLowerCase() === jobValue);

        if (raMatch && nameMatch && jobMatch) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

function aplicarFiltrosAluno() {
    let raValue = document.getElementById("raInput").value.replace(/\D/g, "").slice(0, 9).toLowerCase();
    let nameValue = document.getElementById("nameInput").value.toLowerCase();

    let tableRows = document.querySelectorAll("#userTable tbody tr");
    tableRows.forEach((row) => {
        let raCell = row.querySelector(".ra");
        let nameCell = row.querySelector(".nome");
       
        let raMatch = !raValue || (raCell && raCell.textContent.toLowerCase().includes(raValue));
        let nameMatch = !nameValue || (nameCell && nameCell.textContent.toLowerCase().includes(nameValue));
        
        if (raMatch && nameMatch) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}


async function deleteAluno(id, token) {
    try {
        let response = await fetch(`http://localhost:3000/usuario/aluno/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error("Erro ao excluir o aluno");
        }
        alert("Aluno excluído com sucesso!");
        window.location.reload(); // Atualiza a página para refletir a exclusão

    } catch (error) {
        console.error(error);
        alert("Erro ao excluir o aluno.");
    }
}

async function editarAluno(id, token) {
    let nome = document.querySelector("#editStudentName").value;
    let email = document.querySelector("#editStudentEmail").value;
    let emailEducacional = document.querySelector("#editStudentEmailEducacional").value;
    let contato = document.querySelector("#editStudentContact").value;
    let cpf = document.querySelector("#editStudentCpf").value;
    let endereco = document.querySelector("#editStudentAddress").value;
    let pai = document.querySelector("#editStudentFather").value;
    let mae = document.querySelector("#editStudentMother").value;
    let data_nascimento = document.querySelector("#editStudentBirthDate").value;
    let ra = document.querySelector("#editStudentRa").value;

    if (!nome || !email || !contato || !cpf || !ra || !endereco || !data_nascimento || !pai || !mae) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    let alunoAtualizado = {
        nome,
        email_pessoal: email,
        email_educacional: emailEducacional,
        contato,
        cpf,
        data_nascimento,
        pai,
        mae,
        endereco,
        ra
    }
    try {
        let response = await fetch(`http://localhost:3000/usuario/aluno/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(alunoAtualizado),
        });

        if (!response.ok) {
            throw new Error("Erro ao editar o aluno");
        }
        alert("Aluno atualizado com sucesso!");
        window.location.reload(); // Atualiza a página para refletir a edição

    } catch (error) {
        console.error(error);
        alert("Erro ao atualizar o aluno.");
    }
}

function formatarData(data) {
    if (!data) return "";
    // Tenta converter para Date
    let dateObj = new Date(data);
    if (isNaN(dateObj.getTime())) return data; // Retorna original se inválido

    let dia = String(dateObj.getDate()).padStart(2, "0");
    let mes = String(dateObj.getMonth() + 1).padStart(2, "0");
    let ano = dateObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function formatarDataEdit(data) {
    if (!data) return "";
    let dateObj = new Date(data);
    if (isNaN(dateObj.getTime())) return ""; // Evita erro se a data for inválida

    let ano = dateObj.getFullYear();
    let mes = String(dateObj.getMonth() + 1).padStart(2, "0");
    let dia = String(dateObj.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
}


async function tabelaAlunos() {
    let token = localStorage.getItem("token");
    try {
        let response = await fetch("http://localhost:3000/usuario/alunos", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error("Erro ao buscar os alunos");
        }
        let alunos = await response.json();
        console.log(alunos);

        // Seleciona o corpo da tabela
        let tableBody = document.querySelector("#userTable tbody");

        // Limpa o conteúdo existente na tabela
        tableBody.innerHTML = "";

        // Adiciona os alunos na tabela
        alunos.forEach(aluno => {
            let row = document.createElement("tr");

            row.id = aluno.idUsuario;

            row.innerHTML = `
                <td class="ra">${aluno.ra}</td>
                <td class="nome">${aluno.nome}</td>
                <td class="cpf">${aluno.cpf}</td>
                <td class="email">${aluno.email_pessoal}</td>
                <td class="email-educacional">${aluno.email_educacional}</td>
                <td class="contato">${aluno.contato}</td>
                <td class="data-nascimento">${formatarData(aluno.data_nascimento)}</td>
                <td class="pai">${aluno.pai}</td>
                <td class="mae">${aluno.mae}</td>
                <td class="endereco">${aluno.endereco}</td>
                <td>
                    <button class="btn-edit"><i class="material-icons editBtn">edit</i></button>
                    <button class="btn-delete"><i class="material-icons deleteBtn">delete</i></button>
                </td>
            `;

            // Adiciona o evento de exclusão
            row.querySelector(".btn-delete").onclick = async () => {
                if (confirm("Tem certeza que deseja excluir este aluno?")) {
                    try {
                        await deleteAluno(row.id, token);
                        alert("Aluno excluído com sucesso!");
                        tabelaAlunos();
                    } catch (err) {
                        console.error("Erro ao excluir aluno:", err);
                        alert("Erro ao excluir aluno. Tente novamente.");
                    }
                }
            };

            // Adiciona o evento de edição
            row.querySelector(".btn-edit").onclick = () => {
                let dialogOverlay = document.querySelector(".dialog-overlay");
                dialogOverlay.style.display = "flex";
                dialogOverlay.classList.add("fade-in");

                // Preenche os campos com os dados do aluno
                document.querySelector("#editStudentName").value = aluno.nome;
                document.querySelector("#editStudentEmail").value = aluno.email_pessoal;
                document.querySelector("#editStudentEmailEducacional").value = aluno.email_educacional;
                document.querySelector("#editStudentContact").value = aluno.contato;
                document.querySelector("#editStudentCpf").value = aluno.cpf;
                document.querySelector("#editStudentRa").value = aluno.ra;
                document.querySelector("#editStudentAddress").value = aluno.endereco;
                document.querySelector("#editStudentFatherName").value = aluno.pai;
                document.querySelector("#editStudentMotherName").value = aluno.mae;
                document.querySelector("#editStudentBirthDate").value = formatarDataEdit(aluno.data_nascimento);
                document.querySelector("#confirmEdit").onclick = () => editarAluno(aluno.idUsuario, token);
            };

            tableBody.appendChild(row);
        });

        document.addEventListener("click", (event) => {
            if (event.target.classList.contains("closeBtn") || event.target.id === "closeEditDialog") {
                let dialogOverlay = document.querySelector(".dialog-overlay");
                if (dialogOverlay) {
                    dialogOverlay.style.display = "none";
                    dialogOverlay.classList.remove("fade-in");
                }
            }
        });

    } catch (error) {
        console.error(error);
        alert("Erro ao carregar os alunos.");
    }
}

// Executa após o carregamento completo da página
document.addEventListener("DOMContentLoaded", async () => {
    // Inicializa ícones se a biblioteca estiver disponível
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    } else {
        console.warn("Biblioteca Lucide não encontrada.");
    }

    // Funções de validação
    let isValidRa = (ra) => /^\d{5,10}$/.test(ra);
    let isValidPassword = (pass) => /^\d{6}$/.test(pass);
    let isValidPersonType = (type) => ["aluno", "colaborador"].includes(type);

    // Aplica validação visual ao input
    let addValidation = (selector, validate, message) => {
        let input = document.querySelector(selector);
        if (!input) return;

        let errorDiv = document.createElement("div");
        errorDiv.style.color = "red";
        errorDiv.style.fontSize = "12px";
        errorDiv.style.marginTop = "4px";
        input.insertAdjacentElement("afterend", errorDiv);

        input.addEventListener("input", (e) => {
            if (!validate(e.target.value)) {
                errorDiv.textContent = message;
                input.style.borderColor = "red";
            } else {
                errorDiv.textContent = "";
                input.style.borderColor = "green";
            }
        });
    };

    // Adiciona validações
    addValidation("#ra", isValidRa, "O RA deve conter entre 5 e 10 números.");

    // Lógica de envio do formulário de login
    let form = document.querySelector("#loginForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            let ra = document.querySelector("#ra")?.value;
            let senha = document.querySelector("#password")?.value;
            let tipo = document.querySelector("#personType")?.value;

            if (isValidRa(ra) && isValidPassword(senha) && isValidPersonType(tipo)) {
                fetch("http://localhost:3000/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ra, tipo, senha }),
                })
                    .then((response) => {
                        if (!response.ok) throw new Error("Erro ao fazer login.");
                        return response.json();
                    })
                    .then((data) => {
                        if (data.token) {
                            localStorage.setItem("token", data.token);
                            localStorage.setItem("user", JSON.stringify(data.user));
                            window.location.href = "../content-page/content-page.html";
                        } else {
                            alert("Erro ao logar. Dados inválidos.");
                        }
                    })
                    .catch((error) => {
                        console.error("Erro:", error);
                        alert("Erro ao fazer login. Verifique suas credenciais.");
                    });
            } else {
                alert("Por favor, preencha todos os campos corretamente.");
            }
        });
    }

    // Exibir o card do painel caso permissão do usuário seja suficiente
    let container = document.querySelector(".container-card-section");
    let user = JSON.parse(localStorage.getItem("user"));

    console.log("user", user);
    if (container && user?.perfil?.permition > 1) {
        let card = document.createElement("div");
        card.className = "q-card options-card";
        card.innerHTML = `
            <div class="q-card-section">
                <div>
                    <span class="material-icons options-icon" onclick="goTo('../register/professional-list.html')" style="font-size: 60px">
                        admin_panel_settings
                    </span>
                </div>
                <div class="options-icon" style="color: black" onclick="goTo('../register/professional-list.html')">
                    Painel
                </div>
            </div>`;
        container.appendChild(card);
    }

    // Preenche o menu lateral com base nos parâmetros da URL
    let sideMenuContent = document.querySelector(".side-menu-content");
    if (sideMenuContent) {
        let urlParams = new URLSearchParams(window.location.search);
        let idDisciplina = urlParams.get("idD");
        let idTurma = urlParams.get("idT");

        sideMenuContent.innerHTML = `
            <a class="side-menu-link" id="toggle-menu">
                <i class="material-icons">menu</i>
            </a>
            <a href="../content-page/content-page.html?idD=${idDisciplina}&idT=${idTurma}" class="side-menu-link">
                <i class="material-icons">home</i> <span>Inicio</span>
            </a>
            <a href="disciplinas.html?idD=${idDisciplina}&idT=${idTurma}" class="side-menu-link">
                <i class="material-icons">menu_book</i> <span>Disciplinas</span>
            </a>
            <a href="participantes.html?idD=${idDisciplina}&idT=${idTurma}" class="side-menu-link">
                <i class="material-icons">group</i> <span>Turma</span>
            </a>
            <a href="notas-disciplina.html?idD=${idDisciplina}&idT=${idTurma}" class="side-menu-link">
                <i class="material-icons">grading</i> <span>Notas</span>
            </a>`;
    }

    // Lógica do botão "mostrar senha"
    let eyeBtn = document.querySelector("#eye-btn");
    let passwordInput = document.querySelector("#password");

    if (eyeBtn && passwordInput) {
        eyeBtn.addEventListener("click", () => {
            let isHidden = passwordInput.type === "password";
            passwordInput.type = isHidden ? "text" : "password";
            let newIcon = isHidden ? "eye" : "eye-off";
            eyeBtn.innerHTML = `<i data-lucide="${newIcon}" style="color: #0000008a;"></i>`;
            if (typeof lucide !== "undefined") {
                lucide.createIcons();
            }
            eyeBtn.classList.toggle("unvisible");
            eyeBtn.classList.toggle("visible");
        });
    }

    // Botão de logout
    let logoutBtn = document.querySelector(".user-logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = `${location.origin}/Admin panel/src/pages/login/index.html`;
        });
    }

    let listProfessional = document.querySelector("#professional-list");
    if (listProfessional) {
        tabelaFuncionarios();

        raInput.addEventListener("input", () => {
            raInput.value = raInput.value.replace(/\D/g, "").slice(0, 9); // manter limitação
            aplicarFiltrosProfessor();
        });

        nameInput.addEventListener("input", aplicarFiltrosProfessor);
        jobInput.addEventListener("change", aplicarFiltrosProfessor);
    }

    let listAluno = document.querySelector("#aluno-list");
    if (listAluno) {
        tabelaAlunos();

        raInput.addEventListener("input", () => {
            raInput.value = raInput.value.replace(/\D/g, "").slice(0, 9); // manter limitação
            aplicarFiltrosAluno();
        });

        nameInput.addEventListener("input", aplicarFiltrosAluno);
    }
});
