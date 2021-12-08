const { getConnection } = require('../database')

//Consultamos el id del producto escaneado
async function idProductoEscaneado(idEscaneado){
    try {
        const conn = await getConnection();
        const result = await conn.query("SELECT ID FROM productos WHERE CodigoBarras = ?",idEscaneado);
        return result;
    } catch (error) {
        console.log(error);
    }

}

//Consultamos el ultimo registro para obtener el precio
async function ultimoRegistroPrecio(idAlmacen){
    try {
        const conn = await getConnection();
        const result = await conn.query("SELECT precioCompra FROM detallePedidoAlmacen WHERE ID_Productos=? ORDER BY ID DESC LIMIT 1",parseInt(idAlmacen));
        return result;
    } catch (error) {
        console.log(error);
    }

}

//Consultar datos del producto
async function datosProducto(idProducto){
    try {
        const conn = await getConnection();
        const result = await conn.query("SELECT imagen, nombre, cantidadPorPaquete FROM productos WHERE id=? ORDER BY ID DESC LIMIT 1",idProducto);
        return result;
    } catch (error) {
     console.log(error);   
    }

}

//Insertar en la tabla DetalleProductoAlmacen

async function insertarDetalleProductoAlmacen(datos){
    try {
        const conn = await getConnection();
        const result = await conn.query("INSERT INTO detallePedidoAlmacen SET ?",datos);
    } catch (error) {
        console.log(error);   
    }
}
    
module.exports = {
    idProductoEscaneado,
    ultimoRegistroPrecio,
    datosProducto
}