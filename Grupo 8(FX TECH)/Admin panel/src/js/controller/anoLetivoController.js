import AnoLetivo from '../model/anoLetivoModel.js';

class AnoLetivoController {
    static async listarAnoLetivo(req, res) {
        try {
            let anosLetivos = await AnoLetivo.buscarTodos();
            res.json(anosLetivos);
        } catch (error) {
            console.error('Erro ao listar anos letivos:', error);
            res.status(500).json({ error: 'Erro ao listar anos letivos' });
        }
    }
}

export default AnoLetivoController;