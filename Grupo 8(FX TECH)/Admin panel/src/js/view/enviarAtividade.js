// let token = localStorage.getItem("token");
// let user = JSON.parse(localStorage.getItem("user"));

// console.log("Token:", token);
// console.log("User:", user);

// let urlParams = new URLSearchParams(window.location.search);
// let idAtividade = urlParams.get('idA'); // ID da atividade

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

// async function alunosRestantes() {
//     // let response = await fetch(`http://localhost:3000/atividade/${idAtividade}/tarefa/alunos`);
//     let response = await fetch(`http://localhost:3000/atividades/${idAtividade}/entrega/pendente/alunos`);
//     if (!response.ok) {
//         throw new Error(`Erro ao buscar alunos restantes: ${response.statusText}`);
//     }

//     let alunos = await response.json();
//     console.log("Alunos restantes:", alunos);

//     let alunosPendentesContainer = document.getElementById('tarefa-pendente-list');
//     if (!alunosPendentesContainer) {
//         console.error("Elemento #tarefa-pendente-list não encontrado!");
//         return;
//     }

//     alunosPendentesContainer.innerHTML = ""; // Limpa a lista antes de adicionar novos alunos

//     if (alunos.length === 0) {
//         alunosPendentesContainer.innerHTML = "<li>Nenhum aluno restante encontrado.</li>";
//         return;
//     }

//     alunos.forEach(aluno => {
//         let alunoItem = document.createElement("li");
//         alunoItem.classList.add("aluno-item");
//         alunoItem.textContent = `${aluno.nome} - ${aluno.ra}`;
//         alunoItem.style.cursor = "pointer";
//         alunoItem.onmouseover = () => {
//             alunoItem.style.color = "#2d75bd";
//         };
//         alunoItem.onmouseleave = () => {
//             alunoItem.style.color = "#000000";
//         };
//         alunosPendentesContainer.appendChild(alunoItem);
//     });
// }

// async function correcaoPendente() {
//     // let response = await fetch(`http://localhost:3000/atividade/${idAtividade}/tarefa/correcao/pendente`);
//     let response = await fetch(`http://localhost:3000/atividades/${idAtividade}/correcao/pendente/alunos`);
//     if (!response.ok) {
//         throw new Error(`Erro ao buscar correções pendentes: ${response.statusText}`);
//     }

//     let tarefas = await response.json();
//     console.log("Correções pendentes:", tarefas);

//     let tarefasEntreguesContainer = document.getElementById('tarefa-entregue-list');
//     if (!tarefasEntreguesContainer) {
//         console.error("Elemento #tarefa-entregue-list não encontrado!");
//         return;
//     }

//     tarefasEntreguesContainer.innerHTML = ""; // Limpa a lista antes de adicionar novas tarefas

//     if (tarefas.length === 0) {
//         tarefasEntreguesContainer.innerHTML = "<li>Nenhuma correção pendente encontrada.</li>";
//         return;
//     }

//     tarefas.forEach(tarefa => {
//         let tarefaItem = document.createElement("li");
//         tarefaItem.classList.add("tarefa-item");
//         tarefaItem.textContent = `${tarefa.nome} - ${tarefa.ra}`;
//         tarefaItem.style.cursor = "pointer";
//         tarefaItem.onmouseover = () => {
//             tarefaItem.style.color = "#2d75bd";
//         };
//         tarefaItem.onmouseleave = () => {
//             tarefaItem.style.color = "#000000";
//         };
//         tarefaItem.onclick = () => {
//             window.location.href = `atividade-feedback.html?idAtividade=${tarefa.idAtividade}&idAluno=${tarefa.idAluno}`;
//         };
//         tarefasEntreguesContainer.appendChild(tarefaItem);
//     });
// }

// async function alunosAtividadeCorrigida() {
//     // let response = await fetch(`http://localhost:3000/atividade/${idAtividade}/tarefa/correcao/corrigida`);
//     let response = await fetch(`http://localhost:3000/atividades/${idAtividade}/correcao/corrigida/alunos`);
//     if (!response.ok) {
//         throw new Error(`Erro ao buscar atividades corrigidas: ${response.statusText}`);
//     }

//     let tarefasCorrigidas = await response.json();
//     console.log("Atividades corrigidas:", tarefasCorrigidas);

//     let tarefasCorrigidasContainer = document.getElementById('tarefa-corrigida-list');
//     if (!tarefasCorrigidasContainer) {
//         console.error("Elemento #tarefa-corrigida-list não encontrado!");
//         return;
//     }

//     tarefasCorrigidasContainer.innerHTML = ""; // Limpa a lista antes de adicionar novas tarefas

//     if (tarefasCorrigidas.length === 0) {
//         tarefasCorrigidasContainer.innerHTML = "<li>Nenhuma tarefa corrigida encontrada.</li>";
//         return;
//     }

