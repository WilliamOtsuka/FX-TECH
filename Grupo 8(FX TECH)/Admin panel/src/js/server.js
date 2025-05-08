import express from 'express';
import cors from 'cors';
import ConnectioDb from '../../connection-db.js';

import usuariosRoutes from './route/usuariosRoutes.js';
import atividadesRoutes from './route/atividadesRoutes.js';
import turmasRoutes from './route/turmasRoutes.js';
import materiasRoutes from './route/materiasRoutes.js';
import notasRouter from './route/notasRoutes.js';
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcrypt';
import cron from 'node-cron';

let app = express();
app.use(cors());
app.use(express.json());

app.use('/', usuariosRoutes);
app.use('/', atividadesRoutes);
app.use('/', turmasRoutes);
app.use('/', materiasRoutes);
app.use('/', notasRouter);



// let SECRET_KEY = 'seuSegredo';

// atualiza o status da atividade para indisponivel se o prazo de entrega já tiver passado
cron.schedule('* * * * *', async () => {
    let agora = new Date();
    let connectDb = new ConnectioDb();
    let db = await connectDb.connect();

    console.log("Verificando atividades vencidas...");

    try {
        await db.query(
            `UPDATE atividade 
             SET status = 'indisponivel' 
             WHERE status = 'disponivel' 
             AND STR_TO_DATE(CONCAT(dataEntrega, ' ', hora), '%Y-%m-%d %H:%i:%s') < ?`,
            [agora]
        );
    } catch (err) {
        console.error("Erro ao atualizar status de atividades:", err);
    }
});

// Caso a atividade não tenha sido entregue, atribui nota 0
cron.schedule('* * * * *', async () => {
    let connectDb = new ConnectioDb();
    let db = await connectDb.connect();

    try {
        console.log('Executando cron job: atribuição de nota 0 para não entregas...');

        let agora = new Date();
        let dataHoraAtual = agora.toISOString().replace('T', ' ').split('.')[0]; // formato YYYY-MM-DD HH:MM:SS
        // 1. Buscar todas as atividades com prazo vencido e indisponíveis
        let [atividades] = await db.query(`
          SELECT a.idAtividade, a.idTurma, a.idMateria
          FROM atividade a
          WHERE CONCAT(a.dataEntrega, ' ', a.hora) < ?
        AND a.status = 'indisponivel' AND a.tipo = 'atividade'
        `, [dataHoraAtual]);

        let totalInseridos = 0;

        for (let atividade of atividades) {
            // 2. Buscar todos os alunos da turma dessa atividade
            let [alunosDaTurma] = await db.query(`
        SELECT at.idAluno
        FROM alunos_turma at
        WHERE at.idTurma = ?
      `, [atividade.idTurma]);

            // 3. Para cada aluno, verificar se ele entregou
            for (let aluno of alunosDaTurma) {
                let [entregas] = await db.query(`
                    SELECT idEntrega
                    FROM atividades_entregues
                    WHERE idAluno = ? AND idAtividade = ?
                `, [aluno.idAluno, atividade.idAtividade]);

                // Se NÃO achou o aluno, atribuir nota 0
                if (entregas.length === 0) {
                    try {
                        // Verifica se já não tem correção (evita duplicatas)
                        let [correcaoExistente] = await db.query(`
                            SELECT idCorrecao
                            FROM atividades_corrigidas
                            WHERE idAluno = ? AND idAtividade = ?
                        `, [aluno.idAluno, atividade.idAtividade]);
                        
                        // Se não existe correção, insere a correção automática
                        if (correcaoExistente.length === 0) {
                            await db.query(`
                                INSERT INTO atividades_corrigidas (idAluno, idAtividade, feedback, nota, entregue)
                                VALUES (?, ?, 'Não entregue', 0, 'nao')
                            `, [aluno.idAluno, atividade.idAtividade]);

                            totalInseridos++;
                        }
                    } catch (error) {
                        console.error(`Erro ao processar correção automática para aluno ${aluno.idAluno} e atividade ${atividade.idAtividade}:`, error);
                    }
                }
            }
        }

        console.log(`✅ ${totalInseridos} correções automáticas inseridas com nota 0.`);
    } catch (error) {
        console.error('Erro no cron job:', error);
    }
});

// Rota de login
// app.post('/login', async (req, res) => {
//     try {
//         let { ra, tipo, senha } = req.body;
//         console.log(`RA: ${ra}, tipo: ${tipo}, senha: ${senha}`);

//         let connectDb = new ConnectioDb();
//         let db = await connectDb.connect();

//         let user = null;
//         let perfil = null;
//         let turmas = [];

//         // Verifica se o usuário existe
//         let [rows] = await db.query('SELECT * FROM Usuarios WHERE ra = ?', [ra]);
//         if (rows.length === 0) {
//             return res.status(401).json({ message: 'Usuário não encontrado' });
//         }

//         user = rows[0];
//         console.log("Usuário encontrado:", user);

//         // Validação de senha
//         if (senha !== user.senha) {
//             console.log("Senha incorreta!");
//             return res.status(401).json({ message: 'Senha incorreta' });
//         }
//         if (tipo === user.tipo) {
//             if (tipo === 'aluno') {
//                 let [alunoRows] = await db.query('SELECT * FROM Alunos WHERE idAluno = ?', [user.idReferencia]);
//                 if (alunoRows.length === 0)
//                     return res.status(401).json({ message: 'Aluno não encontrado' });

