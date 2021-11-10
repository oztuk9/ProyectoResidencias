const { getConnection } = require('../database')

async function getUsers() {
    try {
        const conn = await getConnection();
        const result = await conn.query(
            "SELECT P.imagen, P.nombre, M.nombre as marca, C.nombre as categoria, P.precioventa, P.codigobarras as codigo,A.cantidad  FROM PRODUCTOS P INNER JOIN CATEGORIA C ON P.id_categoria=C.id INNER JOIN MARCA M ON P.id_marca=M.id INNER JOIN ALMACEN A ON P.id=A.id"
        );
        return result;
    } catch (e) {
        console.log(e);
    }
}