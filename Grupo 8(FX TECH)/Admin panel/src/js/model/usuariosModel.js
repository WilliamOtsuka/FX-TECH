import ConnectioDb from '../../../connection-db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

let SECRET_KEY = 'seuSegredo';

class Usuarios {
    static async login(ra, tipo, senha) {
        let connectDb = new ConnectioDb();
        let db = await connectDb.connect();

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
                SELECT t.idTurma, t.nome, t.idAno_letivo, al.descricao AS anoLetivo
                FROM alunos_turma at 
                JOIN turmas t ON at.idTurma = t.idTurma
                JOIN ano_letivo al ON t.idAno_letivo = al.idAno_letivo
                WHERE at.idAluno = ?
            `, [user.idReferencia]);

            for (let turma of turmasAluno) {
                let [materiasTurma] = await db.query(`
                    SELECT m.idMateria, m.nome 
                    FROM materia m 
                    JOIN turma_materias tm ON m.idMateria = tm.idMateria 
                    WHERE tm.idTurma = ?
                `, [turma.idTurma]);

                turmas.push({
                    idTurma: turma.idTurma,
                    nome: turma.nome,
                    idAno_letivo: turma.idAno_letivo,
                    anoLetivo: turma.anoLetivo,
                    materias: materiasTurma
                });
            }
        } else if (tipo === 'colaborador') {
            let [profRows] = await db.query('SELECT * FROM colaboradores WHERE idColaboradores = ?', [user.idReferencia]);
            if (profRows.length === 0) {
                throw new Error('Funcionário não encontrado');
            }

            perfil = profRows[0];

            let [turmasMaterias] = await db.query(`
                SELECT 
                    t.idTurma, t.nome AS nomeTurma, t.idAno_letivo, al.descricao AS anoLetivo,
                    m.idMateria, m.nome AS nomeMateria
                FROM professor_turma pt
                JOIN turmas t ON pt.idTurma = t.idTurma
                JOIN ano_letivo al ON t.idAno_letivo = al.idAno_letivo
                JOIN materia m ON pt.idMateria = m.idMateria
                WHERE pt.idColaboradores = ?
            `, [user.idReferencia]);

            let turmaMap = new Map();

            for (let row of turmasMaterias) {
                if (!turmaMap.has(row.idTurma)) {
                    turmaMap.set(row.idTurma, {
                        idTurma: row.idTurma,
                        nome: row.nomeTurma,
                        idAno_letivo: row.idAno_letivo,
                        anoLetivo: row.anoLetivo,
                        materias: []
                    });
                }

                turmaMap.get(row.idTurma).materias.push({
                    idMateria: row.idMateria,
                    nome: row.nomeMateria
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
        let connectDb = new ConnectioDb();
        let db = await connectDb.connect();
        let [rows] = await db.query(`
            SELECT u.email_pessoal, u.email_educacional, c.idColaboradores, u.nome, c.cargo, u.RA, u.cpf, u.contato, u.idUsuario
            FROM colaboradores c
            JOIN usuarios u ON c.idColaboradores = u.idReferencia AND u.tipo = 'colaborador'
            ORDER BY u.nome ASC
        `);
        return rows;
    }

    static async atualizarFuncionario(id, { nome, cargo, email_pessoal, email_educacional, RA, cpf, contato }) {
        let connectDb = new ConnectioDb();
        let db = await connectDb.connect();
        let [result] = await db.query(`
            UPDATE usuarios u
            JOIN colaboradores c ON u.idReferencia = c.idColaboradores AND u.tipo = 'colaborador'
            SET u.nome = ?, c.cargo = ?, u.ra = ?, u.email_pessoal = ?, u.email_educacional = ?, u.contato = ?, u.cpf = ?
            WHERE u.idUsuario = ?
        `, [nome, cargo, RA, email_pessoal, email_educacional, contato, cpf, id]);
        return result.affectedRows > 0;
    }

    static async verificarAssociacaoTurmaProfessor(id) {
        let connectDb = new ConnectioDb();
        let db = await connectDb.connect();
        let [rows] = await db.query(`
            SELECT * FROM professor_turma WHERE idColaboradores = ?
        `, [id]);
        return rows.length > 0;
    }

    static async excluirFuncionario(id) {
        let connectDb = new ConnectioDb();
        let db = await connectDb.connect();
        let [result] = await db.query(`
            DELETE u, c FROM usuarios u
            JOIN colaboradores c ON u.idReferencia = c.idColaboradores AND u.tipo = 'colaborador'
            WHERE u.idUsuario = ?
        `, [id]);
        return result.affectedRows > 0;
    }

    static async listarAlunos() {
        let connectDb = new ConnectioDb();
        let db = await connectDb.connect();
        let [rows] = await db.query(`
            SELECT u.email_pessoal, u.email_educacional, a.idAluno, u.nome, u.ra, u.cpf, u.contato, u.idUsuario
            FROM alunos a
            JOIN usuarios u ON a.idAluno = u.idReferencia AND u.tipo = 'aluno'
            ORDER BY u.nome ASC
        `);
        return rows;
    }

    static async atualizarAluno(id, { nome, RA, email_pessoal, cpf, contato }) {
        let connectDb = new ConnectioDb();
        let db = await connectDb.connect();
        let [result] = await db.query(`
            UPDATE usuarios u
            JOIN alunos a ON u.idReferencia = a.idAluno AND u.tipo = 'aluno'
            SET u.nome = ?, u.ra = ?, u.email_pessoal = ?, u.contato = ?, u.cpf = ?
            WHERE u.idUsuario = ?
        `, [nome, RA, email_pessoal, contato, cpf, id]);
        return result.affectedRows > 0;
    }

    static async verificarAssociacaoTurmaAluno(id) {
        let connectDb = new ConnectioDb();
        let db = await connectDb.connect();
        let [rows] = await db.query(`
            SELECT * FROM alunos_turma WHERE idAluno = ?
        `, [id]);
        return rows.length > 0;
    }

    static async excluirAluno(id) {
        let connectDb = new ConnectioDb();
        let db = await connectDb.connect();
        let [result] = await db.query(`
            DELETE u, a FROM usuarios u
            JOIN alunos a ON u.idReferencia = a.idAluno AND u.tipo = 'aluno'
            WHERE u.idUsuario = ?
        `, [id]);
        return result.affectedRows > 0;
    }
}

export default Usuarios;