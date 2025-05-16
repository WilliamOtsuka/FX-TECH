import express from 'express';
import notasController from '../controller/notasController.js';

let router = express.Router();

router.get('/notas/aluno/:idAluno/disciplina/:idDisciplina/turma/:idTurma', notasController.getNotasAlunoPorDisciplinaETurma);
router.get('/notas/aluno/:idAluno/turma/:idTurma', notasController.getNotasPorTurma);

export default router;
