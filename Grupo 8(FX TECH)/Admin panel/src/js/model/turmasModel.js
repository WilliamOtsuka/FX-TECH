import ConnectioDb from '../../../connection-db.js';

class Turmas {
    static async buscarPeriodosPorTurma(idTurma) {
        let connectDb = new ConnectioDb();
        let db = await connectDb.connect();
        let [rows] = await db.query(`
            SELECT * 
            FROM periodo_letivo 
            WHERE idAno_letivo = (
                SELECT idAno_letivo 
                FROM turmas 
                WHERE idTurma = ?
            )
            ORDER BY data_inicio
        `, [idTurma]);
        return rows;
    }

    static async buscarMateriaPorTurma(idTurma, idMateria) {
        let connectDb = new ConnectioDb();
        let db = await connectDb.connect();
        let [rows] = await db.query(`
            SELECT m.idMateria, m.nome AS nomeMateria, t.idTurma, t.nome AS nomeTurma
            FROM turma_materias tm
            JOIN materia m ON tm.idMateria = m.idMateria
            JOIN turmas t ON tm.idTurma = t.idTurma
            WHERE tm.idTurma = ? AND tm.idMateria = ?
        `, [idTurma, idMateria]);
        return rows[0];
    }

    static async listarAlunosPorMateriaTurma(idTurma, idMateria) {
        let connectDb = new ConnectioDb();
        let db = await connectDb.connect();
        // Busca os alunos da turma
        let [alunos] = await db.query(`
            SELECT 
            a.idAluno AS id, 
            u.nome, 
            u.email_pessoal,
            u.ra AS ra, 
            'aluno' AS tipo
            FROM alunos_turma at
            JOIN alunos a ON at.idAluno = a.idAluno
            JOIN usuarios u ON a.idAluno = u.idReferencia AND u.tipo = 'aluno'
            WHERE at.idTurma = ?
            ORDER BY u.nome ASC;
        `, [idTurma]);

        // Busca os professores da matéria na turma
        let [professores] = await db.query(`
            SELECT 
            c.idColaboradores AS id, 
            u.nome, 
            u.email_pessoal, 
            u.ra AS ra,
            'colaborador' AS tipo
            FROM professor_turma pt
            JOIN colaboradores c ON pt.idColaboradores = c.idColaboradores
            JOIN usuarios u ON c.idColaboradores = u.idReferencia AND u.tipo = 'colaborador'
            WHERE pt.idTurma = ? AND pt.idMateria = ?
            ORDER BY u.nome ASC;
        `, [idTurma, idMateria]);

        let participantes = [...alunos, ...professores];
        return participantes;
    }
}

export default Turmas;