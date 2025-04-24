import mysql from 'mysql2/promise';

class ConnectioDb {
    constructor() {
        this.pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: '1234',
            database: 'escola',
            waitForConnections: true,
            connectionLimit: 10, // Define um limite de conexões simultâneas
            queueLimit: 0
        });
    }

    async connect() {
        return this.pool; // Retorna o pool de conexões
    }
}

export default ConnectioDb;
