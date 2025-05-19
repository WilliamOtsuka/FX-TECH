import db from '../../../connection-db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

let SECRET_KEY = 'seuSegredo';

class Usuarios {
    static async login(ra, tipo, senha) {

        // Verifica se o usuário existe
        let [rows] = await db.query('SELECT * FROM Usuarios WHERE ra = ?', [ra]);
        if (rows.length === 0) {
            throw new Error('Usuário não encontrado');
        }

        let user = rows[0];
        console.log("Usuário encontrado:", user);

        // Validação de senha
        if (senha !== user.senha) {
            throw new Error('Senha incorreta');
        }

        if (tipo !== user.tipo) {
            throw new Error('Tipo de usuário não corresponde ao tipo informado');
        }

        let perfil = null;
        let turmas = [];

        if (tipo === 'aluno') {
            let [alunoRows] = await db.query('SELECT * FROM Alunos WHERE idAluno = ?', [user.idReferencia]);
            if (alunoRows.length === 0) {
                throw new Error('Aluno não encontrado');
            }

            perfil = alunoRows[0];

            let [turmasAluno] = await db.query(`
                SELECT t.idTurma, t.nome, t.idAno_letivo, al.ano AS anoLetivo
                FROM alunos_turma at 
                JOIN turmas t ON at.idTurma = t.idTurma
                JOIN ano_letivo al ON t.idAno_letivo = al.idAno_letivo
                WHERE at.idAluno = ?
            `, [user.idReferencia]);

            for (let turma of turmasAluno) {
                let [disciplinasTurma] = await db.query(`
                    SELECT d.idDisciplina, d.nome 
                    FROM disciplinas d 
                    JOIN turma_disciplinas td ON d.idDisciplina = td.idDisciplina 
                    WHERE td.idTurma = ?
                `, [turma.idTurma]);

                turmas.push({
                    idTurma: turma.idTurma,
                    nome: turma.nome,
                    idAno_letivo: turma.idAno_letivo,
                    anoLetivo: turma.anoLetivo,
                    disciplinas: disciplinasTurma
                });
            }
        } else if (tipo === 'colaborador') {
            let [profRows] = await db.query('SELECT * FROM colaboradores WHERE idColaboradores = ?', [user.idReferencia]);
            if (profRows.length === 0) {
                throw new Error('Funcionário não encontrado');
            }

            perfil = profRows[0];

            let [turmasDisciplinas] = await db.query(`
                SELECT 
                    t.idTurma, t.nome AS nomeTurma, t.idAno_letivo, al.ano AS anoLetivo,
                    d.idDisciplina, d.nome AS nomeDisciplina
                FROM professor_turma pt
                JOIN turmas t ON pt.idTurma = t.idTurma
                JOIN ano_letivo al ON t.idAno_letivo = al.idAno_letivo
                JOIN disciplinas d ON pt.idDisciplina = d.idDisciplina
                WHERE pt.idColaboradores = ?
            `, [user.idReferencia]);

            let turmaMap = new Map();

            for (let row of turmasDisciplinas) {
                if (!turmaMap.has(row.idTurma)) {
                    turmaMap.set(row.idTurma, {
                        idTurma: row.idTurma,
                        nome: row.nomeTurma,
                        idAno_letivo: row.idAno_letivo,
                        anoLetivo: row.anoLetivo,
                        disciplinas: []
                    });
                }

                turmaMap.get(row.idTurma).disciplinas.push({
                    idDisciplina: row.idDisciplina,
                    nome: row.nomeDisciplina
                });
            }

            turmas = Array.from(turmaMap.values());
        } else {
            throw new Error('Tipo de usuário inválido');
        }

        // Gera o token JWT
        let token = jwt.sign(
            {
                id: user.idUsuario,
                tipo: user.tipo,
                ra: user.ra,
                idReferencia: user.idReferencia
            },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        return { user, perfil, turmas, token };
    }

    static async listarFuncionarios() {
        let [rows] = await db.query(`
            SELECT u.email_pessoal, u.email_educacional, c.idColaboradores, u.nome, c.cargo, u.RA, u.cpf, u.contato, u.idUsuario
            FROM colaboradores c
            JOIN usuarios u ON c.idColaboradores = u.idReferencia AND u.tipo = 'colaborador'
            ORDER BY u.nome ASC
        `);
        return rows;
    }

    static async atualizarFuncionario(id, { nome, cargo, email_pessoal, email_educacional, RA, cpf, contato }) {
        let [result] = await db.query(`
            UPDATE usuarios u
            JOIN colaboradores c ON u.idReferencia = c.idColaboradores AND u.tipo = 'colaborador'
            SET u.nome = ?, c.cargo = ?, u.ra = ?, u.email_pessoal = ?, u.email_educacional = ?, u.contato = ?, u.cpf = ?
            WHERE u.idUsuario = ?
        `, [nome, cargo, RA, email_pessoal, email_educacional, contato, cpf, id]);
        return result.affectedRows > 0;
    }

    static async verificarAssociacaoTurmaProfessor(id) {
        let [rows] = await db.query(`
            SELECT * FROM professor_turma WHERE idColaboradores = ?
        `, [id]);
        return rows.length > 0;
    }

    static async excluirFuncionario(id) {
        let [result] = await db.query(`
            DELETE u, c FROM usuarios u
            JOIN colaboradores c ON u.idReferencia = c.idColaboradores AND u.tipo = 'colaborador'
            WHERE u.idUsuario = ?
        `, [id]);
        return result.affectedRows > 0;
    }

    static async listarAlunos() {
        let [rows] = await db.query(`
            SELECT u.email_pessoal, u.email_educacional, a.idAluno, u.nome, u.ra, u.cpf, u.contato, u.endereco, a.pai, a.mae, u.data_nascimento, u.idUsuario
            FROM alunos a
            JOIN usuarios u ON a.idAluno = u.idReferencia AND u.tipo = 'aluno'
            ORDER BY u.nome ASC
        `);
        return rows;
    }
    
    static async atualizarAluno(id, { nome, RA, email_pessoal, email_educacional, cpf, contato, endereco, pai, mae, data_nascimento }) {
        let [result] = await db.query(`
            UPDATE usuarios u
            JOIN alunos a ON u.idReferencia = a.idAluno AND u.tipo = 'aluno'
            SET 
                u.nome = ?, 
                u.ra = ?, 
                u.email_pessoal = ?, 
                u.email_educacional = ?, 
                u.contato = ?, 
                u.cpf = ?, 
                u.endereco = ?, 
                u.data_nascimento = ?, 
                a.pai = ?, 
                a.mae = ?
            WHERE u.idUsuario = ?
        `, [nome, RA, email_pessoal, email_educacional, contato, cpf, endereco, data_nascimento, pai, mae, id]);
        return result.affectedRows > 0;
    }

    static async verificarAssociacaoTurmaAluno(id) {
        let [rows] = await db.query(`
            SELECT * FROM alunos_turma WHERE idAluno = ?
        `, [id]);
        return rows.length > 0;
    }

    static async excluirAluno(id) {
        let [result] = await db.query(`
            DELETE u, a FROM usuarios u
            JOIN alunos a ON u.idReferencia = a.idAluno AND u.tipo = 'aluno'
            WHERE u.idUsuario = ?
        `, [id]);
        return result.affectedRows > 0;
    }
}

export default Usuarios;