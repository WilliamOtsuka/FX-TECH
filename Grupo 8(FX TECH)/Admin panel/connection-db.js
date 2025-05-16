import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'escola',
    waitForConnections: true,
    connectionLimit: 10, // Define um limite de conexões simultâneas
    queueLimit: 0
});

export default pool;