//     tarefasCorrigidas.forEach(tarefa => {
//         let tarefaItem = document.createElement("li");
//         tarefaItem.classList.add("tarefa-item");
//         tarefaItem.textContent = `${tarefa.nome} - ${tarefa.ra}`;
//         tarefaItem.style.cursor = "pointer";
//         tarefaItem.onmouseover = () => {
//             tarefaItem.style.color = "#2d75bd";
//         };
//         tarefaItem.onmouseleave = () => {
//             tarefaItem.style.color = "#000000";
//         };
//         tarefaItem.onclick = () => {
//             window.location.href = `atividade-feedback.html?idAtividade=${tarefa.idAtividade}&idAluno=${tarefa.idAluno}`;
//         };

//         tarefasCorrigidasContainer.appendChild(tarefaItem);
//     });
// }

// async function carregarAtividadeAluno(idAtividade, idAluno) {
//     let response = await fetch(`http://localhost:3000/atividades/${idAtividade}/resposta/aluno/${idAluno}`);
//     if (!response.ok) {
//         throw new Error(`Erro ao buscar atividade entregue: ${response.statusText}`);
//     }
//     return response.json();
// }

// async function salvarCorrecao(event) {
//     event.preventDefault();

//     let idAtividade = urlParams.get('idAtividade');
//     let idAluno = urlParams.get('idAluno');

//     let nota = parseFloat(document.getElementById("nota").value);
//     let feedback = document.getElementById("feedback").value;

//     try {
//         let response = await fetch(`http://localhost:3000/atividades/${idAtividade}/correcao/aluno/${idAluno}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ nota, feedback })
//         });

//         let data = await response.json();

//         if (!response.ok) {
//             // Verifica se o erro é devido ao status "disponível"
//             if (response.status === 403) {
//                 alert(data.message); // "Não é possível corrigir uma atividade ainda disponível."
//             } else {
//                 alert(data.message + " Erro ao salvar correção.");
//             }
//             return;
//         }

//         alert("Correção salva com sucesso!");
//         location.reload();
//     } catch (error) {
//         console.error("Erro ao salvar correção:", error);
//         alert("Erro inesperado ao salvar correção.");
//     }
// }

// function renderFormularioNota() {
//     return `
//         <div class="form-groupCorrecao">
//             <label for="nota">Nota:</label>
//             <input type="number" id="nota" name="nota" min="0" max="10" step="0.01" required>
//         </div>
//         <div class="form-groupCorrecao">
//             <label for="feedback">Feedback (opcional):</label>
//             <textarea id="feedback" name="feedback" rows="4"></textarea>
//         </div>
//         <button type="submit" class="btnCorrecao">Salvar Correção</button>
//     `;
// }

// function renderRespostaNota({ nota, feedback }) {
//     return `
//         <div class="form-groupCorrecao" id="nota-container">
//             <label>Nota:</label>
//             <p id="nota-text">${nota}</p>
//         </div>
//         <div class="form-groupCorrecao" id="feedback-container">
//             <label>Feedback:</label>
//             <p id="feedback-text">${feedback}</p>
//         </div>
//         <div class="btnsFormCorrecao">
//             <button type="button" class="btnEditarCorrecao" onclick="ativarEdicao('${nota}', '${feedback}')">Editar Correção</button>
//             <button type="button" class="btnExcluirCorrecao" onclick="excluirCorrecao()">Excluir Correção</button>
//         </div>
//     `;
// }

// async function buscarResposta(idAtividade, idAluno) {
//     // let resposta = await fetch(`http://localhost:3000/atividade/${idAtividade}/tarefa/${idAluno}/resposta`);
//     let resposta = await fetch(`http://localhost:3000/atividades/${idAtividade}/feedback/aluno/${idAluno}`);
//     if (!resposta.ok) throw new Error("Erro ao buscar resposta do aluno.");
//     return await resposta.json();
// }

// function ativarEdicao(nota, feedback) {
//     document.getElementById("nota-container").innerHTML = `
//         <label for="nota">Nota:</label>
//         <input type="number" id="nota" value="${nota}" min="0" max="10" step="0.01">
//     `;
//     document.getElementById("feedback-container").innerHTML = `
//         <label for="feedback-edit">Feedback:</label>
//         <textarea id="feedback-edit" rows="4">${feedback}</textarea>
//     `;

//     document.querySelector(".btnsFormCorrecao").innerHTML = `
//         <button type="button" class="btnEditarCorrecao" onclick="salvarEdicao()">Salvar</button>
//         <button type="button" class="btnCancelarCorrecao" onclick="carregarAtividadeEntregue()">Cancelar</button>
//     `;
// }

// async function salvarEdicao() {
//     let nota = document.getElementById("nota").value;
//     let feedback = document.getElementById("feedback-edit").value;
//     let idAluno = urlParams.get('idAluno');
//     let idAtividade = urlParams.get('idAtividade');

