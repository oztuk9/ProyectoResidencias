const { getConnection } = require('../database')

async function getDataTable() {
    try {
        const conn = await getConnection();
        const result = await conn.query("SELECT P.id,P.imagen, P.nombre, M.nombre as marca, C.nombre as categoria, P.precioventa, P.codigobarras as codigo,A.cantidad, P.minimo, P.maximo  FROM PRODUCTOS P INNER JOIN CATEGORIA C ON P.id_categoria=C.id INNER JOIN MARCA M ON P.id_marca=M.id INNER JOIN ALMACEN A ON P.id=A.id_Productos where altaBaja=1");
        return result;
    } catch (e) {
        console.log(e);
    }
}

async function getDataTableOrder(order,by) {
    try {
        const sql = `SELECT P.id,P.imagen, P.nombre, M.nombre as marca, C.nombre as categoria, P.precioventa, P.codigobarras as codigo,A.cantidad, P.minimo, P.maximo  FROM PRODUCTOS P INNER JOIN CATEGORIA C ON P.id_categoria=C.id INNER JOIN MARCA M ON P.id_marca=M.id INNER JOIN ALMACEN A ON P.id=A.id_Productos where altaBaja=1 ORDER BY ${order} ${by}`;
        const conn = await getConnection();
        const result = await conn.query(sql);
        return result;
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    getDataTable,
    getDataTableOrder
}