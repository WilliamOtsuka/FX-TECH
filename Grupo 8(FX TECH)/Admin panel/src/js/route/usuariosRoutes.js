import express from 'express';
import UsuariosController from '../controller/usuariosController.js';

let router = express.Router();

router.post('/login', UsuariosController.login);
router.get('/usuario/funcionarios', UsuariosController.listarFuncionarios);
router.put('/usuario/funcionario/:id', UsuariosController.atualizarFuncionario);
router.delete('/usuario/funcionario/:id', UsuariosController.excluirFuncionario);

export default router;