//                 perfil = alunoRows[0];

//                 let [turmasAluno] = await db.query(`
//                     SELECT t.idTurma, t.nome, t.idAno_letivo, al.descricao AS anoLetivo
//                     FROM alunos_turma at 
//                     JOIN turmas t ON at.idTurma = t.idTurma
//                     JOIN ano_letivo al ON t.idAno_letivo = al.idAno_letivo
//                     WHERE at.idAluno = ?
//                 `, [user.idReferencia]);

//                 for (let turma of turmasAluno) {
//                     let [materiasTurma] = await db.query(`
//                         SELECT m.idMateria, m.nome 
//                         FROM materia m 
//                         JOIN turma_materias tm ON m.idMateria = tm.idMateria 
//                         WHERE tm.idTurma = ?
//                     `, [turma.idTurma]);

//                     turmas.push({
//                         idTurma: turma.idTurma,
//                         nome: turma.nome,
//                         idAno_letivo: turma.idAno_letivo,
//                         anoLetivo: turma.anoLetivo,
//                         materias: materiasTurma
//                     });
//                 }
//             }
//             else if (tipo === 'colaborador') {
//                 let [profRows] = await db.query('SELECT * FROM colaboradores WHERE idColaboradores = ?', [user.idReferencia]);
//                 if (profRows.length === 0)
//                     return res.status(401).json({ message: 'Funcionário não encontrado' });

//                 perfil = profRows[0];

//                 let [turmasMaterias] = await db.query(`
//                     SELECT 
//                         t.idTurma, t.nome AS nomeTurma, t.idAno_letivo, al.descricao AS anoLetivo,
//                         m.idMateria, m.nome AS nomeMateria, c.cargo AS cargo, c.permition as permition
//                     FROM professor_turma pt
//                     JOIN turmas t ON pt.idTurma = t.idTurma
//                     JOIN ano_letivo al ON t.idAno_letivo = al.idAno_letivo
//                     JOIN colaboradores c ON pt.idColaboradores = c.idColaboradores
//                     JOIN materia m ON pt.idMateria = m.idMateria
//                     WHERE pt.idColaboradores = ?
//                 `, [user.idReferencia]);

//                 let turmaMap = new Map();

//                 for (let row of turmasMaterias) {
//                     if (!turmaMap.has(row.idTurma)) {
//                         turmaMap.set(row.idTurma, {
//                             idTurma: row.idTurma,
//                             nome: row.nomeTurma,
//                             idAno_letivo: row.idAno_letivo,
//                             anoLetivo: row.anoLetivo,
//                             materias: []
//                         });
//                     }

//                     turmaMap.get(row.idTurma).materias.push({
//                         idMateria: row.idMateria,
//                         nome: row.nomeMateria
//                     });
//                 }

//                 turmas = Array.from(turmaMap.values());
//             }
//             else {
//                 return res.status(401).json({ message: 'Tipo de usuário inválido' });
//             }

//             // Gera o token JWT
//             let token = jwt.sign(
//                 {
//                     id: user.idUsuario,
//                     tipo: user.tipo,
//                     ra: user.ra,
//                     idReferencia: user.idReferencia
//                 },
//                 SECRET_KEY,
//                 { expiresIn: '1h' }
//             );

//             // Retorna o usuário logado com dados completos
//             return res.json({
//                 message: 'Login bem-sucedido',
//                 token,
//                 user: {
//                     ...user,
//                     perfil,
//                     turmas
//                 }
//             });

//         }
//         else {
//             console.log("Tipo de usuário não corresponde ao tipo informado!");
//             return res.status(401).json({ message: 'Tipo de usuário não corresponde ao tipo informado' });
//         }

//     } catch (error) {
//         console.error('Erro no login:', error);
//         res.status(500).json({ error: 'Erro interno no servidor' });
//     }
// });

// // lista todas as materias
// app.get('/materias', async (req, res) => {
//     try {
//         let connectDb = new ConnectioDb();
//         let db = await connectDb.connect();
//         let [rows] = await db.query('SELECT * FROM materia');
//         res.json(rows);
//     } catch (error) {
//         console.error(error, "NO ERROR DO TRY");
//         res.status(500).json({ error: error.message });
//     }
// });

// // lista as materias
// // app.get('/materias/:id', async (req, res) => {
// app.get('/materias/turma/:id', async (req, res) => {
//     try {
//         let { id } = req.params;
//         if (isNaN(id)) {
//             return res.status(400).json({ message: 'ID inválido' });
//         }
//         console.log(`Buscando matéria com ID: ${id}`);
//         let connectDb = new ConnectioDb();
//         let db = await connectDb.connect();
//         let [rows] = await db.query('SELECT * FROM materia WHERE idMateria = ?', [id]);
//         if (rows.length > 0) {
//             res.json(rows[0]);
//         } else {
//             res.status(404).json({ message: 'Matéria não encontrada' });
//         }
//     } catch (error) {
//         console.error(`Erro ao buscar matéria: ${error.message}`);
//         res.status(500).json({ error: error.message });
//     }
// });


// lista as atividades de uma materia em uma turma
// // app.get('/materias/:id/atividades/:idT', async (req, res) => {
// app.get('/atividades/materia/:idMateria/turma/:idT', async (req, res) => {
//     try {
//         let { id, idT } = req.params;
//         console.log(`Buscando atividades da matéria ${id} para a turma ${idT}`);

