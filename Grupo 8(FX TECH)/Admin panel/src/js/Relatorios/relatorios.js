let token = localStorage.getItem("token");
let user = JSON.parse(localStorage.getItem("user"));

console.log("Token:", token);
console.log("User:", user);

async function deleteFuncionario(id) {
    try {
        let response = await fetch(`http://localhost:3000/funcionarios/${id}`, {
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

async function editarFuncionario(id) {
    const nome = document.querySelector("#professionalName").value;
    const cargo = document.querySelector("#professionalJobName").value;
    const email = document.querySelector("#professionalEmail").value;
    const contato = document.querySelector("#professionalContact").value;
    const cpf = document.querySelector("#professionalCPF").value;
    const ra = document.querySelector("#professionalRA").value;

    const funcionarioAtualizado = {
        nome,
        cargo,
        email_pessoal: email,
        contato,
        cpf,
        RA: ra
    };

    try {
        const response = await fetch(`http://localhost:3000/funcionarios/${id}`, {
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
        window.location.reload(); // Atualiza a página para refletir a exclusão
    } catch (error) {
        console.error(error);
        alert("Erro ao atualizar o funcionário.");
    }
}

async function tabelaFuncionarios() {
    try {
        let response = await fetch("http://localhost:3000/funcionarios", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
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
                    deleteFuncionario(id);
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
                document.querySelector("#professionalName").value = row.querySelector(".nome").textContent;
                document.querySelector("#professionalJobName").value = row.querySelector(".cargo").textContent;
                document.querySelector("#professionalEmail").value = row.querySelector(".email").textContent;
                document.querySelector("#professionalContact").value = row.querySelector(".contato").textContent;
                document.querySelector("#professionalCPF").value = row.querySelector(".cpf").textContent;
                document.querySelector("#professionalRA").value = row.querySelector(".ra").textContent;

                document.querySelector("#saveForm").onclick = () => {
                    editarFuncionario(id);
                };
            }
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

document.addEventListener("DOMContentLoaded", () => {
    tabelaFuncionarios();
    lucide.createIcons();

    raInput.addEventListener("input", () => {
        raInput.value = raInput.value.replace(/\D/g, "").slice(0, 9); // manter limitação
        aplicarFiltros();
    });
    
    nameInput.addEventListener("input", aplicarFiltros);
    jobInput.addEventListener("change", aplicarFiltros);

    function isCpfDuplicated(cpf) {
        let rows = nameTable.querySelectorAll("tr");
        for (let row of rows) {
            if (row.cells[3].textContent === cpf) {
                return true;
            }
        }
        return false;
    }

    document
        .getElementById("closeSaveDialog")
        .addEventListener("click", () => {
            closeSaveDialog();
        });
    function closeSaveDialog() {
        document.getElementById("saveDialog").style.display = "none";
    }
    confirmAddBtn.addEventListener("click", () => {
        if (validateForm()) {
            addNameToTable();
        }
    });

    function addNameToTable() {
        let name = document.getElementById("professionalName").value;
        let job = document.getElementById("professionalJobName").value;
        let email = document.getElementById("professionalEmail").value;
        let contact = document.getElementById("professionalContact").value;
        let cpf = document.getElementById("professionalCpf").value;
        let ra = generateRA();
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${ra}</td>
            <td>${job}</td>
            <td>${name}</td>
            <td>${cpf}</td>
            <td>${email}</td>
            <td>${contact}</td>
            <td>
            <button class="btn-edit editBtn"><i class="material-icons">edit</i></button>
            <button class="btn-delete deleteBtn"><i class="material-icons">delete</i></button>
            </td>
        `;
        row.querySelector(".deleteBtn").addEventListener("click", () => {
            if (confirm("Confirma exclusao ?")) {
                row.remove();
                checkTbody();
            } else {
                return;
            }
        });
        row.querySelector(".editBtn").addEventListener("click", () => {
            openEditDialog(row);
            row.classList.add("editing");
        });
        nameTable.appendChild(row);
        checkTbody();
        clearForm();
    }
    function clearForm() {
        document.getElementById("professionalName").value = "";
        document.getElementById("professionalEmail").value = "";
        document.getElementById("professionalJobName").value = "";
        document.getElementById("professionalContact").value = "";
        document.getElementById("professionalCpf").value = "";
    }

    function checkTbody() {
        let tbody = document
            .getElementById("userTable")
            .querySelector("tbody");
        if (tbody.children.length !== 0) {
            document.getElementById("tableFootContent").innerHTML = "";
        } else {
            document.getElementById("tableFootContent").innerHTML = `
            <tr>
                <td colspan="10">
                    <div class="flex items-center" style="gap: 5px; margin-left: 10px">
                        <span style="font-weight: bold" class="flex items-center gap-sm"><i class="material-icons">warning</i> Nenhum registro encontrado!</span>
                    </div>
                 </td>
            </tr>`;
        }
    }
    function validateForm() {
        let name = document.getElementById("professionalName").value;
        let job = document.getElementById("professionalJobName").value;
        let email = document.getElementById("professionalEmail").value;
        let contact = document.getElementById("professionalContact").value;
        let cpf = document.getElementById("professionalCpf").value;

        if (!name || !email || !job || !contact || !cpf) {
            alert("Todos os campos são obrigatórios!");
            return false;
        }
        return true;
    }
    document
        .getElementById("professionalCpf")
        .addEventListener("input", function (e) {
            let value = this.value.replace(/\D/g, "");
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            this.value = value;
        });

    document
        .getElementById("professionalContact")
        .addEventListener("input", function (e) {
            let value = this.value.replace(/\D/g, "");
            if (value.length > 10) {
                value = value.replace(
                    /^(\d{2})(\d{1})(\d{4})(\d{4})$/,
                    "($1) $2 $3-$4"
                );
            } else {
                value = value.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
            }
            this.value = value;
        });
    /*
     *  Dialog de editar usuario
     */
    function openEditDialog(row) {
        let cells = row.cells;
        document.getElementById("editProfessionalJobName").value =
            cells[1].textContent;
        document.getElementById("editProfessionalName").value =
            cells[2].textContent;
        document.getElementById("editProfessionalCpf").value =
            cells[3].textContent;
        document.getElementById("editProfessionalEmail").value =
            cells[4].textContent;
        document.getElementById("editProfessionalContact").value =
            cells[5].textContent;
        document.getElementById("editDialog").style.display = "flex";
    }

    document
        .getElementById("closeEditDialog")
        .addEventListener("click", () => {
            document.getElementById("editDialog").style.display = "none";
        });

    document.getElementById("confirmEdit").addEventListener("click", () => {
        if (validateEditForm()) {
            if (confirm("Confirma alteracao ?")) {
                updateTableRow();
                document.getElementById("editDialog").style.display = "none";
            } else {
                return;
            }
        }
    });
    function validateEditForm() {
        let name = document.getElementById("editProfessionalName").value;
        let email = document.getElementById("editProfessionalEmail").value;
        let contact = document.getElementById(
            "editProfessionalContact"
        ).value;
        let cpf = document.getElementById("editProfessionalCpf").value;
        let job = document.getElementById("editProfessionalJobName").value;

        if (!name || !email || !job || !contact || !cpf) {
            alert("Todos os campos são obrigatórios!");
            return false;
        }
        return true;
    }

    function goTo(filePath) {
        window.location.href = filePath;
    }

    function updateTableRow() {
        let editedRow = document.querySelector("#userTable tbody tr.editing");
        if (editedRow) {
            editedRow.cells[1].textContent = document.getElementById(
                "editProfessionalJobName"
            ).value;
            editedRow.cells[2].textContent = document.getElementById(
                "editProfessionalName"
            ).value;
            editedRow.cells[3].textContent = document.getElementById(
                "editProfessionalCpf"
            ).value;
            editedRow.cells[4].textContent = document.getElementById(
                "editProfessionalEmail"
            ).value;
            editedRow.cells[5].textContent = document.getElementById(
                "editProfessionalContact"
            ).value;

            editedRow.classList.remove("editing");
        }
    }

    document
        .getElementById("editProfessionalCpf")
        .addEventListener("input", function (e) {
            let value = this.value.replace(/\D/g, "");
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            this.value = value;
        });

    document
        .getElementById("editProfessionalContact")
        .addEventListener("input", function (e) {
            let value = this.value.replace(/\D/g, "");
            if (value.length > 10) {
                value = value.replace(
                    /^(\d{2})(\d{1})(\d{4})(\d{4})$/,
                    "($1) $2 $3-$4"
                );
            } else {
                value = value.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
            }
            this.value = value;
        });

    function generateRA() {
        let ra = Math.floor(Math.random() * 100000000000);
        return ra;
    }
    checkTbody();
});
