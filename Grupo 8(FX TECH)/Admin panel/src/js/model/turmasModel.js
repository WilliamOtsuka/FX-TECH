import db from '../../../connection-db.js';

class Turmas {
    static async listarTurmas() {
        let [rows] = await db.query(`
            SELECT t.idTurma, t.nome, al.ano AS anoLetivo, t.ensino
            FROM turmas t
            JOIN ano_letivo al ON t.idAno_letivo = al.idAno_letivo
            ORDER BY al.ano DESC, t.nome ASC
        `);
        return rows;
    }

    static async atualizarTurma(idTurma, turmaAtualizada) {
        // Validação básica
        if (!idTurma || !turmaAtualizada.nome || !turmaAtualizada.anoLetivo || !turmaAtualizada.ensino) {
            throw new Error("Nome, ano letivo e ensino são obrigatórios.");
        }

        // Busca o idAno_letivo correspondente ao anoLetivo informado
        let [anos] = await db.query(
            `SELECT * FROM ano_letivo WHERE ano = ?`,
            [turmaAtualizada.anoLetivo]
        );
        if (anos.length === 0) {
            throw new Error("Ano letivo não encontrado.");
        }
        let idAno_letivo = anos[0].idAno_letivo;

        // Verifica se já existe outra turma com o mesmo nome e ano letivo (excluindo a turma atual)
        let [turmasExistentes] = await db.query(
            `SELECT idTurma FROM turmas WHERE nome = ? AND idAno_letivo = ? AND idTurma != ?`,
            [turmaAtualizada.nome, idAno_letivo, idTurma]
        );
        if (turmasExistentes.length > 0) {
            throw new Error("Já existe uma turma com esse nome e ano letivo.");
        }

        // Atualiza a turma
        let [resultado] = await db.query(
            `UPDATE turmas SET nome = ?, idAno_letivo = ?, ensino = ? WHERE idTurma = ?`,
            [turmaAtualizada.nome, idAno_letivo, turmaAtualizada.ensino, idTurma]
        );

        return resultado.affectedRows > 0;
    }


    static async deletarTurma(idTurma) {
        // Verifica se a turma existe
        let [turma] = await db.query(`
            SELECT * 
            FROM turmas 
            WHERE idTurma = ?
        `, [idTurma]);
        if (turma.length === 0) {
            throw new Error("Turma não encontrada.");
        }

        console.log("Turma encontrada:", turma);

        // Deleta atividades corrigidas relacionadas às atividades da turma
        await db.query(`
            DELETE ac 
            FROM atividades_corrigidas ac
            WHERE ac.idAtividade IN (
            SELECT a.idAtividade
            FROM atividades a
            WHERE a.idTurma = ?
            )
        `, [idTurma]);

        // Deleta atividades entregues relacionadas às atividades da turma
        await db.query(`
            DELETE ae 
            FROM atividades_entregues ae
            WHERE ae.idAtividade IN (
            SELECT a.idAtividade
            FROM atividades a
            WHERE a.idTurma = ?
            )
        `, [idTurma]);

        // Deleta atividades relacionadas à turma
        await db.query(`
            DELETE FROM atividades 
            WHERE idTurma = ?
        `, [idTurma]);

        // Deleta referências na tabela turma_disciplinas
        await db.query(`
            DELETE FROM turma_disciplinas 
            WHERE idTurma = ?
        `, [idTurma]);

        // Deleta referências na tabela professor_turma
        await db.query(`
            DELETE FROM professor_turma 
            WHERE idTurma = ?
        `, [idTurma]);

        // Deleta referências na tabela alunos_turma
        await db.query(`
            DELETE FROM alunos_turma 
            WHERE idTurma = ?
        `, [idTurma]);

        // Deleta a turma
        let [resultado] = await db.query(`
            DELETE FROM turmas 
            WHERE idTurma = ?
        `, [idTurma]);
        if (resultado.affectedRows === 0) {
            console.log("Erro ao deletar a turma:", resultado);
            throw new Error("Erro ao deletar a turma.");
        }

        return resultado;
    }

    static async buscarPeriodosPorTurma(idTurma) {
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

    static async buscarDisciplinasPorTurma(idTurma) {
        let [rows] = await db.query(`
            SELECT d.idDisciplina, d.nome
            FROM turma_disciplinas td
            JOIN disciplinas d ON td.idDisciplina = d.idDisciplina
            WHERE td.idTurma = ?
        `, [idTurma]);
        return rows;
    }

    static async listarParticipantesPorTurma(idTurma) {
        try {
            // Validação do parâmetro
            if (!idTurma) {
                throw new Error("O parâmetro idTurma é obrigatório.");
            }

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

            return alunos;
        } catch (error) {
            console.error("Erro ao buscar participantes da turma:", error);
            throw error; // Propaga o erro para ser tratado na função chamadora
        }
    }

    static async listarAlunosTurma(idTurma, idDisciplina) {
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

        // Busca os professores da disciplina na turma
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
            WHERE pt.idTurma = ? AND pt.idDisciplina = ?
            ORDER BY u.nome ASC;
        `, [idTurma, idDisciplina]);
        console.log("professor: ", professores);

        let participantes = [...alunos, ...professores];
        console.log("Participantes encontrados:", participantes);
        return participantes;
    }
}

export default Turmas;