//     try {
//         // let response = await fetch(`http://localhost:3000/atividade/${idAtividade}/tarefa/${idAluno}/corrigir`, {
//         let response = await fetch(`http://localhost:3000/atividades/${idAtividade}/correcao/aluno/${idAluno}`, {
//             method: "PUT",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ nota, feedback })
//         });

//         if (!response.ok) throw new Error("Erro ao atualizar correção");
//         alert("Correção atualizada com sucesso!");
//         carregarAtividadeEntregue();
//     } catch (error) {
//         console.error("Erro ao editar correção:", error);
//         alert("Erro ao atualizar correção.");
//     }
// }

// async function excluirCorrecao() {
//     let idAluno = urlParams.get('idAluno');
//     let idAtividade = urlParams.get('idAtividade');

//     if (!confirm("Tem certeza que deseja excluir esta correção?")) return;

//     try {
//         // let response = await fetch(`http://localhost:3000/atividade/${idAtividade}/tarefa/${idAluno}/corrigir`, {
//         let response = await fetch(`http://localhost:3000/atividades/${idAtividade}/correcao/aluno/${idAluno}`, {
//             method: "DELETE"
//         });

//         if (!response.ok) throw new Error("Erro ao excluir correção");
//         alert("Correção excluída com sucesso!");
//         window.location.href = `atividade.html?idA=${idAtividade}`;
//     } catch (error) {
//         console.error("Erro ao excluir correção:", error);
//         alert("Erro ao excluir correção.");
//     }
// }

// async function carregarAtividadeEntregue() {
//     let idAtividade = urlParams.get('idAtividade');
//     let idAluno = urlParams.get('idAluno');

//     let backarrow = document.querySelector('.back-area-btn');
//     if (backarrow) {
//         backarrow.addEventListener('click', function (e) {
//             e.preventDefault();
//             window.location.href = `./atividade.html?idA=${idAtividade}`;
//         });
//     }

//     let tituloMateria = document.getElementById('titulo-materia');
//     tituloMateria.textContent = `${user.turmas[0].materias[0].nome}`;

//     try {
//         let atividade = await carregarAtividadeAluno(idAtividade, idAluno);
//         let container = document.querySelector(".atividade-enviada");

//         if (atividade.descricaoAluno === null) {
//             atividade.descricaoAluno = "Nenhuma descrição fornecida."
//         }

//         let formHTML = `
//             <form id="form-correcao" class="form-correcao">
//                 <h2>Correção de Atividade</h2>
//                 <div class="flex-container">
//                     <div class="flex-item">
//                         <p><strong>Aluno:</strong> ${atividade.nome}</p>
//                         <p><strong>RA:</strong> ${atividade.ra}</p>
//                     </div>
//                     <div class="flex-item">
//                         <p><strong>Título da Tarefa:</strong> ${atividade.titulo}</p>
//                         <p><strong>Descrição da Tarefa:</strong> ${atividade.descricaoAtividade}</p>
//                     </div>
//                     <div class="flex-item">
//                         <p><strong>Descrição do Aluno:</strong> ${atividade.descricaoAluno}</p>
//                         <p><strong>Peso da Atividade (%):</strong> ${atividade.peso}</p>
//                     </div>
//                 </div>
//         `;
//         if (user.tipo === "colaborador") {
//             if (atividade.correcao === 'pendente') {
//                 formHTML += renderFormularioNota();
//             } else {
//                 let resposta = await buscarResposta(idAtividade, idAluno);
//                 formHTML += renderRespostaNota(resposta);
//             }

//             formHTML += `</form>`;
//             container.innerHTML = formHTML;

//             if (atividade.correcao === 'pendente') {
//                 document.getElementById("form-correcao").addEventListener("submit", salvarCorrecao);
//             }
//         }
//     } catch (error) {
//         console.error("Erro ao carregar atividade entregue:", error);
//         alert("Erro ao carregar dados da atividade.");
//     }
// }

// function areaProfessor() {
//     alunosRestantes();
//     correcaoPendente();
//     alunosAtividadeCorrigida();
// }

// async function carregarAtividade() {
//     if (!idAtividade || isNaN(idAtividade)) {
//         console.error("ID da atividade não encontrado ou inválido na URL.");
//         return;
//     }

//     console.log("ID da Atividade:", idAtividade);

//     try {
//         let response = await fetch(`http://localhost:3000/atividades/${idAtividade}/`);
//         if (!response.ok) {
//             throw new Error(`Erro ao buscar atividade: ${response.statusText}`);
//         }

//         let atividade = await response.json();
//         console.log("Atividade carregada:", atividade);

