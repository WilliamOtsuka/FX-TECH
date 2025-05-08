import ConnectioDb from '../../../connection-db.js';

class Materias {
    static async buscarTodas() {
        let connectDb = new ConnectioDb();
        let db = await connectDb.connect();
        let [rows] = await db.query('SELECT * FROM materia');
        return rows;
    }
}

export default Materias;