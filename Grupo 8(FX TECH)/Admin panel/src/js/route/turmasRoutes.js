import express from 'express';
import TurmasController from '../controller/turmasController.js';

let router = express.Router();

router.get('/turmas/:id/periodos', TurmasController.listarPeriodosPorTurma);
router.get('/turmas/:idT/materia/:idMateria/', TurmasController.buscarMateriaPorTurma);
router.get('/turmas/:idT/materia/:idMateria/participantes', TurmasController.listarAlunosPorMateriaTurma);

export default router;