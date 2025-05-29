import express from 'express';
import TurmasController from '../controller/turmasController.js';

let router = express.Router();

router.post('/turmas', TurmasController.criarTurma);
router.get('/turmas', TurmasController.listarTurmas);
router.put('/turmas/:id', TurmasController.atualizarTurma);
router.delete('/turmas/:id', TurmasController.deletarTurma);
router.get('/turmas/:id/periodos', TurmasController.listarPeriodosPorTurma);
router.get('/turmas/:idT/disciplinas', TurmasController.listarDisciplinasPorTurma);
router.get('/turmas/:idT/disciplina/participantes', TurmasController.listarParticipantesPorTurma);
router.get('/turmas/:idT/disciplina/:idDisciplina/participantes', TurmasController.listarAlunosTurma);

export default router;