import ConnectioDb from '../../../connection-db.js';

class Notas {
    static async buscarNotasPorAlunoMateriaETurma(idAluno, idMateria, idTurma) {
        let connectDb = new ConnectioDb();
        let db = await connectDb.connect();
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
                JOIN atividade a ON ae.idAtividade = a.idAtividade
                JOIN turma_materias tm ON a.idMateria = tm.idMateria AND tm.idTurma = ?
                JOIN turmas t ON t.idTurma = tm.idTurma
                JOIN periodo_letivo pl 
                    ON pl.idAno_letivo = t.idAno_letivo 
                    AND a.dataEntrega BETWEEN pl.data_inicio AND pl.data_fim
                LEFT JOIN atividades_corrigidas ac 
                    ON ae.idAtividade = ac.idAtividade AND ae.idAluno = ac.idAluno
                WHERE a.idMateria = ? AND ae.idAluno = ?
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
                JOIN atividade a ON ac.idAtividade = a.idAtividade
                JOIN turma_materias tm ON a.idMateria = tm.idMateria AND tm.idTurma = ?
                JOIN turmas t ON t.idTurma = tm.idTurma
                JOIN periodo_letivo pl 
                    ON pl.idAno_letivo = t.idAno_letivo 
                    AND a.dataEntrega BETWEEN pl.data_inicio AND pl.data_fim
                LEFT JOIN atividades_entregues ae 
                    ON ae.idAtividade = ac.idAtividade AND ae.idAluno = ac.idAluno
                WHERE a.idMateria = ? AND ac.idAluno = ?
            )
            ORDER BY dataEntrega ASC;
        `, [idTurma, idMateria, idAluno, idTurma, idMateria, idAluno]);
        return rows;
    }

    static async buscarNotasPorAlunoETurma(idAluno, idTurma) {
        let connectDb = new ConnectioDb();
        let db = await connectDb.connect();
        let [rows] = await db.query(`
            SELECT 
                tm.idMateria,
                m.nome AS nomeMateria,
                pl.nome AS bimestre,
                COALESCE(SUM(ac.nota * (a.peso / 100)), 0) AS nota
            FROM turma_materias tm
            JOIN materia m ON m.idMateria = tm.idMateria
            JOIN turmas t ON t.idTurma = tm.idTurma
            LEFT JOIN atividade a ON a.idMateria = tm.idMateria
            LEFT JOIN periodo_letivo pl 
                ON pl.idAno_letivo = t.idAno_letivo 
                AND a.dataEntrega BETWEEN pl.data_inicio AND pl.data_fim
            LEFT JOIN atividades_corrigidas ac 
                ON ac.idAtividade = a.idAtividade AND ac.idAluno = ?
            WHERE tm.idTurma = ?
            GROUP BY tm.idMateria, m.nome, pl.nome
            ORDER BY nomeMateria, bimestre;
        `, [idAluno, idTurma]);
        return rows;
    }
}

export default Notas;