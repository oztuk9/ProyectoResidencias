const mysql = require('promise-mysql')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'almacen_puntoventa',
    port: '3306'
}) 

function getConnection(){
    return connection;
}

module.exports = {
    getConnection
}