//         let connectDb = new ConnectioDb();
//         let db = await connectDb.connect();
//         let [rows] = await db.query('SELECT * FROM atividade WHERE idMateria = ? AND idTurma = ?', [id, idT]);
//         res.json(rows);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// Atividades
// ------------------------------------- IRRELEVANTE ----------------------------
// lista as atividades de uma materia em uma turma 
// app.get('/materias/:idMateria/atividades/:idTurma', async (req, res) => {
// app.get('atividades/:idMateria/turma/:idT', async (req, res) => {
//     try {
//         let { idMateria, idTurma } = req.params;

//         if (isNaN(idMateria) || isNaN(idTurma)) {
//             return res.status(400).json({ message: 'IDs inválidos' });
//         }

//         console.log(`Buscando atividades da matéria ${idMateria} na turma ${idTurma}`);

//         let connectDb = new ConnectioDb();
//         let db = await connectDb.connect();

//         let [rows] = await db.query(`
//             SELECT a.*
//             FROM Atividade a
//             JOIN turma_materias tm ON a.idMateria = tm.idMateria
//             WHERE a.idMateria = ? AND tm.idTurma = ?
//         `, [idMateria, idTurma]);

//         res.json(rows);
//     } catch (error) {
//         console.error("Erro ao buscar atividades:", error);
//         res.status(500).json({ message: "Erro interno no servidor" });
//     }
// });
// ------------------------------------- IRRELEVANTE ----------------------------


// entrega a atividade
// app.post('/entregar-atividade', async (req, res) => {
// app.post('/atividades/aluno', async (req, res) => {
//     try {
//         let { idAluno, idAtividade, descricao, dataEntrega } = req.body;
//         console.log({
//             idAluno,
//             idAtividade,
//             descricao,
//             dataEntrega
//         });

//         if (!idAluno || !idAtividade || !descricao || !dataEntrega) {
//             return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
//         }

//         let connectDb = new ConnectioDb();
//         let db = await connectDb.connect();

//         let [atividade] = await db.query(
//             'SELECT status FROM Atividade WHERE idAtividade = ?',
//             [idAtividade]
//         );

//         if (atividade.length === 0 || atividade[0].status === 'indisponivel') {
//             return res.status(400).json({ message: 'Não é possível entregar uma atividade indisponível' });
//         }

//         let [existingEntrega] = await db.query(
//             'SELECT * FROM Atividades_Entregues WHERE idAluno = ? AND idAtividade = ?',
//             [idAluno, idAtividade]
//         );

//         if (existingEntrega.length > 0) {
//             let [result] = await db.query(
//                 'UPDATE Atividades_Entregues SET descricao = ?, dataEntrega = ? WHERE idAluno = ? AND idAtividade = ?',
//                 [descricao, dataEntrega, idAluno, idAtividade]
//             );

//             res.status(200).json({ message: 'Entrega atualizada com sucesso!' });
//         } else {
//             let correcao = "pendente";
//             let [result] = await db.query(
//                 'INSERT INTO Atividades_Entregues (idAluno, idAtividade, descricao, dataEntrega, correcao) VALUES (?, ?, ?, ?, ?)',
//                 [idAluno, idAtividade, descricao, dataEntrega, correcao]
//             );

//             res.status(200).json({ message: 'Atividade entregue com sucesso!', idEntrega: result.insertId });
//         }
//     } catch (error) {
//         console.error(`Erro ao registrar a entrega: ${error.message}`);
//         res.status(500).json({ error: 'Erro ao registrar a entrega da atividade.' });
//     }
// });

// Adiciona a atividade
// app.post('/adicionar-atividade', async (req, res) => {
// app.post('/atividades', async (req, res) => {
//     try {
//         let { titulo, descricao, dataEntrega, hora, peso, idMateria, idTurma, tipo } = req.body;

//         console.log({
//             titulo,
//             descricao,
//             dataEntrega,
//             hora,
//             peso,
//             idMateria,
//             idTurma,
//             tipo
//         });


//         if (!titulo || !descricao || !dataEntrega || !hora || !peso || !idMateria || !idTurma || !tipo) {
//             return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
//         }

//         let connectDb = new ConnectioDb();
//         let db = await connectDb.connect();

//         let [result] = await db.query(
//             'INSERT INTO Atividade (titulo, descricao, dataEntrega, hora, peso, idMateria, idTurma, tipo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
//             [titulo, descricao, dataEntrega, hora, peso, idMateria, idTurma, tipo]
//         );

//         if (tipo === 'avaliativa') {
//             // O status da atividade é definido como "indisponivel" por padrão
//             await db.query(
//                 'UPDATE Atividade SET status = "indisponivel" WHERE idAtividade = ?',
//                 [result.insertId]
//             );
//             // todos os alunos da turma sao inseridos na tabela atividades_entregues
//             let [alunos] = await db.query('SELECT idAluno FROM alunos_turma WHERE idTurma = ?', [idTurma]);
//             for (let aluno of alunos) {
//                 await db.query(
//                     'INSERT INTO atividades_entregues (idAluno, idAtividade, correcao) VALUES (?, ?, ?)',
//                     [aluno.idAluno, result.insertId, 'pendente']
//                 );
//             }
//         }

