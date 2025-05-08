import Turmas from "../model/turmasModel.js";

class TurmasController {
    static async listarPeriodosPorTurma(req, res) {
        try {
            let { id } = req.params;
            let periodos = await Turmas.buscarPeriodosPorTurma(id);
            if (periodos.length > 0) {
                res.json(periodos);
            } else {
                res.status(404).json({ message: "Nenhum período encontrado para a turma." });
            }
        } catch (error) {
            console.error("Erro ao listar períodos por turma:", error);
            res.status(500).json({ error: "Erro ao listar períodos por turma." });
        }
    }

    static async buscarMateriaPorTurma(req, res) {
        try {
            let { idT, idMateria } = req.params;
            let materia = await Turmas.buscarMateriaPorTurma(idT, idMateria);
            if (materia) {
                res.json(materia);
            } else {
                res.status(404).json({ message: "Matéria não encontrada na turma." });
            }
        } catch (error) {
            console.error("Erro ao buscar matéria por turma:", error);
            res.status(500).json({ error: "Erro ao buscar matéria por turma." });
        }
    }

    static async listarAlunosPorMateriaTurma(req, res) {
        try {
            let { idT, idMateria } = req.params;
            let alunos = await Turmas.listarAlunosPorMateriaTurma(idT, idMateria);
            if (alunos.length > 0) {
                res.json(alunos);
            } else {
                res.status(404).json({ message: "Nenhum aluno encontrado para a matéria e turma especificadas." });
            }
        } catch (error) {
            console.error("Erro ao listar alunos por matéria e turma:", error);
            res.status(500).json({ error: "Erro ao listar alunos por matéria e turma." });
        }
    }
}

export default TurmasController;