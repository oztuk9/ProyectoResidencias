const { getConnection } = require('../database')

//Consultamos el id del producto escaneado
async function idProductoEscaneado(idEscaneado){
    try {
        const conn = await getConnection();
        const result = await conn.query("SELECT ID, AltaBaja FROM productos WHERE CodigoBarras = ?",idEscaneado);
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

//Pedido Almacen

async function insertarPedidoAlmacen(datos){
    try {
        const conn = await getConnection();
        const result = await conn.query("INSERT INTO pedidoAlmacen SET ?",datos);
    } catch (error) {
        console.log(error);   
    }
}

//Insertar en la tabla DetallePedidoAlmacen

async function insertarDetallePedidoAlmacen(datos){
    try {
        const conn = await getConnection();
        const result = await conn.query("INSERT INTO detallepedidoAlmacen SET ?",datos);
    } catch (error) {
        console.log(error);   
    }
}

//Consultar el ultimo pedidoAlmacen

async function obtenerUltimoIdPedidoAlmacen(){
    try {
        const conn = await getConnection();
        const result = await conn.query("SELECT id FROM pedidoAlmacen ORDER BY id DESC LIMIT 1");
        return result;
    } catch (error) {
        console.log(error);   
    }
}

/*Obtener la cantidad de producto en almacen*/
async function cantidadAlmacen(id){
    try {
        const conn = await getConnection();
        const result = await conn.query("SELECT cantidad FROM almacen WHERE ID_Productos = ?", id);
        return result;
    } catch (error) {
        console.log(error);   
    }
}

//Acualizar la cantidad de productos almacenados

async function actualizarAlmacen(update,id){
    try {
        const conn = getConnection();
        const result = (await conn).query("UPDATE almacen SET ? WHERE ID_Productos = ?",[update,id])
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    idProductoEscaneado,
    ultimoRegistroPrecio,
    datosProducto,
    insertarPedidoAlmacen,
    insertarDetallePedidoAlmacen,
    obtenerUltimoIdPedidoAlmacen,
    cantidadAlmacen,
    actualizarAlmacen
}