import Materias from '../model/materiasModel.js';

class MateriasController {
    static async listarMaterias(req, res) {
        try {
            let materias = await Materias.buscarTodas();
            res.json(materias);
        } catch (error) {
            console.error('Erro ao listar matérias:', error);
            res.status(500).json({ error: 'Erro ao listar matérias' });
        }
    }
}

export default MateriasController;