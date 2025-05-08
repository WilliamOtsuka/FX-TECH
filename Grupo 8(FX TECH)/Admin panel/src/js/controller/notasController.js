import Notas from '../model/notasModel.js';

class NotasController {
    static async getNotasAlunoPorMateriaETurma(req, res) {
        try {
            let { idAluno, idMateria, idTurma } = req.params;
            let notas = await Notas.buscarNotasPorAlunoMateriaETurma(idAluno, idMateria, idTurma);
            res.json(notas);
        } catch (error) {
            console.error("Erro ao buscar notas por matéria e turma:", error);
            res.status(500).json({ error: 'Erro ao buscar notas por matéria e turma' });
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
}

export default NotasController;