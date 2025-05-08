import express from 'express';
import notasController from '../controller/notasController.js';

let router = express.Router();

router.get('/notas/aluno/:idAluno/materia/:idMateria/turma/:idTurma', notasController.getNotasAlunoPorMateriaETurma);
router.get('/notas/aluno/:idAluno/turma/:idTurma', notasController.getNotasPorTurma);

export default router;
