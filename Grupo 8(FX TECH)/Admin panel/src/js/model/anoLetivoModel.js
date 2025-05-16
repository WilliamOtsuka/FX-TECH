import db from '../../../connection-db.js';

class AnoLetivo {
    static async buscarTodos() {
        let [rows] = await db.query('SELECT * FROM ano_letivo'); // Replace 'ano_letivo' with your actual table name
        console.log("Anos letivos encontrados:", rows);
        return rows;
    }
}

export default AnoLetivo;