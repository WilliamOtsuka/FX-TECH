import db from '../../../connection-db.js';

class Disciplinas {
    static async buscarTodas() {
        let [rows] = await db.query('SELECT * FROM disciplinas');
        return rows;
    }

    static async atualizarDisciplinasTurma(idTurma, adicionadas) {
        if (adicionadas && adicionadas.length > 0) {
            const insertQuery = `
                INSERT IGNORE INTO turma_disciplinas (idTurma, idDisciplina) VALUES ?
            `;
            const insertValues = adicionadas.map(id => [idTurma, id]);
            await db.query(insertQuery, [insertValues]);
        }
    }

    static async deleteDisciplinasTurma(idTurma, removidas) {
        if (removidas && removidas.length > 0) {
            const deleteQuery = `
                DELETE FROM turma_disciplinas 
                WHERE idTurma = ? AND idDisciplina IN (?)
            `;
            await db.query(deleteQuery, [idTurma, [...removidas]]);
        }
    }
}

export default Disciplinas;