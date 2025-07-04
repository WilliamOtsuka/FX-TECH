import express from 'express';
import cors from 'cors';
import db from '../../connection-db.js';

import usuariosRoutes from './route/usuariosRoutes.js';
import atividadesRoutes from './route/atividadesRoutes.js';
import turmasRoutes from './route/turmasRoutes.js';
import disciplinasRoutes from './route/disciplinasRoutes.js';
import notasRouter from './route/notasRoutes.js';
import anoLetivoRoutes from './route/anoLetivoRoutes.js';
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcrypt';
import cron from 'node-cron';

let app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));

app.use('/atividades', express.static('atividades'));
app.use('/matricula', express.static('matricula'));
app.use('/aluno', express.static('aluno'));
app.use('/feedback', express.static('feedback'));

app.use('/', usuariosRoutes);
app.use('/', atividadesRoutes);
app.use('/', turmasRoutes);
app.use('/', disciplinasRoutes);
app.use('/', notasRouter);
app.use('/', anoLetivoRoutes);

// atualiza o status da atividade para indisponivel se o prazo de entrega já tiver passado
cron.schedule('* * * * *', async () => {
    let agora = new Date();

    console.log("Verificando atividades vencidas...");

    try {
        await db.query(
            `UPDATE atividades
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
    try {
        console.log('Executando cron job: atribuição de nota 0 para não entregas...');

        let agora = new Date();
        let dataHoraAtual = agora.toISOString().replace('T', ' ').split('.')[0]; // formato YYYY-MM-DD HH:MM:SS
        // Busca todas as atividades com prazo vencido e indisponíveis
        let [atividades] = await db.query(`
          SELECT a.idAtividade, a.idTurma, a.idDisciplina
          FROM atividades a
          WHERE CONCAT(a.dataEntrega, ' ', a.hora) < ?
        AND a.status = 'indisponivel' AND a.tipo = 'atividade'
        `, [dataHoraAtual]);

        let totalInseridos = 0;

        for (let atividade of atividades) {
            // Busca todos os alunos da turma dessa atividade
            let [alunosDaTurma] = await db.query(`
                SELECT at.idAluno
                    FROM alunos_turma at
                    WHERE at.idTurma = ?
            `, [atividade.idTurma]);

            console.log(`Alunos da turma ${atividade.idTurma} para atividade ${atividade.idAtividade}:`, alunosDaTurma.length);

            // Para cada aluno, verificar se ele entregou
            for (let aluno of alunosDaTurma) {
                // Verifica se existe entrega na tabela notas para este aluno e atividade
                let [entregas] = await db.query(`
                    SELECT idNota
                    FROM notas
                    WHERE idAluno = ? AND idAtividade = ?
                `, [aluno.idAluno, atividade.idAtividade]);

                // Se não encontrou nenhuma entrega, insere nota 0 com os campos solicitados
                if (entregas.length === 0) {
                    try {
                        await db.query(`
                            INSERT INTO notas (idAluno, idAtividade, feedback, nota, entregue, correcao)
                            VALUES (?, ?, 'Não entregue', 0, 'nao', 'corrigida')
                        `, [aluno.idAluno, atividade.idAtividade]);
                        totalInseridos++;
                    } catch (error) {
                        console.error(`Erro ao inserir nota automática para aluno ${aluno.idAluno} e atividade ${atividade.idAtividade}:`, error);
                    }
                }
            }
        }

        console.log(`✅ ${totalInseridos} correções automáticas inseridas com nota 0.`);
    } catch (error) {
        console.error('Erro no cron job:', error);
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
