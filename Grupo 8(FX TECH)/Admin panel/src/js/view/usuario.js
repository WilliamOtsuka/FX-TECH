
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
    const nome = document.querySelector("#editProfessionalName").value;
    const cargo = document.querySelector("#editProfessionalJobName").value;
    const email = document.querySelector("#editProfessionalEmail").value;
    const contato = document.querySelector("#editProfessionalContact").value;
    const cpf = document.querySelector("#editProfessionalCpf").value;
    const ra = document.querySelector("#editProfessionalRa").value;

    if (!nome || !cargo || !email || !contato || !cpf || !ra) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const funcionarioAtualizado = {
        nome,
        cargo,
        email_pessoal: email,
        contato,
        cpf,
        RA: ra
    };

    try {
        const response = await fetch(`http://localhost:3000/usuario/funcionario/${id}`, {
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
        await tabelaFuncionarios(); // Atualiza apenas a tabela
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
                document.querySelector("#editProfessionalEmail").value = row.querySelector(".email").textContent;
                document.querySelector("#editProfessionalContact").value = row.querySelector(".contato").textContent;
                document.querySelector("#editProfessionalCpf").value = row.querySelector(".cpf").textContent;
                document.querySelector("#editProfessionalRa").value = row.querySelector(".ra").textContent;
                
                document.querySelector("#confirmEdit").addEventListener("click", () => {
                    editarFuncionario(id, token);
                });
            }
            document.addEventListener("click", (event) => {
                if (event.target.classList.contains("closebBtn") || event.target.id === "closeEditDialog") {
                    const dialogOverlay = document.querySelector(".dialog-overlay");
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

function aplicarFiltros() {
    const raValue = document.getElementById("raInput").value.replace(/\D/g, "").slice(0, 9).toLowerCase();
    const nameValue = document.getElementById("nameInput").value.toLowerCase();
    const jobValue = document.getElementById("jobInput").value.toLowerCase();

    const tableRows = document.querySelectorAll("#userTable tbody tr");

    tableRows.forEach((row) => {
        const raCell = row.querySelector(".ra");     // Use classe, não ID duplicado
        const nameCell = row.querySelector(".nome");
        const jobCell = row.querySelector(".cargo");

        const raMatch = !raValue || (raCell && raCell.textContent.toLowerCase().includes(raValue));
        const nameMatch = !nameValue || (nameCell && nameCell.textContent.toLowerCase().includes(nameValue));
        const jobMatch = !jobValue || (jobCell && jobCell.textContent.toLowerCase() === jobValue);

        if (raMatch && nameMatch && jobMatch) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
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
    const isValidRa = (ra) => /^\d{5,10}$/.test(ra);
    const isValidPassword = (pass) => /^\d{6}$/.test(pass);
    const isValidPersonType = (type) => ["aluno", "colaborador"].includes(type);

    // Aplica validação visual ao input
    const addValidation = (selector, validate, message) => {
        const input = document.querySelector(selector);
        if (!input) return;

        const errorDiv = document.createElement("div");
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
    const form = document.querySelector("#loginForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const ra = document.querySelector("#ra")?.value;
            const senha = document.querySelector("#password")?.value;
            const tipo = document.querySelector("#personType")?.value;

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
    const container = document.querySelector(".container-card-section");
    const user = JSON.parse(localStorage.getItem("user"));
    if (container && user?.perfil?.permition > 1) {
        const card = document.createElement("div");
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
    const sideMenuContent = document.querySelector(".side-menu-content");
    if (sideMenuContent) {
        const urlParams = new URLSearchParams(window.location.search);
        const idAMateria = urlParams.get("idM");
        const idTurma = urlParams.get("idT");

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
    const eyeBtn = document.querySelector("#eye-btn");
    const passwordInput = document.querySelector("#password");

    if (eyeBtn && passwordInput) {
        eyeBtn.addEventListener("click", () => {
            const isHidden = passwordInput.type === "password";
            passwordInput.type = isHidden ? "text" : "password";
            const newIcon = isHidden ? "eye" : "eye-off";
            eyeBtn.innerHTML = `<i data-lucide="${newIcon}" style="color: #0000008a;"></i>`;
            if (typeof lucide !== "undefined") {
                lucide.createIcons();
            }
            eyeBtn.classList.toggle("unvisible");
            eyeBtn.classList.toggle("visible");
        });
    }

    // Botão de logout
    const logoutBtn = document.querySelector(".user-logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = `${location.origin}/Admin panel/src/pages/login/index.html`;
        });
    }

    let registerPage = document.querySelector(".register");
    if (registerPage)
    {
        tabelaFuncionarios();

        raInput.addEventListener("input", () => {
            raInput.value = raInput.value.replace(/\D/g, "").slice(0, 9); // manter limitação
            aplicarFiltros();
        });
        
        nameInput.addEventListener("input", aplicarFiltros);
        jobInput.addEventListener("change", aplicarFiltros);
    }
});
