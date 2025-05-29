import Notas from '../model/notasModel.js';

class NotasController {
    static async getNotasAlunoPorDisciplinaETurma(req, res) {
        try {
            let { idAluno, idDisciplina, idTurma } = req.params;
            let notas = await Notas.buscarNotasPorAlunoDisciplinaETurma(idAluno, idDisciplina, idTurma);
            res.json(notas);
        } catch (error) {
            console.error("Erro ao buscar notas por disciplina e turma:", error);
            res.status(500).json({ error: 'Erro ao buscar notas por disciplina e turma' });
        }
    }

    static async getNotasPorTurma(req, res) {
        try {
            let { idAluno, idTurma } = req.params;
            let notas = await Notas.buscarNotasPorAlunoETurma(idAluno, idTurma);
            res.json(notas);
        } catch (error) {
            console.error("Erro ao buscar notas do aluno por turma:", error);
            res.status(500).json({ error: 'Erro ao buscar notas do aluno por turma' });
        }
    }

    static async getNotasPorTurmaEDisciplina(req, res) {
        try {
            let { idTurma, idDisciplina } = req.params;
            let notas = await Notas.buscarNotasPorTurmaEDisciplina(idTurma, idDisciplina);
            res.json(notas);
        } catch (error) {
            console.error("Erro ao buscar notas por turma e disciplina:", error);
            res.status(500).json({ error: 'Erro ao buscar notas por turma e disciplina' });
        }
    }
}

export default NotasController;