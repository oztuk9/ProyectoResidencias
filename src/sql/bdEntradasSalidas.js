const { getConnection } = require('../database')

//Consultamos el id del producto escaneado
async function idProductoEscaneado(idEscaneado){
    const conn = await getConnection();
    const result = await conn.query("SELECT ID FROM productos WHERE CodigoBarras = ?",idEscaneado);
    return result;
}

//Consultamos el ultimo registro para obtener el precio
async function ultimoRegistroPrecio(idAlmacen){
    const conn = await getConnection();
    const result = await conn.query("SELECT precioCompra FROM detallePedidoAlmacen WHERE ID_Productos=? ORDER BY ID DESC LIMIT 1",parseInt(idAlmacen));
    return result;
}

//Consultar datos del producto
async function datosProducto(idProducto){
    const conn = await getConnection();
    const result = await conn.query("SELECT imagen, nombre, cantidadPorPaquete FROM productos WHERE id=? ORDER BY ID DESC LIMIT 1",idProducto);
    return result;
}

//Insertar en la tabla DetalleProductoAlmacen

async function insertarDetalleProductoAlmacen(datos){
    const conn = await getConnection();
    const result = await conn.query("INSERT INTO detallePedidoAlmacen SET ?",datos);
}

module.exports = {
    idProductoEscaneado,
    ultimoRegistroPrecio,
    datosProducto
}