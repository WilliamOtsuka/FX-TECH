import express from 'express';
import anoLetivoController from '../controller/anoLetivoController.js';

let router = express.Router();

router.get('/ano_letivo', anoLetivoController.listarAnoLetivo);

export default router;
