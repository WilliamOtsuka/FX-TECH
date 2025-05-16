import db from '../../../connection-db.js';

class Notas {
    static async buscarNotasPorAlunoDisciplinaETurma(idAluno, idDisciplina, idTurma) {
        let [rows] = await db.query(`
            (
                SELECT 
                    ae.idAluno,
                    a.titulo AS nomeAtividade,
                    COALESCE(ac.nota, 0) AS nota,
                    a.peso,
                    pl.nome AS bimestre,
                    ae.dataEntrega
                FROM atividades_entregues ae
                JOIN atividades a ON ae.idAtividade = a.idAtividade
                JOIN turma_disciplinas td ON a.idDisciplina = td.idDisciplina AND td.idTurma = ?
                JOIN turmas t ON t.idTurma = td.idTurma
                JOIN periodo_letivo pl 
                    ON pl.idAno_letivo = t.idAno_letivo 
                    AND a.dataEntrega BETWEEN pl.data_inicio AND pl.data_fim
                LEFT JOIN atividades_corrigidas ac 
                    ON ae.idAtividade = ac.idAtividade AND ae.idAluno = ac.idAluno
                WHERE a.idDisciplina = ? AND ae.idAluno = ?
            )
            UNION
            (
                SELECT 
                    ac.idAluno,
                    a.titulo AS nomeAtividade,
                    ac.nota,
                    a.peso,
                    pl.nome AS bimestre,
                    ae.dataEntrega
                FROM atividades_corrigidas ac
                JOIN atividades a ON ac.idAtividade = a.idAtividade
                JOIN turma_disciplinas td ON a.idDisciplina = td.idDisciplina AND td.idTurma = ?
                JOIN turmas t ON t.idTurma = td.idTurma
                JOIN periodo_letivo pl 
                    ON pl.idAno_letivo = t.idAno_letivo 
                    AND a.dataEntrega BETWEEN pl.data_inicio AND pl.data_fim
                LEFT JOIN atividades_entregues ae 
                    ON ae.idAtividade = ac.idAtividade AND ae.idAluno = ac.idAluno
                WHERE a.idDisciplina = ? AND ac.idAluno = ?
            )
            ORDER BY dataEntrega ASC;
        `, [idTurma, idDisciplina, idAluno, idTurma, idDisciplina, idAluno]);
        return rows;
    }

    static async buscarNotasPorAlunoETurma(idAluno, idTurma) {
        let [rows] = await db.query(`
            SELECT 
                td.idDisciplina,
                d.nome AS nomeDisciplina,
                pl.nome AS bimestre,
                COALESCE(SUM(ac.nota * (a.peso / 100)), 0) AS nota
            FROM turma_disciplinas td
            JOIN disciplina d ON d.idDisciplina = td.idDisciplina
            JOIN turmas t ON t.idTurma = td.idTurma
            LEFT JOIN atividades a ON a.idDisciplina = td.idDisciplina
            LEFT JOIN periodo_letivo pl 
                ON pl.idAno_letivo = t.idAno_letivo 
                AND a.dataEntrega BETWEEN pl.data_inicio AND pl.data_fim
            LEFT JOIN atividades_corrigidas ac 
                ON ac.idAtividade = a.idAtividade AND ac.idAluno = ?
            WHERE td.idTurma = ?
            GROUP BY td.idDisciplina, d.nome, pl.nome
            ORDER BY nomeDisciplina, bimestre;
        `, [idAluno, idTurma]);
        return rows;
    }
}

export default Notas;