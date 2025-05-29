import AtividadesController from '../controller/atividadesController.js';
import express from 'express';
import multer from 'multer';
import path from 'path';

let router = express.Router();

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'atividades/');
    },
    filename: (req, file, cb) => {
        let uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});
let upload = multer({ storage });


router.post('/atividades/aluno', upload.single('arquivo'), AtividadesController.enviarAtividade);
router.post('/atividades', AtividadesController.cadastrarAtividade);
router.get('/atividades/disciplina/:idDisciplina/turma/:idT', AtividadesController.buscarAtividadesDisciplinasTurmas);
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
router.get('/atividades/turma/:idTurma/disciplina/:idDisciplina/data/:data', AtividadesController.buscarAtividadesPorData);

export default router;