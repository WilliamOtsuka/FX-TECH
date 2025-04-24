document.addEventListener("DOMContentLoaded", function () {
    const dataInput = document.getElementById("data");
    const horaInput = document.getElementById("hora");
    const errorMessage = document.getElementById("error-message");

    // Configura o campo de data para impedir a seleção de datas passadas
    const hoje = new Date().toISOString().split("T")[0];
    dataInput.setAttribute("min", hoje);

    // Atualiza o horário mínimo se a data for hoje
    dataInput.addEventListener("change", function () {
        if (dataInput.value === hoje) {
            const agora = new Date();
            let horas = agora.getHours().toString().padStart(2, "0");
            let minutos = agora.getMinutes().toString().padStart(2, "0");
            horaInput.setAttribute("min", `${horas}:${minutos}`);
        } else {
            horaInput.removeAttribute("min"); // Se não for hoje, permite qualquer horário
        }
    });
    // Evita com que o usuario possa digitar um peso maior que 100 ou menor que 1
    const pesoSelect = document.getElementById("peso");

    pesoSelect.addEventListener("input", function () {
        const valor = parseInt(pesoSelect.value, 10);
        if (valor < 1 || valor > 100) {
            // impede o usuário de selecionar um valor fora do intervalo
            pesoSelect.value = ""; // Limpa o campo se o valor for inválido
            return;
        }
    });

    document.getElementById("atividadeForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        // Captura dos valores dos campos
        let titulo = document.getElementById("titulo").value.trim();
        let descricao = document.getElementById("descricao").value.trim();
        let dataEntrega = dataInput.value;
        let hora = horaInput.value;
        let peso = pesoSelect.value;
        let arquivo = document.getElementById("arquivo").files[0];

        // Validações
        if (!titulo) {
            errorMessage.textContent = "O título da atividade é obrigatório.";
            return;
        }

        if (!descricao) {
            errorMessage.textContent = "A descrição da atividade é obrigatória.";
            return;
        }

        if (!dataEntrega) {
            errorMessage.textContent = "A data de entrega é obrigatória.";
            return;
        }

        if (!hora) {
            errorMessage.textContent = "A hora de entrega é obrigatória.";
            return;
        }

        if (!peso) {
            errorMessage.textContent = "O peso da atividade é obrigatório.";
            return;
        }

        errorMessage.textContent = "";

        const urlParams = new URLSearchParams(window.location.search);
        const idMateria = urlParams.get('id');
        const idTurma = urlParams.get('idT');

        try {
            const response = await fetch('http://localhost:3000/adicionar-atividade', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ titulo, descricao, dataEntrega, hora, peso, idMateria, idTurma }) // Envia o idMateria também
            });

            if (response.ok) {
                alert('Atividade adicionada com sucesso!');
                document.getElementById('atividadeForm').reset(); // Limpa o formulário após o envio
            } else {
                const data = await response.json();
                alert(`Erro: ${data.message}`);
            }
        } catch (error) {
            console.error('Erro ao adicionar a atividade:', error);
            alert('Erro de conexão. Tente novamente.');
        }
        window.location.replace('./adicionarAtividade.html?id=' + idMateria + '&idT=' + idTurma); // Redireciona para a página de atividades com idMateria e idTurma
    });
});
