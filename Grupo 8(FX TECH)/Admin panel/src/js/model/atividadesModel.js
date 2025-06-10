import db from '../../../connection-db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Atividades {
    //     static async enviarAtividade(idAluno, idAtividade, descricao, dataEntrega) {
    //         let [atividade] = await db.query(
    //             'SELECT status FROM atividades WHERE idAtividade = ?',
    //             [idAtividade]
    //         );

    //         if (atividade.length === 0 || atividade[0].status === 'indisponivel') {
    //             throw new Error('Não é possível entregar uma atividade indisponível');
    //         }

    //         let [existingEntrega] = await db.query(
    //             'SELECT * FROM notas WHERE idAluno = ? AND idAtividade = ?',
    //             [idAluno, idAtividade]
    //         );

    //         if (existingEntrega.length > 0) {
    //             let [result] = await db.query(
    //                 'UPDATE notas SET descricao = ?, dataEntrega = ? WHERE idAluno = ? AND idAtividade = ?',
    //                 [descricao, dataEntrega, idAluno, idAtividade]
    //             );
    //             return { message: 'Entrega atualizada com sucesso!', updated: result.affectedRows > 0 };
    //         } else {
    //             let correcao = 'pendente';
    //             let [result] = await db.query(
    //                 'INSERT INTO notas (idAluno, idAtividade, descricao, dataEntrega, correcao) VALUES (?, ?, ?, ?, ?)',
    //                 [idAluno, idAtividade, descricao, dataEntrega, correcao]
    //             );
    //             return { message: 'Atividade entregue com sucesso!', idNota: result.insertId };
    //         }
    //     }

    static async enviarAtividade(idAluno, idAtividade, descricao, dataEntrega, nomeArquivo) {
        let [atividade] = await db.query(
            'SELECT status FROM atividades WHERE idAtividade = ?',
            [idAtividade]
        );

        if (atividade.length === 0 || atividade[0].status === 'indisponivel') {
            throw new Error('Não é possível entregar uma atividade indisponível');
        }

        let [existingEntrega] = await db.query(
            'SELECT * FROM notas WHERE idAluno = ? AND idAtividade = ?',
            [idAluno, idAtividade]
        );

        if (existingEntrega.length > 0) {
            let arquivoAntigo = existingEntrega[0].arquivo;
            if (arquivoAntigo) {
                let caminhoArquivo = path.join('atividades', arquivoAntigo);
                if (fs.existsSync(caminhoArquivo)) {
                    fs.unlinkSync(caminhoArquivo);
                }
            }

            let [result] = await db.query(
                'UPDATE notas SET descricao = ?, dataEntrega = ?, arquivo = ? WHERE idAluno = ? AND idAtividade = ?',
                [descricao, dataEntrega, nomeArquivo || arquivoAntigo, idAluno, idAtividade]
            );

            return { message: 'Entrega atualizada com sucesso!', updated: result.affectedRows > 0 };
        } else {
            let correcao = 'pendente';
            let nota = 0;
            let feedback = 'nao foram feitas considerações';
            let  entregue = 'sim';
            let [result] = await db.query(
                'INSERT INTO notas (idAluno, idAtividade, descricao, dataEntrega, correcao, arquivo, nota, feedback, entregue) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [idAluno, idAtividade, descricao, dataEntrega, correcao, nomeArquivo, nota, feedback, entregue]
            );
            return { message: 'Atividade entregue com sucesso!', idNota: result.insertId };
        }
    }

    static async buscarAtividades(idDisciplina, idTurma) {
        let [rows] = await db.query(
            'SELECT * FROM atividades WHERE idDisciplina = ? AND idTurma = ? ORDER BY dataEntrega, hora',
            [idDisciplina, idTurma]
        );
        return rows;
    }

    static async buscarAtividadePorId(idAtividade) {
        let [rows] = await db.query(
            `SELECT 
            d.nome,
            a.titulo,
            a.descricao,
            a.dataEntrega,
            a.hora,
            a.peso,
            a.tipo,
            a.status
            FROM atividades a
            JOIN disciplinas d ON a.idDisciplina = d.idDisciplina
            WHERE a.idAtividade = ?`,
            [idAtividade]
        );
        return rows[0];
    }

    static async excluirAtividade(idAtividade) {
        // Remove arquivos enviados relacionados à atividade excluída antes de deletar os registros
        let [entregas] = await db.query(
            'SELECT arquivo FROM notas WHERE idAtividade = ? AND arquivo IS NOT NULL',
            [idAtividade]
        );
        for (let entrega of entregas) {
            let atividadesDir = path.resolve(__dirname, '../../../atividades');
            let caminhoArquivo = path.join(atividadesDir, entrega.arquivo);
            if (fs.existsSync(caminhoArquivo)) {
                fs.unlinkSync(caminhoArquivo);
            }
        }

        // Remove arquivos de feedback relacionados à atividade excluída
        let [notas] = await db.query(
            'SELECT arquivo_feedback FROM notas WHERE idAtividade = ? AND arquivo_feedback IS NOT NULL',
            [idAtividade]
        );
        for (let nota of notas) {
            let feedbackDir = path.resolve(__dirname, '../../../feedback');
            let caminhoArquivo = path.join(feedbackDir, nota.arquivo_feedback);
            if (fs.existsSync(caminhoArquivo)) {
                fs.unlinkSync(caminhoArquivo);
            }
        }

        await db.query(
            'DELETE FROM notas WHERE idAtividade = ?',
            [idAtividade]
        );

        let [result] = await db.query(
            'DELETE FROM atividades WHERE idAtividade = ?',
            [idAtividade]
        );

        return result.affectedRows > 0;
    }

    static async atualizarAtividade(idAtividade, { titulo, descricao, dataEntrega, hora, peso }) {
        let [result] = await db.query(
            'UPDATE atividades SET titulo = ?, descricao = ?, dataEntrega = ?, hora = ?, status = "disponivel", peso = ? WHERE idAtividade = ?',
            [titulo, descricao, dataEntrega, hora, peso, idAtividade]
        );

        return result.affectedRows > 0;
    }

    static async buscarNaoEntregues(idAtividade) {
        let [rows] = await db.query(`
            SELECT 
            at.idAluno, 
            at.idTurma,
            u.nome AS nome,
            u.ra AS ra
            FROM alunos_turma at
            JOIN alunos al ON at.idAluno = al.idAluno
            JOIN usuarios u ON al.idAluno = u.idReferencia AND u.tipo = 'aluno'
            WHERE at.idTurma = (
            SELECT idTurma FROM atividades WHERE idAtividade = ?
            )
            AND (
            NOT EXISTS (
                SELECT 1 
                FROM notas n 
                WHERE n.idAluno = at.idAluno AND n.idAtividade = ?
            )
            OR EXISTS (
                SELECT 1
                FROM notas n2
                WHERE n2.idAluno = at.idAluno AND n2.idAtividade = ? AND n2.entregue = 'nao'
            )
            )
            ORDER BY u.nome;
        `, [idAtividade, idAtividade, idAtividade]);
        return rows;
    }

    static async buscarNaoCorrigidas(idAtividade) {
        let [rows] = await db.query(` 
            SELECT 
                n.idAluno, 
                n.idAtividade,
                u.ra AS ra,
                u.nome AS nome
                    FROM notas n
            JOIN alunos al ON n.idAluno = al.idAluno
            JOIN usuarios u ON al.idAluno = u.idReferencia AND u.tipo = 'aluno'
            WHERE n.idAtividade = ? AND n.correcao = 'pendente';
                    `, [idAtividade]);

        return rows;
    }

    static async buscarCorrigidas(idAtividade) {
        let [rows] = await db.query(`
            SELECT 
                n.idAluno, 
                n.idAtividade,
                u.ra AS ra,
                u.nome AS nome
                   FROM notas n
            JOIN alunos al ON n.idAluno = al.idAluno
            JOIN usuarios u ON al.idAluno = u.idReferencia AND u.tipo = 'aluno'
            WHERE n.idAtividade = ? AND n.correcao = 'corrigida' AND n.entregue = 'sim';
        `, [idAtividade]);

        return rows;
    }

    static async enviarCorrecao(idAtividade, idAluno, { nota, feedback }, nomeArquivo) {

        // Verifica o status da atividade
        let [atividadeRows] = await db.query(
            'SELECT status FROM atividades WHERE idAtividade = ?',
            [idAtividade]
        );

        if (!atividadeRows.length) {
            throw new Error('Atividade não encontrada');
        }

        let status = atividadeRows[0].status;

        if (status === 'disponivel') {
            throw new Error('Não é possível corrigir uma atividade ainda disponível.');
        }

        let entregue = "sim";

        // Inserção ou atualização da correção
        let [result] = await db.query(`
            UPDATE notas
            SET nota = ?, feedback = ?, entregue = ?, arquivo_feedback = ?, correcao = 'corrigida'
            WHERE idAtividade = ? AND idAluno = ?
        `, [nota, feedback, entregue, nomeArquivo, idAtividade, idAluno]);

        return result.affectedRows > 0;
    }

    static async atualizarCorrecao(idAtividade, idAluno, { nota, feedback }, nomeArquivo) {

        // Remove o arquivo antigo, se existir
        let [correcao] = await db.query(`
            SELECT arquivo_feedback FROM notas
            WHERE idAtividade = ? AND idAluno = ?
        `, [idAtividade, idAluno]);
        if (correcao.length > 0 && correcao[0].arquivo_feedback) {
            let feedbackDir = path.resolve(__dirname, '../../../feedback');
            let caminhoArquivo = path.join(feedbackDir, correcao[0].arquivo_feedback);
            if (fs.existsSync(caminhoArquivo)) {
                fs.unlinkSync(caminhoArquivo);
            }
        }

        // Verifica se a correção existe
        let [existingCorrecao] = await db.query(`
            SELECT * FROM notas
            WHERE idAtividade = ? AND idAluno = ?
        `, [idAtividade, idAluno]);

        if (!existingCorrecao.length) {
            throw new Error('Correção não encontrada');
        }

        // Atualiza a correção
        let [result] = await db.query(`
            UPDATE notas
            SET nota = ?, feedback = ?, arquivo_feedback = ?
            WHERE idAtividade = ? AND idAluno = ?
        `, [nota, feedback, nomeArquivo, idAtividade, idAluno]);

        return result.affectedRows > 0;
    }
    static async excluirCorrecao(idAtividade, idAluno) {

        // Remove o arquivo da pasta de feedback, se existir
        let [correcao] = await db.query(`
            SELECT arquivo_feedback FROM notas
            WHERE idAtividade = ? AND idAluno = ?
        `, [idAtividade, idAluno]);

        if (correcao.length > 0 && correcao[0].arquivo_feedback) {

            let feedbackDir = path.resolve(__dirname, '../../../feedback');
            let caminhoArquivo = path.join(feedbackDir, correcao[0].arquivo_feedback);
            if (fs.existsSync(caminhoArquivo)) {
                fs.unlinkSync(caminhoArquivo);
            }
        }

        // Exclui a correção da tabela notas
        let [deleteResult] = await db.query(`
            DELETE FROM notas
            WHERE idAtividade = ? AND idAluno = ?
        `, [idAtividade, idAluno]);

        // Atualiza o status da entrega para "pendente" na tabela notas
        let [updateResult] = await db.query(`
            UPDATE notas
            SET correcao = "pendente"
            WHERE idAtividade = ? AND idAluno = ?
        `, [idAtividade, idAluno]);

        return deleteResult.affectedRows > 0 || updateResult.affectedRows > 0;
    }
    static async buscarCorrecao(idAtividade, idAluno) {
        let [rows] = await db.query(`
            SELECT idAluno, idAtividade, feedback, nota, arquivo_feedback
            FROM notas
            WHERE idAtividade = ? AND idAluno = ?
        `, [idAtividade, idAluno]);
        return rows[0];
    }

    static async buscarResposta(idAtividade, idAluno) {
        let [rows] = await db.query(`
            SELECT 
                n.idAluno, 
                n.idAtividade,
                n.descricao AS descricaoAluno,
                n.correcao AS correcao,
                n.descricao,
                n.arquivo,
                u.ra AS ra,
                u.nome AS nome,
                m.titulo,
                m.descricao AS descricaoAtividade,
                m.peso
            FROM notas n
            JOIN alunos al ON n.idAluno = al.idAluno
            JOIN atividades m ON n.idAtividade = m.idAtividade
            JOIN usuarios u ON al.idAluno = u.idReferencia AND u.tipo = 'aluno'
            WHERE n.idAtividade = ? AND n.idAluno = ?;
        `, [idAtividade, idAluno]);
        return rows.length > 0 ? rows[0] : null;
    }

    static async cadastrarAtividade(titulo, descricao, dataEntrega, hora, peso, idDisciplina, idTurma, tipo) {
        let [result] = await db.query(`
            INSERT INTO atividades (titulo, descricao, dataEntrega, hora, peso, idDisciplina, idTurma, tipo, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [titulo, descricao, dataEntrega, hora, peso, idDisciplina, idTurma, tipo, tipo === 'avaliativa' ? 'indisponivel' : 'disponivel']);

        if (tipo === 'avaliativa') {
            // Define o status da atividade como "indisponivel" por padrão
            await db.query(
                'UPDATE atividades SET status = "indisponivel" WHERE idAtividade = ?',
                [result.insertId]
            );

            // Insere todos os alunos da turma na tabela notas
            let [alunos] = await db.query('SELECT idAluno FROM matricula WHERE idTurma = ?', [idTurma]);
            for (let aluno of alunos) {
                await db.query(
                    'INSERT INTO notas (idAluno, idAtividade, correcao) VALUES (?, ?, ?)',
                    [aluno.idAluno, result.insertId, 'pendente']
                );
            }
        }

        return result.insertId;
    }
    static async buscarPorData(data) {
        let [rows] = await db.query(
            `SELECT 
                d.nome,
                a.titulo,
                a.descricao,
                a.dataEntrega,
                a.hora,
                a.peso,
                a.tipo,
                a.status
            FROM atividades a
            JOIN disciplinas d ON a.idDisciplina = d.idDisciplina
            WHERE DATE(a.dataEntrega) = ?`,
            [data]
        );
        return rows;
    }

}

export default Atividades;