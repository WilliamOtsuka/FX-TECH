// import { Materia } from './Materia.js';

// export class MateriaRepository {
//     constructor() {
//         // Simulando um "banco de dados" no navegador
//         this.materias = [
//             new Materia(1, "Matemática"),
//             new Materia(2, "Português"),
//             new Materia(3, "História")
//         ];

        
//     }

//     buscarTodas() {
//         return this.materias;
//     }

//     buscarPorId(id) {
//         return this.materias.find(materia => materia.idMateria === id) || null;
//     }
// }

import pool from '../server.js';
import { Materia } from './Materia.js';

export class MateriaRepository {
    async buscarTodas() {
        const [rows] = await pool.query("SELECT * FROM Materia");
        return rows.map(row => new Materia(row.idMateria, row.nome));
    }

    async buscarPorId(id) {
        const [rows] = await pool.query("SELECT * FROM Materia WHERE idMateria = ?", [id]);
        if (rows.length > 0) {
            return new Materia(rows[0].idMateria, rows[0].nome);
        }
        return null;
    }

    async adicionarMateria(nome) {
        const [result] = await pool.query("INSERT INTO Materia (nome) VALUES (?)", [nome]);
        return new Materia(result.insertId, nome);
    }
}