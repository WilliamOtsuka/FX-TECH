import express from 'express';
import AtividadesController from '../controller/atividadesController.js';

const router = express.Router();

router.post('/atividades/aluno', AtividadesController.enviarAtividade);
router.post('/atividades', AtividadesController.cadastrarAtividade);
router.get('/atividades/materia/:idMateria/turma/:idT', AtividadesController.buscarAtividadesMateriasTurmas);
router.get('/atividades/:id', AtividadesController.buscarAtividade);
router.delete('/atividades/:id', AtividadesController.excluirAtividade);
router.put('/atividades/:id', AtividadesController.atualizarAtividade);
router.get('/atividades/:id/entrega/pendente/alunos', AtividadesController.buscarAtividadesNaoEntregues);
router.get('/atividades/:id/correcao/pendente/alunos', AtividadesController.buscarAtividadesNaoCorrigidas);
router.get('/atividades/:id/correcao/corrigida/alunos', AtividadesController.buscarAtividadeCorrigidas);
router.post('/atividades/:id/correcao/aluno/:idAluno', AtividadesController.enviarCorrecao);
router.put('/atividades/:id/correcao/aluno/:idAluno', AtividadesController.atualizarCorrecao);
router.delete('/atividades/:id/correcao/aluno/:idAluno', AtividadesController.excluirCorrecao);
router.get('/atividades/:id/feedback/aluno/:idAluno', AtividadesController.buscarCorrecaoDaAtividadeDoAluno);
router.get('/atividades/:id/resposta/aluno/:idAluno', AtividadesController.buscarRespostaDoAluno);

export default router;