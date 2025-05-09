
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
        // let response = await fetch("http://localhost:3000/funcionarios", {
        let response = await fetch("http://localhost:3000/usuario/funcionarios", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar os funcionários");
        }
        let funcionarios = await response.json();
        console.log(funcionarios);

        // Seleciona o corpo da tabela
        let tableBody = document.querySelector("#userTable tbody");

        // Limpa o conteúdo existente na tabela
        tableBody.innerHTML = "";

        // Adiciona os funcionários na tabela
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
                    <button class="btn-edit"><i class="material-icons editBtn">edit</i></button>
                    <button class="btn-delete"><i class="material-icons deleteBtn">delete</i></button>
                </td>
            `;

            tableBody.appendChild(row);
        });
        // Adiciona evento de clique para o botão de excluir
        document.addEventListener("click", (event) => {
            if (event.target.classList.contains("deleteBtn")) {
                let row = event.target.closest("tr");
                let id = row.id;
                if (confirm("Tem certeza que deseja excluir este funcionário?")) {
                    deleteFuncionario(id, token);
                }
            }
        });
        // Adiciona evento de clique para o botão de editar
        document.addEventListener("click", (event) => {
            if (event.target.classList.contains("editBtn")) {
                let row = event.target.closest("tr");
                let id = row.id;
                console.log("ID do funcionário:", id);
                // Exibe o diálogo de edição
                let dialogOverlay = document.querySelector(".dialog-overlay");
                dialogOverlay.style.display = "flex";
                dialogOverlay.classList.add("fade-in");


                // Preenche os campos
                document.querySelector("#editProfessionalName").value = row.querySelector(".nome").textContent;
                document.querySelector("#editProfessionalJobName").value = row.querySelector(".cargo").textContent;

                let user = JSON.parse(localStorage.getItem("user"));

                if (user.perfil.permition != 3) {
                    document.querySelector("#editProfessionalJobName").setAttribute("readonly", "true");
                    document.querySelector("#editProfessionalJobName").style.backgroundColor = "#e0e0e0";
                    document.querySelector("#editProfessionalJobName").style.color = "#0000008a";
                    document.querySelector("#editProfessionalJobName").style.cursor = "not-allowed";
                }

                document.querySelector("#editProfessionalEmail").value = row.querySelector(".email").textContent;
                document.querySelector("#editProfessionalEducationalEmail").value = row.querySelector(".emailEducacional").textContent;
                document.querySelector("#editProfessionalContact").value = row.querySelector(".contato").textContent;
                document.querySelector("#editProfessionalCpf").value = row.querySelector(".cpf").textContent;
                document.querySelector("#editProfessionalRa").value = row.querySelector(".ra").textContent;

                document.querySelector("#confirmEdit").addEventListener("click", () => {
                    editarFuncionario(id, token);
                });
            }
            document.addEventListener("click", (event) => {
                if (event.target.classList.contains("closeBtn") || event.target.id === "closeEditDialog") {
                    let dialogOverlay = document.querySelector(".dialog-overlay");
                    if (dialogOverlay) {
                        dialogOverlay.style.display = "none";
                        dialogOverlay.classList.remove("fade-in");
                    }
                }
            });
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
    let ra = document.querySelector("#editStudentRa").value;

    if (!nome || !email || !contato || !cpf || !ra) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    let alunoAtualizado = {
        nome,
        email_pessoal: email,
        email_educacional: emailEducacional,
        contato,
        cpf,
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
                <td>
                    <button class="btn-edit"><i class="material-icons editBtn">edit</i></button>
                    <button class="btn-delete"><i class="material-icons deleteBtn">delete</i></button>

                </td>
            `;
            tableBody.appendChild(row);
        });
        // Adiciona evento de clique para o botão de excluir
        document.addEventListener("click", (event) => {
            if (event.target.classList.contains("deleteBtn")) {
                let row = event.target.closest("tr");
                let id = row.id;
                if (confirm("Tem certeza que deseja excluir este aluno?")) {
                    deleteAluno(id, token);
                }
            }
        });
        // Adiciona evento de clique para o botão de editar
        document.addEventListener("click", (event) => {
            if (event.target.classList.contains("editBtn")) {
                let row = event.target.closest("tr");
                let id = row.id;
                console.log("ID do aluno:", id);
                // Exibe o diálogo de edição
                let dialogOverlay = document.querySelector(".dialog-overlay");
                dialogOverlay.style.display = "flex";
                dialogOverlay.classList.add("fade-in");
                // Preenche os campos
                document.querySelector("#editStudentName").value = row.querySelector(".nome").textContent;
                document.querySelector("#editStudentEmail").value = row.querySelector(".email").textContent;
                document.querySelector("#editStudentEmailEducacional").value = row.querySelector(".emailEducacional").textContent;
                document.querySelector("#editStudentContact").value = row.querySelector(".contato").textContent;
                document.querySelector("#editStudentCpf").value = row.querySelector(".cpf").textContent;
                document.querySelector("#editStudentRa").value = row.querySelector(".ra").textContent;
                document.querySelector("#confirmEdit").addEventListener("click", () => {
                    editarAluno(id, token);
                });
            }
            document.addEventListener("click", (event) => {
                if (event.target.classList.contains("closeBtn") || event.target.id === "closeEditDialog") {
                    let dialogOverlay = document.querySelector(".dialog-overlay");
                    if (dialogOverlay) {
                        dialogOverlay.style.display = "none";
                        dialogOverlay.classList.remove("fade-in");
                    }
                }
            });
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
        let idAMateria = urlParams.get("idM");
        let idTurma = urlParams.get("idT");

        sideMenuContent.innerHTML = `
            <a class="side-menu-link" id="toggle-menu">
                <i class="material-icons">menu</i>
            </a>
            <a href="../content-page/content-page.html?idM=${idAMateria}&idT=${idTurma}" class="side-menu-link">
                <i class="material-icons">home</i> <span>Inicio</span>
            </a>
            <a href="materias.html?idM=${idAMateria}&idT=${idTurma}" class="side-menu-link">
                <i class="material-icons">menu_book</i> <span>Matérias</span>
            </a>
            <a href="participantes.html?idM=${idAMateria}&idT=${idTurma}" class="side-menu-link">
                <i class="material-icons">group</i> <span>Turma</span>
            </a>
            <a href="notas-materia.html?idM=${idAMateria}&idT=${idTurma}" class="side-menu-link">
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
        console.log("sdakhnasjkbasjkdbsaj");
        tabelaAlunos();
    }
});