//         res.status(200).json({ message: 'Atividade adicionada com sucesso!', idAtividade: result.insertId });
//     } catch (error) {
//         console.error(`Erro ao adicionar atividade: ${error.message}`);
//         res.status(500).json({ error: 'Erro ao adicionar a atividade.' });
//     }
// });

// Lista uma atividade de acordo com id
// app.get('/atividades/:id', async (req, res) => {
//     try {
//         let { id } = req.params;
//         console.log(`Buscando atividade com ID: ${id}`);

//         if (isNaN(id)) {
//             return res.status(400).json({ message: 'ID inválido' });
//         }

//         let connectDb = new ConnectioDb();
//         let db = await connectDb.connect();

//         let [rows] = await db.query('SELECT * FROM Atividade WHERE idAtividade = ?', [id]);
//         if (rows.length > 0) {
//             res.json(rows[0]);
//         } else {
//             res.status(404).json({ message: 'Atividade não encontrada' });
//         }
//     } catch (error) {
//         console.error(`Erro ao buscar atividade: ${error.message}`);
//         res.status(500).json({ error: 'Erro ao buscar a atividade.' });
//     }
// });

// Atualiza a atividade
// app.put('/atividade/edit/:id', async (req, res) => {
// app.put('/atividades/:id', async (req, res) => {
//     try {
//         let { id } = req.params; // ID da atividade a ser editada
//         let { titulo, descricao, dataEntrega, hora, idMateria } = req.body; // Dados enviados no corpo da requisição

//         if (isNaN(id)) {
//             return res.status(400).json({ message: 'ID inválido' });
//         }

//         console.log(`Atualizando atividade com ID: ${id}`);

//         let connectDb = new ConnectioDb();
//         let db = await connectDb.connect();

//         let [result] = await db.query(
//             'UPDATE Atividade SET titulo = ?, descricao = ?, dataEntrega = ?, hora = ?, idMateria = ?, status = "disponivel" WHERE idAtividade = ? ',
//             [titulo, descricao, dataEntrega, hora, idMateria, id]
//         );

//         if (result.affectedRows > 0) {
//             res.status(200).json({ message: 'Atividade atualizada com sucesso!' });
//         } else {
//             res.status(404).json({ message: 'Atividade não encontrada' });
//         }
//     } catch (error) {
//         console.error(`Erro ao atualizar atividade: ${error.message}`);
//         res.status(500).json({ error: 'Erro ao atualizar a atividade.' });
//     }
// });

// Exclui a atividade
// app.delete('/atividades/:id', async (req, res) => {
//     try {
//         let { id } = req.params;
//         console.log(`Excluindo atividade com ID: ${id}`);

//         if (isNaN(id)) {
//             return res.status(400).json({ message: 'ID inválido' });
//         }

//         let connectDb = new ConnectioDb();
//         let db = await connectDb.connect();
//         let [result] = await db.query('DELETE FROM Atividade WHERE idAtividade = ?', [id]);

//         if (result.affectedRows > 0) {
//             res.status(200).json({ message: 'Atividade excluída com sucesso!' });
//             console.log(`Atividade com ID ${id} excluída com sucesso!`);
//         } else {
//             res.status(404).json({ message: 'Atividade não encontrada' });
//             console.log(`Atividade com ID ${id} não encontrada.`);
//         }
//     } catch (error) {
//         console.error(`Erro ao excluir atividade: ${error.message}`);
//         res.status(500).json({ error: 'Erro ao excluir a atividade.' });
//     }
// }
// );

// lista os alunos que ainda não entregaram a atividade
// app.get('/atividade/:id/tarefa/alunos', async (req, res) => {
// app.get('/atividades/:id/entrega/pendente/alunos', async (req, res) => {
//     try {
//         let { id } = req.params;
//         console.log(`Buscando alunos que ainda não entregaram a atividade com ID: ${id}`);

//         if (isNaN(id)) {
//             return res.status(400).json({ message: 'ID inválido' });
//         }

//         let connectDb = new ConnectioDb();
//         let db = await connectDb.connect();

//         let [rows] = await db.query(`
//             SELECT 
//                 ta.idAluno, 
//                 ta.idTurma,
//                 al.nome AS nome,
//                 u.ra AS ra
//             FROM alunos_turma ta
//             JOIN alunos al ON ta.idAluno = al.idAluno
//             JOIN atividade a ON ta.idTurma = a.idTurma
//             JOIN usuarios u ON al.idAluno = u.idReferencia AND u.tipo = 'aluno'
//             JOIN atividades_corrigidas ac ON ta.idAluno = ac.idAluno AND a.idAtividade = ac.idAtividade
//             LEFT JOIN atividades_entregues ae 
//                 ON ta.idAluno = ae.idAluno AND ae.idAtividade = a.idAtividade
//             WHERE a.idAtividade = ? AND (ae.idAluno IS NULL OR ac.entregue = 'nao');
//         `, [id]);

//         res.json(rows);
//     } catch (error) {
//         console.error(`Erro ao buscar alunos restantes: ${error.message}`);
//         res.status(500).json({ error: 'Erro ao buscar alunos restantes.' });
//     }
// });

// lista os alunos que já entregaram a atividade que ainda não foram corrigidos
// app.get('/atividade/:id/tarefa/correcao/pendente', async (req, res) => {
// app.get('/atividades/:id/correcao/pendente/alunos', async (req, res) => {
//     try {
//         let { id } = req.params;
//         console.log(`Buscando correções pendentes para a atividade com ID: ${id}`);

