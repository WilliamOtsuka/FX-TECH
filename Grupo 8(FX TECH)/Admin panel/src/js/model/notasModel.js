import db from '../../../connection-db.js';

class Notas {
    static async buscarNotasPorAlunoDisciplinaETurma(idAluno, idDisciplina, idTurma) {
    const [rows] = await db.query(`
        SELECT 
            a.titulo AS nomeAtividade,
            COALESCE(n.nota, 0) AS nota,
            a.peso,
            pl.nome AS bimestre,
            ae.dataEntrega,
            a.dataEntrega AS dataEntregaAtividade
        FROM atividades a
        JOIN turma_disciplinas td ON a.idDisciplina = td.idDisciplina AND td.idTurma = ?
        JOIN turmas t ON t.idTurma = td.idTurma
        JOIN periodo_letivo pl 
            ON pl.idAno_letivo = t.idAno_letivo 
            AND a.dataEntrega BETWEEN pl.data_inicio AND pl.data_fim
        LEFT JOIN atividades_entregues ae 
            ON ae.idAtividade = a.idAtividade AND ae.idAluno = ?
        LEFT JOIN notas n 
            ON n.idAtividade = a.idAtividade AND n.idAluno = ?
        WHERE a.idDisciplina = ?
        ORDER BY dataEntregaAtividade ASC
    `, [idTurma, idAluno, idAluno, idDisciplina]);

    return rows;
}


    static async buscarNotasPorAlunoETurma(idAluno, idTurma) {
        let [rows] = await db.query(`
            SELECT 
                td.idDisciplina,
                d.nome AS nomeDisciplina,
                pl.nome AS bimestre,
                COALESCE(SUM(n.nota * (a.peso / 100)), 0) AS nota
            FROM turma_disciplinas td
            JOIN disciplina d ON d.idDisciplina = td.idDisciplina
            JOIN turmas t ON t.idTurma = td.idTurma
            LEFT JOIN atividades a ON a.idDisciplina = td.idDisciplina
            LEFT JOIN periodo_letivo pl 
                ON pl.idAno_letivo = t.idAno_letivo 
                AND a.dataEntrega BETWEEN pl.data_inicio AND pl.data_fim
            LEFT JOIN notas n 
                ON n.idAtividade = a.idAtividade AND n.idAluno = ?
            WHERE td.idTurma = ?
            GROUP BY td.idDisciplina, d.nome, pl.nome
            ORDER BY nomeDisciplina, bimestre;
        `, [idAluno, idTurma]);
        return rows;
    }
}

export default Notas;