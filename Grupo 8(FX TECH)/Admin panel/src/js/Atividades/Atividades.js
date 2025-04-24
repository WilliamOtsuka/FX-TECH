export class Atividade {
    idAtividade;
    titulo;
    descricao;
    dataEntrega;
    hora;
    idMateria; // Associação com Matéria

    constructor(idAtividade, titulo, descricao, dataEntrega, hora, idMateria) {
        this.idAtividade = idAtividade;
        this.titulo = titulo;
        this.descricao = descricao;
        this.dataEntrega = dataEntrega;
        this.hora = hora;
        this.idMateria = idMateria; // Armazena a matéria associada
    }

    getIdAtividade() {
        return this.idAtividade;
    }

    getIdMateria() {
        return this.idMateria;
    }
}