//         if (isNaN(id)) {
//             return res.status(400).json({ message: 'ID inválido' });
//         }

//         let connectDb = new ConnectioDb();
//         let db = await connectDb.connect();

//         let [rows] = await db.query(`
//             SELECT 
//                 ae.idAluno, 
//                 ae.idAtividade,
//                 u.ra AS ra,
//                 al.nome AS nome
//                    FROM atividades_entregues ae
//             JOIN alunos al ON ae.idAluno = al.idAluno
//             JOIN usuarios u ON al.idAluno = u.idReferencia AND u.tipo = 'aluno'
//             WHERE ae.idAtividade = ? AND ae.correcao = 'pendente';
//         `, [id]);

//         res.json(rows);
//     } catch (error) {
//         console.error(`Erro ao buscar correções pendentes: ${error.message}`);
//         res.status(500).json({ error: 'Erro ao buscar correções pendentes.' });
//     }
// });

// lista os alunos que já entregaram a atividade que já foram corrigidos
// app.get('/atividade/:id/tarefa/correcao/corrigida', async (req, res) => {
// app.get('/atividades/:id/correcao/corrigida/alunos', async (req, res) => {
//     try {
//         let { id } = req.params;
//         console.log(`Buscando atividades corrigidas para a atividade com ID: ${id}`);

//         if (isNaN(id)) {
//             return res.status(400).json({ message: 'ID inválido' });
//         }

//         let connectDb = new ConnectioDb();
//         let db = await connectDb.connect();

//         let [rows] = await db.query(`
//             SELECT 
//                 ae.idAluno, 
//                 ae.idAtividade,
//                 u.ra AS ra,
//                 al.nome AS nome
//                    FROM atividades_entregues ae
//             JOIN alunos al ON ae.idAluno = al.idAluno
//             JOIN usuarios u ON al.idAluno = u.idReferencia AND u.tipo = 'aluno'
//             WHERE ae.idAtividade = ? AND ae.correcao = 'corrigida';
//         `, [id]);

//         res.json(rows);
//     } catch (error) {
//         console.error(`Erro ao buscar atividades corrigidas: ${error.message}`);
//         res.status(500).json({ error: 'Erro ao buscar atividades corrigidas.' });
//     }
// });

// envia a correção da atividade do aluno
// app.post('/atividade/:id/tarefa/:idAluno/corrigir', async (req, res) => {
// app.post('/atividades/:id/correcao/aluno/:idAluno', async (req, res) => {
//     try {
//         let { id, idAluno } = req.params;
//         let { nota, feedback } = req.body;

//         if (isNaN(id) || isNaN(idAluno)) {
//             return res.status(400).json({ message: 'ID inválido' });
//         }

//         let connectDb = new ConnectioDb();
//         let db = await connectDb.connect();

//         // Verifica o status da atividade
//         let [atividadeRows] = await db.query(
//             'SELECT status FROM atividade WHERE idAtividade = ?',
//             [id]
//         );

//         if (!atividadeRows.length) {
//             return res.status(404).json({ message: 'Atividade não encontrada' });
//         }

//         let status = atividadeRows[0].status;

//         if (status === 'disponivel') {
//             return res.status(403).json({ message: 'Não é possível corrigir uma atividade ainda disponível.' });
//         }
//         let entregue = "sim";
//         // Inserção da correção
//         await db.query(
//             'INSERT INTO atividades_corrigidas (idAluno, idAtividade, feedback, nota, entregue) VALUES (?, ?, ?, ?, ?)',
//             [idAluno, id, feedback, nota, entregue]
//         );

//         let [result] = await db.query(
//             'UPDATE atividades_entregues SET correcao = "corrigida" WHERE idAluno = ? AND idAtividade = ?',
//             [idAluno, id]
//         );

//         if (result.affectedRows > 0) {
//             res.status(200).json({ message: 'Correção atualizada com sucesso!' });
//         } else {
//             res.status(404).json({ message: 'Correção não encontrada' });
//         }
//     } catch (error) {
//         console.error(`Erro ao corrigir atividade: ${error.message}`);
//         res.status(500).json({ error: 'Erro ao corrigir a atividade.' });
//     }
// });

// Atualiza a correção da atividade para o aluno
// app.put('/atividade/:id/tarefa/:idAluno/corrigir', async (req, res) => {
// app.put('/atividades/:id/correcao/aluno/:idAluno', async (req, res) => {
//     try {
//         let { id, idAluno } = req.params;
//         let { nota, feedback } = req.body;
//         console.log(`Atualizando correção da atividade ${id} para o aluno ${idAluno}`);

//         if (isNaN(id) || isNaN(idAluno)) {
//             return res.status(400).json({ message: 'ID inválido' });
//         }

//         let connectDb = new ConnectioDb();
//         let db = await connectDb.connect();

//         let [result] = await db.query(
//             'UPDATE atividades_corrigidas SET feedback = ?, nota = ? WHERE idAluno = ? AND idAtividade = ?',
//             [feedback, nota, idAluno, id]
//         );

//         if (result.affectedRows > 0) {
//             res.status(200).json({ message: 'Correção atualizada com sucesso!' });
//         } else {
//             res.status(404).json({ message: 'Correção não encontrada' });
//         }
//     } catch (error) {
//         console.error(`Erro ao atualizar correção: ${error.message}`);
//         res.status(500).json({ error: 'Erro ao atualizar a correção.' });
//     }
// });

