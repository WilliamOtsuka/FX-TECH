import express, { Router } from 'express';
import disciplinasController from '../controller/disciplinasController.js';

let router = express.Router();

router.get('/disciplinas', disciplinasController.listarDisciplinas);
router.put('/disciplinas/turma/:idTurma', disciplinasController.atualizarDisciplinasTurma);
router.delete('/disciplinas/turma/:idTurma', disciplinasController.deleteDisciplinasTurma);

export default router;