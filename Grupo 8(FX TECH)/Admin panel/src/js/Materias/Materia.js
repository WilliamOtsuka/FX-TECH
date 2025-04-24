import { Atividade } from '../Atividades/Atividades.js';

export class Materia {
    idMateria;
    nome;
    atividades;

    constructor(idMateria, nome) {
        this.idMateria = idMateria;
        this.nome = nome;
        this.atividades = [];
    }

    getIdMateria() {
        return this.idMateria;
    }

    setIdMateria(idMateria) {
        this.idMateria = idMateria;
    }

    getNome() {
        return this.nome;
    }

    setNome(nome) {
        this.nome = nome;
    }

    adicionarAtividade(atividade) {
        if (atividade instanceof Atividade) {
            this.atividades.push(atividade);
        } else {
            throw new Error("O objeto informado não é uma instância de Atividade.");
        }
    }

    listarAtividades() {
        return this.atividades;
    }

}