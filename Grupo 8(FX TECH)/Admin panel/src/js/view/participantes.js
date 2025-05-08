let urlParams = new URLSearchParams(window.location.search);
let idTurma = urlParams.get("idT");
let idMateria = urlParams.get("idM");

async function carregarParticipantes() {
    try {
        // let response = await fetch(`http://localhost:3000/materias/${idMateria}/participantes/${idTurma}`);
        let response = await fetch(`http://localhost:3000/turmas/${idTurma}/materia/${idMateria}/participantes`);
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


let containerParticipantes = document.querySelector('.list-participantes');
if (containerParticipantes) {
    carregarParticipantes();

}