//         let materiaAtivdade = document.getElementById('titulo-materia');
//         let tituloAtividade = document.getElementById('titulo-atividade');
//         let descricaoAtividade = document.getElementById('descricao-atividade');
//         let dataEntrega = document.getElementById('data-entrega');
//         let horaEntrega = document.getElementById('hora-entrega');

//         let materia = user.turmas.flatMap(turma => turma.materias)
//             .find(materia => materia.idMateria == atividade.idMateria);
//         if (materia) {
//             materiaAtivdade.textContent = materia.nome;
//         }

//         tituloAtividade.textContent = atividade.titulo;
//         descricaoAtividade.textContent = atividade.descricao;
//         dataEntrega.textContent = `Data de Entrega - ${formatarData(atividade.dataEntrega)}`;
//         horaEntrega.textContent = `Até às ${formatarHora(atividade.hora)}`;

//         let resposta = null;

//         try {
//             resposta = await carregarAtividadeAluno(idAtividade, user.idReferencia);
//         } catch (error) {
//             console.warn("Erro ao carregar resposta do aluno:", error);
//             resposta = { descricaoAluno: "Nenhuma descrição fornecida." };
//         }

//         let respostaContainer = document.getElementById('resposta-container');
//         if (respostaContainer && user.tipo === "aluno") {
//             if(resposta.descricaoAluno === null) {
//                 resposta.descricaoAluno = "Nenhuma descrição fornecida."
//             }
//             respostaContainer.innerHTML = resposta
//                 ? `
//                     <h3>Resposta do Aluno:</h3>
//                     <p>Descrição: ${resposta.descricaoAluno}</p>
//                 `
//                 : `<p>Nenhuma resposta encontrada.</p>`;
//         }
//         let btnEnviar = document.querySelector(".submit-btn");
//         let fileInput = document.querySelector("#arquivo");
//         let descricaoInput = document.querySelector("#descricao");

//         if (btnEnviar && fileInput && descricaoInput) {
//             if (atividade.status === "indisponivel" || user.tipo === "colaborador") {
//                 [fileInput, descricaoInput, btnEnviar].forEach(element => {
//                     element.disabled = true;
//                     element.style.backgroundColor = "#cccccc52";
//                     element.style.cursor = "not-allowed";
//                 });
//                 btnEnviar.style.backgroundColor = "#ccc";
//             }
//         }
//     } catch (error) {
//         console.error("Erro ao carregar atividade:", error);
//     }
// }

// document.addEventListener('DOMContentLoaded', function () {
//     let backarrow = document.querySelector('.back-area-btn');
//     if (backarrow) {
//         backarrow.addEventListener('click', function (e) {
//             e.preventDefault();
//             window.location.href = `./atividades-materia.html?idM=${user.turmas[0].materias[0].idMateria}&idT=${user.turmas[0].idTurma}`;
//         });
//     }


//     let atividadeEnviada = document.querySelector('.atividade-enviada');
//     if (atividadeEnviada) {
//         carregarAtividadeEntregue();
//     }


//     let menuLateral = document.querySelector('.menu-lateral');
//     if (menuLateral) {
//         carregarAtividade();
//         if (user.tipo == "colaborador") {
//             areaProfessor();
//         }
//         else {
//             let professorContainer = document.querySelector(".professor-container");
//             if (professorContainer) {
//                 professorContainer.remove();
//             }
//         }

//         document.getElementById('entregaForm').addEventListener('submit', async function (event) {
//             event.preventDefault(); // Previne o comportamento padrão do formulário
//             let idAluno = user.idReferencia; // ID do aluno (colaborador)
//             let descricao = document.getElementById('descricao').value.trim() || "Sem descrição";
//             let dataEntrega = new Date().toISOString().split('T')[0];

//             if (!descricao) {
//                 alert('A descrição da atividade é obrigatória.');
//                 return;
//             }
//             if (!idAtividade) {
//                 alert('ID da atividade não encontrado.');
//                 return;
//             }
//             if (!idAluno) {
//                 alert('ID do aluno não encontrado.');
//                 return;
//             }
//             if (!dataEntrega) {
//                 alert('Data atual não encontrada.');
//                 return;
//             }

//             try {
//                 // let response = await fetch('http://localhost:3000/entregar-atividade', {
//                 let response = await fetch('http://localhost:3000/atividades/aluno', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ idAluno, idAtividade, descricao, dataEntrega }),
//                 });
//                 if (response.ok) {
//                     alert('Atividade enviada com sucesso!');
//                     document.getElementById('entregaForm').reset(); // Limpa o formulário após o envio
//                 } else {
//                     let data = await response.json();
//                     alert(`Erro: ${data.message}`);
//                 }
//             } catch (error) {
//                 console.error('Erro ao enviar a atividade:', error);
//                 alert('Erro de conexão. Tente novamente.');
//             }
//             window.location.reload(); // Atualiza a página após o envio
//         });
//     }
// });