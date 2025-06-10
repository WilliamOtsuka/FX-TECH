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
                SELECT t.idTurma, s.nome, t.codigo, t.turno, t.idAno_letivo, al.ano AS anoLetivo
                FROM alunos_turma at
                JOIN turmas t ON at.idTurma = t.idTurma
                JOIN serie s ON t.idSerie = s.idSerie
                JOIN ano_letivo al ON t.idAno_letivo = al.idAno_letivo
                WHERE at.idAluno = ?
            `, [user.idReferencia]);

            for (let turma of turmasAluno) {
                let [disciplinasTurma] = await db.query(`
                    SELECT d.idDisciplina, d.nome 
                    FROM disciplinas d 
                    JOIN turma_disciplinas td ON d.idDisciplina = td.idDisciplina 
                    WHERE td.idTurma = ?
                    ORDER BY d.nome ASC
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
                SELECT t.idTurma, s.nome AS nomeTurma, t.codigo, t.turno, t.idAno_letivo, al.ano AS anoLetivo, d.idDisciplina, d.nome AS nomeDisciplina, s.ensino,
                    
                -- Nível de ensino
                    CASE 
                        WHEN LOWER(s.ensino) LIKE '%médio%' THEN 1
                        WHEN LOWER(s.ensino) LIKE '%fundamental%' THEN 2
                        ELSE 3
                    END AS nivelEnsino,

                    -- Ordenação personalizada da série
                    CASE 
                        WHEN LOWER(s.ensino) LIKE '%medio%' THEN 
                            4 - CAST(REGEXP_SUBSTR(s.nome, '[0-9]+') AS UNSIGNED)
                        WHEN LOWER(s.ensino) LIKE '%fundamental%' THEN 
                            10 - CAST(REGEXP_SUBSTR(s.nome, '[0-9]+') AS UNSIGNED)
                        ELSE 99
                    END AS ordenacaoSerie

                FROM professor_turma pt
                JOIN turmas t ON pt.idTurma = t.idTurma
                JOIN serie s ON t.idSerie = s.idSerie
                JOIN ano_letivo al ON t.idAno_letivo = al.idAno_letivo
                JOIN disciplinas d ON pt.idDisciplina = d.idDisciplina
                WHERE pt.idColaboradores = ?
                ORDER BY 
                    al.ano DESC,
                    nivelEnsino ASC,
                    ordenacaoSerie ASC,
                    d.nome ASC;
            `, [user.idReferencia]);

            let turmaMap = new Map();

            for (let row of turmasDisciplinas) {
                if (!turmaMap.has(row.idTurma)) {
                    turmaMap.set(row.idTurma, {
                        idTurma: row.idTurma,
                        nome: row.nomeTurma,
                        codigo: row.codigo,
                        turno: row.turno,
                        idAno_letivo: row.idAno_letivo,
                        anoLetivo: row.anoLetivo,
                        serie: row.serie,
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

    static async cadastrarAluno({ nome, email_pessoal, contato, cpf, rg, data_nascimento, pai, mae, endereco, numero, tipo, foto }) {
        // Verifica se o aluno já existe pelo CPF
        let [existing] = await db.query(
            'SELECT * FROM usuarios WHERE (cpf = ?) AND tipo = "aluno"',
            [cpf]
        );
        if (existing.length > 0) {
            throw new Error('Aluno já cadastrado');
        }

        // Geração do RA
        let anoAtual = new Date().getFullYear().toString().slice(-2);
        let prefixo = "20" + anoAtual;
        let [raRow] = await db.query(
            'SELECT MAX(ra) as maiorRA FROM usuarios WHERE tipo = "aluno" AND ra LIKE ?',
            [`${prefixo}%`]
        );
        let maiorRA = raRow[0]?.maiorRA || `${prefixo}0000`;
        let novoRA = (parseInt(maiorRA) + 1).toString();

        let [alunoResult] = await db.query(
            `INSERT INTO alunos (pai, mae) VALUES (?, ?)`,
            [pai, mae]
        );

        if (alunoResult.affectedRows === 0) {
            throw new Error('Erro ao cadastrar aluno');
        }
        let idAluno = alunoResult.insertId;

        let [usuarioResult] = await db.query(
            `INSERT INTO usuarios (
                nome, ra, rg, cpf, email_pessoal, contato, tipo, cep, numero, data_nascimento, idReferencia, foto
            ) VALUES (
                ?, ?, ?, ?, ?, ?, 'aluno', ?, ?, ?, ?, ?
            )`,
            [
                nome,
                novoRA,
                rg,
                cpf,
                email_pessoal,
                contato,
                endereco,
                numero,
                data_nascimento,
                idAluno,
                foto
            ]
        );
        if (usuarioResult.affectedRows === 0) {
            throw new Error('Erro ao cadastrar usuário');
        }

        let dataInscricao = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let dataPrazo = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');

        let [matriculaResult] = await db.query(
            `INSERT INTO matricula (idAluno, status, tipo, data_inscricao, data_prazo) VALUES (?, 'pendente', ?, ?, ?)`,
            [idAluno, tipo, dataInscricao, dataPrazo]
        );

        if (matriculaResult.affectedRows === 0) {
            throw new Error('Erro ao cadastrar matrícula');
        }

        return {
            idAluno,
            nome,
            ra: novoRA,
            email_pessoal,
            contato,
            cpf,
            rg,
            data_nascimento,
            pai,
            mae,
            endereco,
            numero,
            tipo,
            foto
        };
    }

    static async cadastrarFuncionario({ nome, senha, cargo, email_pessoal, email_educacional, contato, cpf, RA }) {
        // Verifica se o RA já existe
        let [existing] = await db.query('SELECT * FROM usuarios WHERE ra = ? AND tipo = "colaborador"', [RA]);
        if (existing.length > 0) {
            throw new Error('RA já cadastrado');
        }

        let permition = 1;
        if (cargo && cargo.toLowerCase() === 'coordenador') {
            permition = 2;
        }

        // Cria o colaborador
        let [colabResult] = await db.query(`
            INSERT INTO colaboradores (cargo, permition)
            VALUES (?, ?)
        `, [cargo, permition]);

        if (colabResult.affectedRows === 0) {
            throw new Error('Erro ao cadastrar colaborador');
        }

        let idColaboradores = colabResult.insertId;

        // Cria o usuário com idReferencia apontando para o colaborador criado
        let [result] = await db.query(`
            INSERT INTO usuarios (nome, senha, email_pessoal, email_educacional, contato, cpf, ra, tipo, idReferencia)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'colaborador', ?)
        `, [nome, senha, email_pessoal, email_educacional, contato, cpf, RA, idColaboradores]);

        if (result.affectedRows === 0) {
            throw new Error('Erro ao cadastrar usuário');
        }


        return { nome, cargo, email_pessoal, email_educacional, contato, cpf, RA };
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

    static async matricularAluno({ senha, historico, anoLetivo, turma, idMatricula, email_educacional }) {

        let [result] = await db.query(
            'SELECT idAluno FROM matricula WHERE idMatricula = ?',
            [idMatricula]
        );
        if (!result.length) {
            return res.status(404).json({ message: 'Matrícula não encontrada' });
        }
        let idAluno = result[0].idAluno;

        if (senha) {
            await db.query(
                'UPDATE usuarios SET senha = ?, email_educacional = ? WHERE idReferencia = ? AND tipo = "aluno"',
                [senha, email_educacional, idAluno]
            );
        }

        if (historico) {
            await db.query(
                'UPDATE alunos SET historico_escolar = ? WHERE idAluno = ?',
                [historico, idAluno]
            );
        }

        let [anoLetivoRow] = await db.query(
            'SELECT data_fim FROM ano_letivo WHERE idAno_letivo = ?',
            [anoLetivo]
        );
        if (anoLetivoRow.length === 0) {
            throw new Error('Ano letivo não encontrado');
        }
        let dataFimAnoLetivo = new Date(anoLetivoRow[0].data_fim);

        let dataFinal = new Date(dataFimAnoLetivo);
        dataFinal.setMonth(dataFinal.getMonth() + 1);
        dataFinal.setDate(dataFinal.getDate() + 15);
        dataFinal = dataFinal.toISOString().slice(0, 19).replace('T', ' ');

        let dataMatricula = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // Atualiza matrícula para "ativa" e define a turma
        await db.query(
            'UPDATE matricula SET status = "ativa", data_validade = ?, data_matricula = ?, idTurma = ?, idAno_letivo = ? WHERE idMatricula = ?',
            [dataFinal, dataMatricula, turma, anoLetivo, idMatricula]
        );

        return { success: true, idMatricula, turma };
    }

    static async buscarMaiorRAFuncionario(ano) {
        let prefixo = "10" + ano;
        let [rows] = await db.query(`
            SELECT MAX(ra) as maiorRA 
            FROM usuarios 
            WHERE tipo = 'colaborador' AND ra LIKE ?
        `, [`${prefixo}%`]);
        return rows[0]?.maiorRA || null;
    }

    static async listarAlunos() {
        let [rows] = await db.query(`
            SELECT u.email_pessoal, u.email_educacional, a.idAluno, u.nome, u.ra, u.cpf, u.contato, u.cep, a.pai, a.mae, u.data_nascimento, u.idUsuario
            FROM alunos a
            JOIN usuarios u ON a.idAluno = u.idReferencia AND u.tipo = 'aluno'
            ORDER BY u.nome ASC
        `);
        return rows;
    }

    static async listarMatriculasPendentes() {
        let [rows] = await db.query(`
            SELECT 
            m.idMatricula,
            m.idAluno,
            u.idUsuario,
            u.nome AS nome,
            u.ra,
            u.rg,
            u.cpf,
            u.email_pessoal,
            u.email_educacional,
            u.contato,
            m.status,
            m.tipo,
            m.data_inscricao,
            m.data_prazo
            FROM matricula m
            JOIN alunos a ON m.idAluno = a.idAluno
            JOIN usuarios u ON u.idReferencia = a.idAluno AND u.tipo = 'aluno'
            WHERE m.status = 'pendente'
            ORDER BY u.nome ASC
        `);
        return rows && rows.length > 0 ? rows : [];
    }

    static async atualizarAluno(id, { nome, ra, email_pessoal, email_educacional, contato, cpf, data_nascimento, pai, mae, endereco }) {
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
                u.cep = ?, 
                u.data_nascimento = ?, 
                a.pai = ?, 
                a.mae = ?
            WHERE u.idUsuario = ?
        `, [nome, ra, email_pessoal, email_educacional, contato, cpf, endereco, data_nascimento, pai, mae, id]);
        return result.affectedRows > 0;
    }

    static async verificarAssociacaoTurmaAluno(id) {
        let [rows] = await db.query(`
            SELECT * FROM matricula WHERE idAluno = ?
        `, [id]);
        return rows.length > 0;
    }

    static async excluirAluno(id) {
        let [result] = await db.query(`
            DELETE u, a, m FROM usuarios u
            JOIN alunos a ON u.idReferencia = a.idAluno AND u.tipo = 'aluno'
            JOIN matricula m ON a.idAluno = m.idAluno
            WHERE u.idUsuario = ?
        `, [id]);
        return result.affectedRows > 0;
    }
}

export default Usuarios;