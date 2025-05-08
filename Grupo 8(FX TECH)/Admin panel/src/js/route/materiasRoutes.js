import express from 'express';
import MateriasController from '../controller/materiasController.js';

let router = express.Router();

router.get('/materias', MateriasController.listarMaterias);

export default router;