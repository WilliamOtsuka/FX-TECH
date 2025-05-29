import express from 'express';
import UsuariosController from '../controller/usuariosController.js';
import multer from 'multer';
import path from 'path';

let router = express.Router();

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'matricula/');
    },
    filename: (req, file, cb) => {
        let uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});
let upload = multer({ storage });



router.post('/login', UsuariosController.login);
router.post('/usuario/funcionario', UsuariosController.cadastrarFuncionario);
router.get('/usuario/funcionarios', UsuariosController.listarFuncionarios);
router.put('/usuario/funcionario/:id', UsuariosController.atualizarFuncionario);
router.delete('/usuario/funcionario/:id', UsuariosController.excluirFuncionario);
router.get('/usuario/funcionarios/RA/:ano', UsuariosController.buscarMaiorRAFuncionario);

// router.post('/usuario/aluno', upload.fields([{ name: 'foto', maxCount: 1 }, { name: 'historico', maxCount: 1 }]), UsuariosController.matricularAluno);
router.post('/usuario/aluno', upload.fields([{ name: 'historico', maxCount: 1 }]), UsuariosController.matricularAluno);
router.get('/usuario/alunos', UsuariosController.listarAlunos);
router.put('/usuario/aluno/:id', UsuariosController.atualizarAluno);
router.delete('/usuario/aluno/:id', UsuariosController.excluirAluno);

export default router;