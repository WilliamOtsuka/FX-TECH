// // Obtém o ID da matéria ou atividade da URL
// let urlParams = new URLSearchParams(window.location.search);
// let idMateria = urlParams.get('idM'); // ID da matéria
// let idTurma = urlParams.get('idT');


// let token = localStorage.getItem("token");
// let user = JSON.parse(localStorage.getItem("user"));

// console.log("Token:", token);
// console.log("User:", user);

// function formatarData(dataISO) {
//     let data = new Date(dataISO);
//     let dia = String(data.getDate()).padStart(2, '0');
//     let mes = String(data.getMonth() + 1).padStart(2, '0');
//     let ano = data.getFullYear();
//     return `${dia}/${mes}/${ano}`;
// }

// function formatarHora(horaISO) {
//     let [horas, minutos, segundos] = horaISO.split(":").map(Number);
//     if (isNaN(horas) || isNaN(minutos)) {
//         console.error("Data inválida fornecida para formatarHora:", horaISO);
//         return "Hora inválida";
//     }
//     return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
// }

// async function carregarAtividades() {
//     try {
//         // Busca as atividades da turma e matéria
//         // let response = await fetch(`http://localhost:3000/materias/${idMateria}/atividades/${idTurma}`);
//         let response = await fetch(`http://localhost:3000/atividades/materia/${idMateria}/turma/${idTurma}`);

//         if (!response.ok) throw new Error(`Erro ao buscar atividades: ${response.statusText}`);
//         let atividades = await response.json();
//         // Busca os períodos letivos (bimestres) da turma
//         let resPeriodo = await fetch(`http://localhost:3000/turmas/${idTurma}/periodos`);
//         if (!resPeriodo.ok) throw new Error(`Erro ao buscar períodos: ${resPeriodo.statusText}`);
//         let periodos = await resPeriodo.json();

//         let listaAtividades = document.querySelector('.list-atividades');
//         if (!listaAtividades) return console.error("Elemento .list-atividades não encontrado!");

//         listaAtividades.innerHTML = "";

//         if (atividades.length === 0) {
//             listaAtividades.innerHTML = "<p>Nenhuma atividade encontrada para esta matéria.</p>";
//             return;
//         }

//         // Organiza as atividades por bimestre
//         let atividadesPorPeriodo = {};

//         periodos.forEach(periodo => {
//             atividadesPorPeriodo[periodo.nome] = [];
//         });

//         atividades.forEach(atividade => {
//             let dataEntrega = new Date(atividade.dataEntrega);
//             let periodoCorrespondente = periodos.find(p => {
//                 return new Date(p.data_inicio) <= dataEntrega && dataEntrega <= new Date(p.data_fim);
//             });

//             let nomePeriodo = periodoCorrespondente ? periodoCorrespondente.nome : 'Fora do período';
//             if (!atividadesPorPeriodo[nomePeriodo]) {
//                 atividadesPorPeriodo[nomePeriodo] = [];
//             }

//             atividadesPorPeriodo[nomePeriodo].push(atividade);
//         });

//         for (let [nomePeriodo, atividadesPeriodo] of Object.entries(atividadesPorPeriodo)) {
//             if (atividadesPeriodo.length === 0) continue;

//             let titulo = document.createElement('h3');
//             titulo.textContent = nomePeriodo;
//             listaAtividades.appendChild(titulo);

//             atividadesPeriodo.forEach(atividade => {
//                 let divAtividade = document.createElement("div");
//                 divAtividade.classList.add("div-atividade");

//                 let link = document.createElement("a");
//                 link.id = `${atividade.idAtividade}`;
//                 link.classList.add("atividade", "botao-atividade");
//                 link.classList.add(atividade.status === "indisponivel" ? "indisponivel" : "disponivel");

//                 link.href = `atividade.html?idA=${atividade.idAtividade}`;
//                 link.textContent = `${atividade.titulo} - Data de entrega: ${formatarData(atividade.dataEntrega)} - Até às: ${formatarHora(atividade.hora)}`;

//                 divAtividade.appendChild(link);

//                 // Exibe os botões apenas se o usuário for professor
//                 if (user.perfil.cargo === "professor") {
//                     let divBotoes = document.createElement("div");
//                     divBotoes.classList.add("div-botao");

//                     let botaoExcluir = document.createElement("a");
//                     botaoExcluir.classList.add("atividade", "botao-excluir");
//                     botaoExcluir.textContent = "Excluir";
//                     botaoExcluir.onclick = async () => {
//                         if (confirm("Você tem certeza que deseja excluir esta atividade?")) {
//                             try {
//                                 let deleteResponse = await fetch(`http://localhost:3000/atividades/${atividade.idAtividade}`, {
//                                     method: 'DELETE',
//                                     headers: { 'Content-Type': 'application/json' }
//                                 });
//                                 if (!deleteResponse.ok)
//                                     throw new Error(`Erro ao excluir atividade: ${deleteResponse.statusText}`);

//                                 alert("Atividade excluída com sucesso!");
//                                 carregarAtividades();
//                             } catch (error) {
//                                 console.error("Erro ao excluir atividade:", error);
//                                 alert("Erro ao excluir atividade. Tente novamente mais tarde.");
//                             }
//                         }
//                     };

//                     let botaoEditar = document.createElement("a");
//                     botaoEditar.classList.add("atividade", "botao-editar");
//                     botaoEditar.textContent = "Editar";
//                     botaoEditar.onclick = () => criarFormularioEdicao(atividade);

//                     divBotoes.appendChild(botaoExcluir);
//                     divBotoes.appendChild(botaoEditar);

//                     divAtividade.appendChild(divBotoes);
//                 }

