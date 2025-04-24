lucide.createIcons();
const confirmAddBtn = document.getElementById("addName");
const nameTable = document
  .getElementById("userTable")
  .querySelector("tbody");

/*
 *  Dialog de inserir usuario
 */
document.getElementById("addStudent").addEventListener("click", () => {
  clearForm();
  openSaveDialog();
});
function openSaveDialog(row) {
  document.getElementById("saveDialog").style.display = "flex";
  document.getElementById("saveDialog").classList.add("fade-in");
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
  const name = document.getElementById("studentName").value;
  const email = document.getElementById("studentEmail").value;
  const fatherName = document.getElementById("studentFatherName").value;
  const motherName = document.getElementById("studentMotherName").value;
  const contact = document.getElementById("studentContact").value;
  const birthDate = document.getElementById("studentBirthDate").value;
  const cpf = document.getElementById("studentCpf").value;
  const address = document.getElementById("studentAddress").value;
  const ra = generateRA();
  const row = document.createElement("tr");
  row.innerHTML = `
      <td>${ra}</td>
      <td>${name}</td>
      <td>${cpf}</td>
      <td>${email}</td>
      <td>${contact}</td>
      <td>${birthDate}</td>
      <td>${fatherName}</td>
      <td>${motherName}</td>
      <td>${address}</td>
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
  document.getElementById("studentName").value = "";
  document.getElementById("studentEmail").value = "";
  document.getElementById("studentFatherName").value = "";
  document.getElementById("studentMotherName").value = "";
  document.getElementById("studentContact").value = "";
  document.getElementById("studentBirthDate").value = "";
  document.getElementById("studentCpf").value = "";
  document.getElementById("studentAddress").value = "";
}

function checkTbody() {
  const tbody = document
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
  const name = document.getElementById("studentName").value;
  const email = document.getElementById("studentEmail").value;
  const fatherName = document.getElementById("studentFatherName").value;
  const motherName = document.getElementById("studentMotherName").value;
  const contact = document.getElementById("studentContact").value;
  const birthDate = document.getElementById("studentBirthDate").value;
  const cpf = document.getElementById("studentCpf").value;
  const address = document.getElementById("studentAddress").value;

  if (
    !name ||
    !email ||
    !fatherName ||
    !motherName ||
    !contact ||
    !birthDate ||
    !cpf ||
    !address
  ) {
    console.log();
    alert("Todos os campos são obrigatórios!");
    return false;
  }

  return true;
}
document
  .getElementById("studentCpf")
  .addEventListener("input", function (e) {
    let value = this.value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    this.value = value;
  });

document
  .getElementById("studentContact")
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
  const cells = row.cells;
  document.getElementById("editStudentName").value = cells[1].textContent;
  document.getElementById("editStudentCpf").value = cells[2].textContent;
  document.getElementById("editStudentEmail").value =
    cells[3].textContent;
  document.getElementById("editStudentContact").value =
    cells[4].textContent;
  document.getElementById("editStudentBirthDate").value =
    cells[5].textContent;
  document.getElementById("editStudentFatherName").value =
    cells[6].textContent;
  document.getElementById("editStudentMotherName").value =
    cells[7].textContent;
  document.getElementById("editStudentAddress").value =
    cells[8].textContent;

  document.getElementById("editDialog").style.display = "flex";
  document.getElementById("editDialog").classList.add("fade-in");
}

document
  .getElementById("closeEditDialog")
  .addEventListener("click", () => {
    document.getElementById("editDialog").style.display = "none";
  });

document.getElementById("confirmEdit").addEventListener("click", () => {
  if (validateEditForm()) {
    updateTableRow();
    document.getElementById("editDialog").style.display = "none";
  }
});
function validateEditForm() {
  const name = document.getElementById("editStudentName").value;
  const email = document.getElementById("editStudentEmail").value;
  const fatherName = document.getElementById(
    "editStudentFatherName"
  ).value;
  const motherName = document.getElementById(
    "editStudentMotherName"
  ).value;
  const contact = document.getElementById("editStudentContact").value;
  const birthDate = document.getElementById("editStudentBirthDate").value;
  const cpf = document.getElementById("editStudentCpf").value;
  const address = document.getElementById("editStudentAddress").value;

  if (
    !name ||
    !email ||
    !fatherName ||
    !motherName ||
    !contact ||
    !birthDate ||
    !cpf ||
    !address
  ) {
    alert("Todos os campos são obrigatórios!");
    return false;
  }

  return true;
}

function updateTableRow() {
  const editedRow = document.querySelector("#userTable tbody tr.editing");
  if (editedRow) {
    editedRow.cells[1].textContent =
      document.getElementById("editStudentName").value;
    editedRow.cells[2].textContent =
      document.getElementById("editStudentCpf").value;
    editedRow.cells[3].textContent =
      document.getElementById("editStudentEmail").value;
    editedRow.cells[4].textContent =
      document.getElementById("editStudentContact").value;
    editedRow.cells[5].textContent = document.getElementById(
      "editStudentBirthDate"
    ).value;
    editedRow.cells[6].textContent = document.getElementById(
      "editStudentFatherName"
    ).value;
    editedRow.cells[7].textContent = document.getElementById(
      "editStudentMotherName"
    ).value;
    editedRow.cells[8].textContent =
      document.getElementById("editStudentAddress").value;
    editedRow.classList.remove("editing");
  }
}

function goTo(filePath) {
  window.location.href = filePath;
}
document
  .getElementById("editStudentCpf")
  .addEventListener("input", function (e) {
    let value = this.value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    this.value = value;
  });

document
  .getElementById("editStudentContact")
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