// Exclui a correção da atividade para o aluno
// app.delete('/atividade/:id/tarefa/:idAluno/corrigir', async (req, res) => {
// app.delete('/atividades/:id/correcao/aluno/:idAluno', async (req, res) => {
//     try {
//         let { id, idAluno } = req.params;
//         console.log(`Excluindo correção da atividade ${id} para o aluno ${idAluno}`);

//         if (isNaN(id) || isNaN(idAluno)) {
//             return res.status(400).json({ message: 'ID inválido' });
//         }

//         let connectDb = new ConnectioDb();
//         let db = await connectDb.connect();

//         // Dividindo as queries para evitar erros de sintaxe
//         await db.query(
//             'DELETE FROM atividades_corrigidas WHERE idAluno = ? AND idAtividade = ?',
//             [idAluno, id]
//         );

//         let [result] = await db.query(
//             'UPDATE atividades_entregues SET correcao = "pendente" WHERE idAluno = ? AND idAtividade = ?',
//             [idAluno, id]
//         );

//         if (result.affectedRows > 0) {
//             res.status(200).json({ message: 'Correção excluída com sucesso!' });
//         } else {
//             res.status(404).json({ message: 'Correção não encontrada' });
//         }
//     } catch (error) {
//         console.error(`Erro ao excluir correção: ${error.message}`);
//         res.status(500).json({ error: 'Erro ao excluir a correção.' });
//     }
// });

// Busca a feedback da atividade para o aluno
// app.get('/atividade/:id/tarefa/:idAluno/resposta', async (req, res) => {
// app.get('/atividades/:id/feedback/aluno/:idAluno', async (req, res) => {
//     try {
//         let { id, idAluno } = req.params;
//         console.log(`Buscando resposta da atividade ${id} para o aluno ${idAluno}`);

//         if (isNaN(id) || isNaN(idAluno)) {
//             return res.status(400).json({ message: 'ID inválido' });
//         }

//         let connectDb = new ConnectioDb();
//         let db = await connectDb.connect();

//         let [rows] = await db.query(`
//             SELECT 
//                 ac.idAluno,
//                 ac.idAtividade,
//                 ac.feedback,
//                 ac.nota
//             FROM atividades_corrigidas ac
//             WHERE ac.idAtividade = ? AND ac.idAluno = ?;
//         `, [id, idAluno]);

//         if (rows.length > 0) {
//             res.json(rows[0]);
//         } else {
//             res.status(404).json({ message: 'Resposta não encontrada' });
//         }
//     } catch (error) {
//         console.error(`Erro ao buscar resposta: ${error.message}`);
//         res.status(500).json({ error: 'Erro ao buscar resposta.' });
//     }
// });

// Busca a atividade do aluno
// app.get('/atividade/:id/tarefa/:idAluno', async (req, res) => {
// app.get('/atividades/:id/resposta/aluno/:idAluno', async (req, res) => {
//     try {
//         let { id, idAluno } = req.params;
//         console.log(`Buscando atividade ${id} do aluno ${idAluno}`);

//         if (isNaN(id) || isNaN(idAluno)) {
//             return res.status(400).json({ message: 'ID inválido' });
//         }

//         let connectDb = new ConnectioDb();
//         let db = await connectDb.connect();

//         let [rows] = await db.query(`
//             SELECT 
//                 ae.idAluno, 
//                 ae.idAtividade,
//                 ae.descricao AS descricaoAluno,
//                 ae.correcao AS correcao,
//                 ae.descricao,
//                 u.ra AS ra,
//                 al.nome AS nome,
//                 at.titulo,
//                 at.descricao AS descricaoAtividade,
//                 at.peso
//             FROM atividades_entregues ae
//             JOIN alunos al ON ae.idAluno = al.idAluno
//             JOIN atividade at ON ae.idAtividade = at.idAtividade
//             JOIN usuarios u ON al.idAluno = u.idReferencia AND u.tipo = 'aluno'
//             WHERE ae.idAtividade = ? AND ae.idAluno = ?;
//         `, [id, idAluno]);

//         if (rows.length > 0) {
//             res.json(rows[0]);
//         } else {
//             res.status(404).json({ message: 'Correção não encontrada' });
//         }
//     } catch (error) {
//         console.error(`Erro ao buscar correção: ${error.message}`);
//         res.status(500).json({ error: 'Erro ao buscar correção.' });
//     }
// });

// Busca os períodos letivos de uma turma
// app.get('/turmas/:idTurma/periodos', async (req, res) => {
//     let { idTurma } = req.params;

//     try {
//         let connectDb = new ConnectioDb();
//         let db = await connectDb.connect();

//         // Busca o ano letivo da turma
//         let [turmaRows] = await db.query(
//             'SELECT idAno_letivo FROM turmas WHERE idTurma = ?',
//             [idTurma]
//         );

//         if (turmaRows.length === 0) {
//             return res.status(404).json({ message: 'Turma não encontrada' });
//         }

//         let idAnoLetivo = turmaRows[0].idAno_letivo;

//         // Busca os períodos letivos desse ano
//         let [periodos] = await db.query(
//             'SELECT * FROM periodo_letivo WHERE idAno_letivo = ? ORDER BY data_inicio',
//             [idAnoLetivo]
//         );

//         res.json(periodos);
//     } catch (error) {
//         console.error('Erro ao buscar períodos letivos:', error);
//         res.status(500).json({ message: 'Erro interno no servidor' });
//     }
// });