//                 listaAtividades.appendChild(divAtividade);
//             });
//         }
//     } catch (error) {
//         console.error("Erro ao carregar atividades:", error);
//         alert("Erro ao carregar atividades. Verifique sua conexão ou tente novamente mais tarde.");
//     }
// }
// let modal = document.querySelector(".modal-container");

// function closeModal() {
//     let modalContainer = document.querySelector(".modal-container");
//     if (modalContainer) {
//         modalContainer.classList.add("closing");

//         setTimeout(() => {
//             modalContainer.remove();
//         }, 400); // Tempo da animação de fechamento
//     }
// }

// async function criarFormularioEdicao(atividade) {
//     // Remove o modal anterior, se existir
//     let modalExistente = document.querySelector(".modal-container");
//     if (modalExistente) {
//         modalExistente.remove();
//     }

//     try {
//         let response = await fetch(`http://localhost:3000/atividades/${atividade.idAtividade}`);
//         if (!response.ok) throw new Error(`Erro ao buscar matéria: ${response.statusText}`);

//         let materia = await response.json();
//         let nomeMateria = materia.nome;
//         let data = atividade.dataEntrega.split("T")[0];

//         // Criando a estrutura do modal
//         let modalContainer = document.createElement("div");
//         modalContainer.classList.add("modal-container");

//         let modal = document.createElement("div");
//         modal.classList.add("modal");

//         modal.innerHTML = `
//             <h2>Editar Tarefa</h2>
//             <hr />
//             <form id="editTaskForm">
//                 <label for="subject">Matéria:</label>
//                 <input type="text" id="subject" name="subject" readonly value="${nomeMateria}">	
                
//                 <label for="title">Título:</label>
//                 <input type="text" id="title" name="title" value="${atividade.titulo}">
                
//                 <label for="description">Descrição:</label>
//                 <textarea id="description" name="description">${atividade.descricao}</textarea>
                
//                 <label for="dueDate">Data de Entrega:</label>
//                 <input type="date" id="dueDate" name="dueDate" value="${data}">
                
//                 <label for="dueTime">Hora de Entrega:</label>
//                 <input type="time" id="dueTime" name="dueTime" value="${atividade.hora}">

//                 <label for="weight">Peso:</label>
//                 <input type="number" id="weight" name="weight" value="${atividade.peso || 0}" min="0" max="100" step="0.01">

//                 <hr />
//                 <div class="btns">
//                     <button type="button" class="btnClose" onclick="closeModal()">Cancelar</button>
//                     <button type="submit" class="btnOK">Salvar</button>
//                 </div>
//             </form>
//         `;
//         console.log("Atividade:", atividade);

//         modalContainer.appendChild(modal);
//         document.body.appendChild(modalContainer);
//         modalContainer.classList.add("active");

//         // Validação de data e hora ao carregar o formulário
//         let dueDateInput = modal.querySelector("#dueDate");
//         let dueTimeInput = modal.querySelector("#dueTime");

//         let hoje = new Date().toISOString().split("T")[0];
//         dueDateInput.setAttribute("min", hoje);

//         dueDateInput.addEventListener("change", () => {
//             if (dueDateInput.value === hoje) {
//                 let agora = new Date();
//                 let horas = agora.getHours().toString().padStart(2, "0");
//                 let minutos = agora.getMinutes().toString().padStart(2, "0");
//                 dueTimeInput.setAttribute("min", `${horas}:${minutos}`);
//             } else {
//                 dueTimeInput.removeAttribute("min");
//             }
//         });

//         // Ao clicar em salvar
//         let form = modal.querySelector("#editTaskForm");
//         form.addEventListener("submit", async (event) => {
//             event.preventDefault();
//             await salvarEdicao(atividade);
//         });

//     } catch (error) {
//         console.error("Erro ao criar formulário de edição:", error);
//     }
// }

// async function salvarEdicao(atividade) {
//     let form = document.getElementById("editTaskForm");
//     let formData = new FormData(form);

//     let atividadeAtualizada = {
//         idAtividade: atividade.idAtividade,
//         idMateria: idMateria,
//         titulo: formData.get("title"),
//         descricao: formData.get("description"),
//         dataEntrega: formData.get("dueDate"),
//         hora: formData.get("dueTime"),
//         peso: formData.get("weight")
//     };

//     console.log("Dados da atividade atualizada:", atividadeAtualizada);

//     try {
//         let response = await fetch(`http://localhost:3000/atividades/${atividade.idAtividade}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(atividadeAtualizada)
//         });

//         if (!response.ok) {
//             throw new Error(`Erro ao atualizar atividade: ${response.statusText}`);
//         }

//         alert("Atividade atualizada com sucesso!");
//         closeModal();
//         window.location.reload();
//     } catch (error) {
//         console.error("Erro ao salvar edição:", error);
//     }
// }



// // Evento para carregar as atividades ou uma atividade específica ao carregar a página
// document.addEventListener('DOMContentLoaded', function () {

//     let containerAtividades = document.querySelector('.list-atividades');
//     if (containerAtividades)
//         carregarAtividades();
//     else
//         console.error("Elemento .list-atividades não encontrado!");

//     if (containerAtividades && user.tipo === "colaborador") {
//         // Cria o link para adicionar atividades
//         let link = document.createElement("a");
//         link.classList.add("adicionarAtividade");
//         link.href = `cadastro-atividade.html?id=${idMateria}&idT=${urlParams.get('idT')}`; // Adiciona o idTurma aqui
//         link.textContent = `Adicionar Atividades +`;

//         // Insere o link antes da lista de atividades
//         containerAtividades.insertAdjacentElement('beforebegin', link);
//     }
// });

// document.getElementById('toggle-menu').addEventListener('click', () => {
//     let sidebar = document.querySelector('.side-menu');
//     sidebar.classList.toggle('collapsed');
// });