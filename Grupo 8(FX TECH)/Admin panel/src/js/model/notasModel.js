import db from '../../../connection-db.js';

class Notas {
    static async buscarNotasPorAlunoDisciplinaETurma(idAluno, idDisciplina, idTurma) {
    let [rows] = await db.query(`
        SELECT 
            n.idNota,
            n.idAluno,
            n.idAtividade,
            n.feedback,
            COALESCE(n.nota, 0) AS nota,
            n.entregue,
            n.arquivo_feedback,
            n.descricao,
            n.dataEntrega,
            n.correcao,
            n.arquivo,
            a.titulo AS nomeAtividade,
            a.peso,
            pl.nome AS bimestre,
            a.dataEntrega AS dataEntregaAtividade
        FROM atividades a
        JOIN turma_disciplinas td ON a.idDisciplina = td.idDisciplina AND td.idTurma = ?
        JOIN turmas t ON t.idTurma = td.idTurma
        JOIN periodo_letivo pl 
            ON pl.idAno_letivo = t.idAno_letivo 
            AND a.dataEntrega BETWEEN pl.data_inicio AND pl.data_fim
        LEFT JOIN notas n 
            ON n.idAtividade = a.idAtividade AND n.idAluno = ?
        WHERE a.idDisciplina = ?
        ORDER BY a.dataEntrega ASC
    `, [idTurma, idAluno, idDisciplina]);

    return rows;
}


    static async buscarNotasPorAlunoETurma(idAluno, idTurma) {
        let [rows] = await db.query(`
            SELECT 
            td.idDisciplina,
            d.nome AS nomeDisciplina,
            pl.nome AS bimestre,
            COALESCE(SUM(COALESCE(n.nota, 0) * (a.peso / 100)), 0) AS nota
            FROM turma_disciplinas td
            JOIN disciplinas d ON d.idDisciplina = td.idDisciplina
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

        static async buscarNotasPorTurmaEDisciplina(idTurma, idDisciplina) {
            let [rows] = await db.query(`
                SELECT DISTINCT
                    m.idAluno,
                    u.nome AS nome_aluno,
                    a.titulo AS nomeAtividade,
                    COALESCE(n.nota, 0) AS nota,
                    a.peso,
                    pl.nome AS bimestre,
                    pl.idPeriodo_letivo,
                    n.dataEntrega,
                    a.dataEntrega AS dataEntregaAtividade
                FROM atividades a
                JOIN turma_disciplinas td ON a.idDisciplina = td.idDisciplina AND td.idTurma = ?
                JOIN turmas t ON t.idTurma = td.idTurma
                JOIN periodo_letivo pl 
                    ON pl.idAno_letivo = t.idAno_letivo 
                    AND a.dataEntrega BETWEEN pl.data_inicio AND pl.data_fim
                JOIN matricula m ON m.idTurma = t.idTurma
                JOIN usuarios u ON u.idUsuario = m.idAluno AND u.tipo = 'aluno'
                LEFT JOIN notas n ON n.idAtividade = a.idAtividade AND n.idAluno = m.idAluno
                LEFT JOIN (
                    SELECT idAtividade, idAluno, MIN(dataEntrega) as dataEntrega
                    FROM notas
                    GROUP BY idAtividade, idAluno
                ) n_min ON n_min.idAtividade = a.idAtividade AND n_min.idAluno = m.idAluno
                WHERE a.idDisciplina = ?
                ORDER BY m.idAluno, pl.idPeriodo_letivo, a.dataEntrega;
            `, [idTurma, idDisciplina]);
            // Agrupa as notas por aluno e por bimestre
            let alunos = {};
            for (let row of rows) {
                if (!row.idAluno) continue;o
                if (!alunos[row.idAluno]) {
                    alunos[row.idAluno] = {
                        nome_aluno: row.nome_aluno,
                        bimestres: {}
                    };
                }
                // Extrai o número do bimestre para usar como chave
                let bimMatch = row.bimestre && row.bimestre.match(/^(\d)/);
                let bimKey = bimMatch ? parseInt(bimMatch[1]) : 0;
                if (!alunos[row.idAluno].bimestres[bimKey]) {
                    alunos[row.idAluno].bimestres[bimKey] = [];
                }
                alunos[row.idAluno].bimestres[bimKey].push({
                    nota: row.nota,
                    peso: row.peso
                });
            }
            return Object.values(alunos);
        }
}

export default Notas;