// TURMA
// Busca os participantes de uma matéria em uma turma
// app.get('/materias/:idMateria/participantes/:idTurma', async (req, res) => {
// app.get('/turmas/:idT/materia/:idMateria/participantes', async (req, res) => {
//     try {
//         let { idMateria, idTurma } = req.params;

//         if (isNaN(idMateria) || isNaN(idTurma)) {
//             return res.status(400).json({ message: 'IDs inválidos' });
//         }

//         console.log(`Buscando participantes da matéria ${idMateria} na turma ${idTurma}`);

//         let connectDb = new ConnectioDb();
//         let db = await connectDb.connect();

//         // Busca os alunos da turma
//         let [alunos] = await db.query(`
//             SELECT 
//                 a.idAluno AS id, 
//                 a.nome, 
//                 u.email_pessoal,
//                 u.ra AS ra, 
//                 'aluno' AS tipo
//             FROM alunos_turma at
//             JOIN alunos a ON at.idAluno = a.idAluno
//             JOIN usuarios u ON a.idAluno = u.idReferencia AND u.tipo = 'aluno'
//             WHERE at.idTurma = ?
//             ORDER BY a.nome ASC;
//         `, [idTurma]);

//         // Busca os professores da matéria na turma
//         let [professores] = await db.query(`
//             SELECT 
//                 c.idColaboradores AS id, 
//                 c.nome, 
//                 u.email_pessoal, 
//                 u.ra AS ra,
//                 'colaborador' AS tipo
//             FROM professor_turma pt
//             JOIN colaboradores c ON pt.idColaboradores = c.idColaboradores
//             JOIN usuarios u ON c.idColaboradores = u.idReferencia AND u.tipo = 'colaborador'
//             WHERE pt.idTurma = ? AND pt.idMateria = ?
//             ORDER BY c.nome ASC;
//         `, [idTurma, idMateria]);

//         let participantes = [...alunos, ...professores];

//         res.json(participantes);
//     } catch (error) {
//         console.error("Erro ao buscar participantes:", error);
//         res.status(500).json({ message: "Erro interno no servidor" });
//     }
// });

// Busca as notas de um aluno em uma matéria e turma específicas
// // app.get('/notas-aluno/:idAluno/:idMateria/:idTurma', async (req, res) => {
// app.get('/notas/aluno/:idAluno/materia/:idMateria/turma/:idTurma', async (req, res) => {
//     let { idAluno, idMateria, idTurma } = req.params;

//     try {
//         let connectDb = new ConnectioDb(); // Inicializa a conexão com o banco de dados
//         let db = await connectDb.connect(); // Conecta ao banco de dados

//         let [notas] = await db.query(`
//             SELECT 
//                 ac.idAluno,
//                 a.titulo AS nomeAtividade,
//                 ac.nota,
//                 a.peso,
//                 pl.nome AS bimestre,
//                 ae.dataEntrega
//             FROM atividades_corrigidas ac
//             JOIN atividade a ON ac.idAtividade = a.idAtividade
//             JOIN turma_materias tm ON a.idMateria = tm.idMateria AND tm.idTurma = ?
//             JOIN turmas t ON t.idTurma = tm.idTurma
//             JOIN periodo_letivo pl 
//                 ON pl.idAno_letivo = t.idAno_letivo 
//                 AND a.dataEntrega BETWEEN pl.data_inicio AND pl.data_fim
//             LEFT JOIN atividades_entregues ae 
//                 ON ae.idAtividade = ac.idAtividade 
//                 AND ae.idAluno = ac.idAluno
//             WHERE a.idMateria = ? AND ac.idAluno = ?
//             ORDER BY a.dataEntrega ASC;
//         `, [idTurma, idMateria, idAluno]);

//         res.json(notas);
//     } catch (error) {
//         console.error("Erro ao buscar notas do aluno:", error);
//         res.status(500).json({ error: 'Erro ao buscar notas do aluno' });
//     }
// });

// Busca as notas de um aluno em turma específicas
// app.get('/notas-aluno/:idAluno/:idTurma', async (req, res) => {
// app.get('/notas/aluno/:idAluno/turma/:idTurma', async (req, res) => {

//     let { idAluno, idTurma } = req.params;

//     try {
//         let connectDb = new ConnectioDb();
//         let db = await connectDb.connect();

//         let [notas] = await db.query(`
//             SELECT 
//                 tm.idMateria,
//                 m.nome AS nomeMateria,
//                 pl.nome AS bimestre,
//                 COALESCE(SUM(ac.nota * (a.peso / 100)), 0) AS nota
//             FROM turma_materias tm
//             JOIN materia m ON m.idMateria = tm.idMateria
//             JOIN turmas t ON t.idTurma = tm.idTurma
//             LEFT JOIN atividade a ON a.idMateria = tm.idMateria
//             LEFT JOIN periodo_letivo pl 
//                 ON pl.idAno_letivo = t.idAno_letivo 
//                 AND a.dataEntrega BETWEEN pl.data_inicio AND pl.data_fim
//             LEFT JOIN atividades_corrigidas ac 
//                 ON ac.idAtividade = a.idAtividade AND ac.idAluno = ?
//             WHERE tm.idTurma = ?
//             GROUP BY tm.idMateria, m.nome, pl.nome
//             ORDER BY nomeMateria, bimestre;
//         `, [idAluno, idTurma]);

