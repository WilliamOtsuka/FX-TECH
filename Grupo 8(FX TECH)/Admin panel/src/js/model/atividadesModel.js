import db from '../../../connection-db.js';

class Atividades {
    static async buscarAtividades(idDisciplina, idTurma) {
        let [rows] = await db.query(
            'SELECT * FROM atividades WHERE idDisciplina = ? AND idTurma = ?',
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
        await db.query(
            'DELETE FROM atividades_corrigidas WHERE idAtividade = ?',
            [idAtividade]
        );
        await db.query(
            'DELETE FROM atividades_entregues WHERE idAtividade = ?',
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
                ta.idAluno, 
                ta.idTurma,
                u.nome AS nome,
                u.ra AS ra
            FROM alunos_turma ta
            JOIN alunos al ON ta.idAluno = al.idAluno
            JOIN atividades a ON ta.idTurma = a.idTurma
            JOIN usuarios u ON al.idAluno = u.idReferencia AND u.tipo = 'aluno'
            WHERE a.idAtividade = ?
              AND NOT EXISTS (
                  SELECT 1 
                  FROM atividades_entregues ae 
                  WHERE ae.idAluno = ta.idAluno AND ae.idAtividade = a.idAtividade
              )
              AND (
                  NOT EXISTS (
                      SELECT 1 
                      FROM atividades_corrigidas ac 
                      WHERE ac.idAluno = ta.idAluno AND ac.idAtividade = a.idAtividade
                  )
                  OR EXISTS (
                      SELECT 1
                      FROM atividades_corrigidas ac
                      WHERE ac.idAluno = ta.idAluno AND ac.idAtividade = a.idAtividade AND ac.entregue = 'nao'
                  )
              );
        `, [idAtividade]);
        return rows;
    }

    static async buscarNaoCorrigidas(idAtividade) {
        let [rows] = await db.query(` 
            SELECT 
                ae.idAluno, 
                ae.idAtividade,
                u.ra AS ra,
                u.nome AS nome
                    FROM atividades_entregues ae
            JOIN alunos al ON ae.idAluno = al.idAluno
            JOIN usuarios u ON al.idAluno = u.idReferencia AND u.tipo = 'aluno'
            WHERE ae.idAtividade = ? AND ae.correcao = 'pendente';
                    `, [idAtividade]);
        return rows;
    }

    static async buscarCorrigidas(idAtividade) {
        let [rows] = await db.query(`
            SELECT 
                ae.idAluno, 
                ae.idAtividade,
                u.ra AS ra,
                u.nome AS nome
                   FROM atividades_entregues ae
            JOIN alunos al ON ae.idAluno = al.idAluno
            JOIN usuarios u ON al.idAluno = u.idReferencia AND u.tipo = 'aluno'
            WHERE ae.idAtividade = ? AND ae.correcao = 'corrigida';
        `, [idAtividade]);
        return rows;
    }

    static async enviarCorrecao(idAtividade, idAluno, { nota, feedback }) {

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
            INSERT INTO atividades_corrigidas (idAtividade, idAluno, nota, feedback, entregue)
            VALUES (?, ?, ?, ?, ?)
        `, [idAtividade, idAluno, nota, feedback, entregue]);

        // Atualiza o status da entrega
        await db.query(
            'UPDATE atividades_entregues SET correcao = "corrigida" WHERE idAluno = ? AND idAtividade = ?',
            [idAluno, idAtividade]
        );

        return result.affectedRows > 0;
    }

    static async atualizarCorrecao(idAtividade, idAluno, { nota, feedback }) {

        // Verifica se a correção existe
        let [existingCorrecao] = await db.query(`
            SELECT * FROM atividades_corrigidas
            WHERE idAtividade = ? AND idAluno = ?
        `, [idAtividade, idAluno]);

        if (!existingCorrecao.length) {
            throw new Error('Correção não encontrada');
        }

        // Atualiza a correção
        let [result] = await db.query(`
            UPDATE atividades_corrigidas
            SET nota = ?, feedback = ?
            WHERE idAtividade = ? AND idAluno = ?
        `, [nota, feedback, idAtividade, idAluno]);

        return result.affectedRows > 0;
    }
    static async excluirCorrecao(idAtividade, idAluno) {

        // Exclui a correção da tabela atividades_corrigidas
        let [deleteResult] = await db.query(`
            DELETE FROM atividades_corrigidas
            WHERE idAtividade = ? AND idAluno = ?
        `, [idAtividade, idAluno]);

        // Atualiza o status da entrega para "pendente" na tabela atividades_entregues
        let [updateResult] = await db.query(`
            UPDATE atividades_entregues
            SET correcao = "pendente"
            WHERE idAtividade = ? AND idAluno = ?
        `, [idAtividade, idAluno]);

        return deleteResult.affectedRows > 0 || updateResult.affectedRows > 0;
    }
    static async buscarCorrecao(idAtividade, idAluno) {
        let [rows] = await db.query(`
            SELECT idAluno, idAtividade, feedback, nota
            FROM atividades_corrigidas
            WHERE idAtividade = ? AND idAluno = ?
        `, [idAtividade, idAluno]);
        return rows[0];
    }

    static async buscarResposta(idAtividade, idAluno) {
        let [rows] = await db.query(`
            SELECT 
                ae.idAluno, 
                ae.idAtividade,
                ae.descricao AS descricaoAluno,
                ae.correcao AS correcao,
                ae.descricao,
                u.ra AS ra,
                u.nome AS nome,
                at.titulo,
                at.descricao AS descricaoAtividade,
                at.peso
            FROM atividades_entregues ae
            JOIN alunos al ON ae.idAluno = al.idAluno
            JOIN atividades at ON ae.idAtividade = at.idAtividade
            JOIN usuarios u ON al.idAluno = u.idReferencia AND u.tipo = 'aluno'
            WHERE ae.idAtividade = ? AND ae.idAluno = ?;
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

            // Insere todos os alunos da turma na tabela atividades_entregues
            let [alunos] = await db.query('SELECT idAluno FROM alunos_turma WHERE idTurma = ?', [idTurma]);
            for (let aluno of alunos) {
                await db.query(
                    'INSERT INTO atividades_entregues (idAluno, idAtividade, correcao) VALUES (?, ?, ?)',
                    [aluno.idAluno, result.insertId, 'pendente']
                );
            }
        }

        return result.insertId;
    }

    static async enviarAtividade(idAluno, idAtividade, descricao, dataEntrega) {

        let [atividade] = await db.query(
            'SELECT status FROM atividades WHERE idAtividade = ?',
            [idAtividade]
        );

        if (atividade.length === 0 || atividade[0].status === 'indisponivel') {
            throw new Error('Não é possível entregar uma atividade indisponível');
        }

        let [existingEntrega] = await db.query(
            'SELECT * FROM atividades_entregues WHERE idAluno = ? AND idAtividade = ?',
            [idAluno, idAtividade]
        );

        if (existingEntrega.length > 0) {
            let [result] = await db.query(
                'UPDATE atividades_entregues SET descricao = ?, dataEntrega = ? WHERE idAluno = ? AND idAtividade = ?',
                [descricao, dataEntrega, idAluno, idAtividade]
            );
            return { message: 'Entrega atualizada com sucesso!', updated: result.affectedRows > 0 };
        } else {
            let correcao = 'pendente';
            let [result] = await db.query(
                'INSERT INTO atividades_entregues (idAluno, idAtividade, descricao, dataEntrega, correcao) VALUES (?, ?, ?, ?, ?)',
                [idAluno, idAtividade, descricao, dataEntrega, correcao]
            );
            return { message: 'Atividade entregue com sucesso!', idEntrega: result.insertId };
        }
    }
}

export default Atividades;