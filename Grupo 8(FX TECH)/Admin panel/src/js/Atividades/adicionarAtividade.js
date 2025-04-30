function ajustarCamposPorTipo(tipoSelecionado) {
    let dataInput = document.getElementById("data");
    let horaInput = document.getElementById("hora");

    let hoje = new Date().toISOString().split("T")[0];

    if (tipoSelecionado === "atividade") {
        // Remove todo valor do campo de data
        dataInput.value = ""; // Limpa o campo de data
        horaInput.value = ""; // Limpa o campo de hora
        // Para "atividade", restringe a data mínima para hoje
        dataInput.setAttribute("min", hoje);

        dataInput.addEventListener("change", function () {
            if (dataInput.value === hoje) {
                let agora = new Date();
                let horas = agora.getHours().toString().padStart(2, "0");
                let minutos = agora.getMinutes().toString().padStart(2, "0");
                horaInput.setAttribute("min", `${horas}:${minutos}`);
            } else {
                horaInput.removeAttribute("min");
            }
        });
    } else if (tipoSelecionado === "avaliativa") {
        // Para "avaliativa", permite qualquer data e hora
        dataInput.removeAttribute("min");
        horaInput.removeAttribute("min");
    }
}

function carregarTipos() {
    let tipos = ["atividade", "avaliativa"];
    let tipoContainer = document.querySelector('.tipo-container');
    if (!tipoContainer) {
        console.error("Elemento #tipo-container não encontrado!");
        return;
    }

    let wrapper = document.createElement('div');
    wrapper.classList.add('dropdown-tipos-wrapper');

    let selected = document.createElement('div');
    selected.classList.add('dropdown-tipos-selected');
    selected.textContent = tipos[0]; // Define o primeiro valor como selecionado inicialmente

    let list = document.createElement('ul');
    list.classList.add('dropdown-tipos-list');
    list.style.display = 'none';

    tipos.forEach(tipo => {
        let item = document.createElement('li');
        item.textContent = tipo;
        item.addEventListener('click', () => {
            selected.textContent = tipo;
            list.style.display = 'none';
            ajustarCamposPorTipo(tipo); 
        });
        list.appendChild(item);
    });

    selected.addEventListener('click', () => {
        list.style.display = list.style.display === 'none' ? 'block' : 'none';
    });

    // Fecha o dropdown ao clicar fora
    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
            list.style.display = 'none';
        }
    });

    wrapper.appendChild(selected);
    wrapper.appendChild(list);
    tipoContainer.appendChild(wrapper);

    ajustarCamposPorTipo(tipos[0]);
}


document.addEventListener("DOMContentLoaded", function () {
    carregarTipos();

    // Evita com que o usuario possa digitar um peso maior que 100 ou menor que 1
    let pesoSelect = document.getElementById("peso");

    pesoSelect.addEventListener("input", function () {
        let valor = parseInt(pesoSelect.value, 10);
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
        let dataEntrega = document.getElementById("data").value;
        let hora = document.getElementById("hora").value;
        let peso = pesoSelect.value;
        let tipo = document.querySelector('.dropdown-tipos-selected').textContent;
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

        if (!tipo) {
            errorMessage.textContent = "O tipo da atividade é obrigatório.";
            return;
        }

        let urlParams = new URLSearchParams(window.location.search);
        let idMateria = urlParams.get('id');
        let idTurma = urlParams.get('idT');

        try {
            let response = await fetch('http://localhost:3000/adicionar-atividade', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ titulo, descricao, dataEntrega, hora, peso, idMateria, idTurma, tipo }) // Envia o idMateria também
            });

            if (response.ok) {
                alert('Atividade adicionada com sucesso!');
                document.getElementById('atividadeForm').reset(); // Limpa o formulário após o envio
            } else {
                let data = await response.json();
                alert(`Erro: ${data.message}`);
            }
        } catch (error) {
            console.error('Erro ao adicionar a atividade:', error);
            alert('Erro de conexão. Tente novamente.');
        }
        window.location.replace('./adicionarAtividade.html?id=' + idMateria + '&idT=' + idTurma); // Redireciona para a página de atividades com idMateria e idTurma
    });
});