//         res.json(notas);
//     } catch (error) {
//         console.error("Erro ao buscar notas do aluno:", error);
//         res.status(500).json({ error: 'Erro ao buscar notas do aluno' });
//     }
// });

//TURMA
// Busca os participantes de uma matéria em uma turma específicas
// app.get('/materias/:idMateria/participantes/:idTurma', async (req, res) => {
// app.get('/turmas/:idT/materia/:idMateria/alunos', async (req, res) => {
//     let { idMateria, idTurma } = req.params;

//     try {
//         let connectDb = new ConnectioDb(); // Inicializa a conexão com o banco de dados
//         let db = await connectDb.connect(); // Conecta ao banco de dados
//         let [participantes] = await db.query(`
//             SELECT p.idAluno, p.nome, p.tipo, p.email_pessoal, m.nome AS nomeMateria
//             FROM alunos_turma at
//             JOIN alunos p ON at.idAluno = p.idAluno
//             JOIN materia m ON at.idMateria = m.idMateria
//             WHERE at.idTurma = ? AND at.idMateria = ?
//         `, [idTurma, idMateria]);

//         res.json(participantes);
//     } catch (error) {
//         console.error("Erro ao buscar participantes:", error);
//         res.status(500).json({ error: 'Erro ao buscar participantes' });
//     }
// });

// lista os funcionarios
// app.get('/funcionarios', async (req, res) => {
// app.get('/usuario/funcionarios', async (req, res) => {
//     try {
//         let connectDb = new ConnectioDb();
//         let db = await connectDb.connect();
//         let [rows] = await db.query(`
//             SELECT u.email_pessoal, c.idColaboradores, c.nome, c.cargo, u.RA, u.cpf, u.contato, u.idUsuario
//             FROM colaboradores c
//             JOIN usuarios u ON c.idColaboradores = u.idReferencia AND u.tipo = 'colaborador'
//             ORDER BY c.nome ASC`);
//         res.json(rows);
//     } catch (error) {
//         console.error(error, "NO ERROR DO TRY");
//         res.status(500).json({ error: error.message });
//     }
// }
// );

// Editar funcionario
// app.put('/funcionarios/:id', async (req, res) => {
// app.put('/usuario/funcionario/:id', async (req, res) => {
//     try {
//         let { id } = req.params;
//         let { nome, cargo, email_pessoal, RA, cpf, contato } = req.body;
//         console.log({
//             id,
//             nome,
//             cargo,
//             email_pessoal,
//             RA,
//             cpf,
//             contato
//         });

//         console.log(`Atualizando funcionário com ID: ${id}`);

//         if (!nome || !cargo || !email_pessoal || !RA || !cpf || !contato) {
//             return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
//         }

//         let connectDb = new ConnectioDb();
//         let db = await connectDb.connect();

//         let [result] = await db.query(
//             `UPDATE usuarios u
//              JOIN colaboradores c ON u.idReferencia = c.idColaboradores AND u.tipo = 'colaborador'
//              SET c.nome = ?, c.cargo = ?, u.ra = ?, u.email_pessoal = ?, u.contato = ?, u.cpf = ?
//              WHERE u.idUsuario = ?`,
//             [nome, cargo, RA, email_pessoal, contato, cpf, id]
//         );

//         if (result.affectedRows > 0) {
//             res.status(200).json({ message: 'Funcionário atualizado com sucesso!' });
//         } else {
//             console.log(`Funcionário com ID ${id} não encontrado.`);
//             res.status(404).json({ message: 'Funcionário não encontrado' });
//         }
//     } catch (error) {
//         console.error(`Erro ao atualizar funcionário: ${error.message}`);
//         res.status(500).json({ error: 'Erro ao atualizar o funcionário.' });
//     }
// });

// Deletar funcionario
// app.delete('/funcionarios/:id', async (req, res) => {
//     try {
//         let { id } = req.params;
//         console.log(`Excluindo funcionário com ID: ${id}`);

//         if (isNaN(id)) {
//             return res.status(400).json({ message: 'ID inválido' });
//         }

//         let connectDb = new ConnectioDb();
//         let db = await connectDb.connect();

//         // Verifica se o colaborador está associado a alguma turma como professor
//         let [associacoes] = await db.query(
//             `SELECT * FROM professor_turma WHERE idColaboradores = ?`,
//             [id]
//         );

//         if (associacoes.length > 0) {
//             return res.status(400).json({ message: 'Não é possível excluir o funcionário, pois ele está associado a uma ou mais turmas.' });
//         }

//         let [result] = await db.query(
//             `DELETE u, c FROM usuarios u
//              JOIN colaboradores c ON u.idReferencia = c.idColaboradores AND u.tipo = 'colaborador'
//              WHERE u.idUsuario = ?`,
//             [id]
//         );

//         if (result.affectedRows > 0) {
//             res.status(200).json({ message: 'Funcionário excluído com sucesso!' });
//             console.log(`Funcionário com ID ${id} excluído com sucesso!`);
//         } else {
//             console.log(`Funcionário com ID ${id} não encontrado.`);
//             res.status(404).json({ message: 'Funcionário não encontrado' });
//         }
//     } catch (error) {
//         console.error(`Erro ao excluir funcionário: ${error.message}`);
//         res.status(500).json({ error: 'Erro ao excluir o funcionário.' });
//     }
// });


app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
