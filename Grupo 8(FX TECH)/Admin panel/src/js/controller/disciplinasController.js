import Disciplinas from '../model/disciplinasModel.js';

class DisciplinasController {
    static async listarDisciplinas(req, res) {
        try {
            let disciplinas = await Disciplinas.buscarTodas();
            res.json(disciplinas);
        } catch (error) {
            console.error('Erro ao listar disciplinas:', error);
            res.status(500).json({ error: 'Erro ao listar disciplinas' });
        }
    }
    
    static async atualizarDisciplinasTurma(req, res) {
        try {
            const { idTurma } = req.params;
            const { adicionadas } = req.body;

            if (!Array.isArray(adicionadas)) {
                return res.status(400).json({ error: 'O corpo da requisição deve conter arrays "adicionadas" e "removidas"' });
            }

            await Disciplinas.atualizarDisciplinasTurma(idTurma, adicionadas);
            res.status(200).json({ message: 'Disciplinas da turma atualizadas/removidas com sucesso' });
        } catch (error) {
            console.error('Erro ao atualizar/remover disciplinas da turma:', error);
            res.status(500).json({ error: 'Erro ao atualizar/remover disciplinas da turma' });
        }
    }

    static async deleteDisciplinasTurma(req, res) {
        try {
            const { idTurma } = req.params;
            const { removidas } = req.body;

            if (!Array.isArray(removidas)) {
                return res.status(400).json({ error: 'O corpo da requisição deve conter arrays "adicionadas" e "removidas"' });
            }

            await Disciplinas.deleteDisciplinasTurma(idTurma, removidas);
            res.status(200).json({ message: 'Disciplinas da turma atualizadas/removidas com sucesso' });
        } catch (error) {
            console.error('Erro ao atualizar/remover disciplinas da turma:', error);
            res.status(500).json({ error: 'Erro ao atualizar/remover disciplinas da turma' });
        }
    }

}

export default DisciplinasController;