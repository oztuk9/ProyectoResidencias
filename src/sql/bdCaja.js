const { getConnection } = require('../database')

//Consultar datos del producto
async function datosProducto(idProducto){
    try {
        const conn = await getConnection();
        const result = await conn.query("SELECT imagen, nombre, precioVenta FROM productos WHERE id=? ORDER BY ID DESC LIMIT 1",idProducto);
        return result;
    } catch (error) {
     console.log(error);   
    }
}

//Pedido Ventas

async function insertarPedidoVentas(datos){
    try {
        const conn = await getConnection();
        const result = await conn.query("INSERT INTO pedidoVentas SET ?",datos);
    } catch (error) {
        console.log(error);   
    }
}

//Insertar en la tabla DetallePedidoVentas

async function insertarDetallePedidoVentas(datos){
    try {
        const conn = await getConnection();
        const result = await conn.query("INSERT INTO detallepedidoventas SET ?",datos);
    } catch (error) {
        console.log(error);   
    }
}

//Consultar el ultimo pedidoVentas

async function obtenerUltimoIdPedidoVentas(){
    try {
        const conn = await getConnection();
        const result = await conn.query("SELECT id, tiempo FROM pedidoVentas ORDER BY id DESC LIMIT 1");
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
        console.log(result);
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

//Obtener el ulmimo corte

async function ultimoCorte(id){
    try {
        const conn = getConnection();
        const result = (await conn).query("SELECT id FROM pedidoVentas WHERE Corte = true AND ID_Usuario = ? ORDER BY ID DESC LIMIT 1",[id])
        return result;
    } catch (error) {
        console.log(error);
    }
}


//Cuando el usuario no a tenido ni un solo corte se usara esta consulta

async function sinCorte(id){
    try {
        const conn = getConnection();
        const result = (await conn).query("SELECT SUM(TotalDinero) as TotalDinero FROM pedidoVentas WHERE ID_Usuario = ?",[id])
        return result;
    } catch (error) {
        console.log(error);
    }
}

//Cuando el usuario ya haya tenido un corte obtendremos el total entre su primer registro de venta despues del corte y el ultimo registro

async function conCorte(inicio,fin,id){
    try {
        const conn = getConnection();
        const result = (await conn).query("SELECT SUM(TotalDinero) as TotalDinero FROM pedidoVentas WHERE id between ? AND ? AND ID_Usuario = ?",[inicio,fin,id])
        return result;
    } catch (error) {
        console.log(error);
    }
}

async function obtenerUltimaVenta(id){
    try {
        const conn = getConnection();
        const result = (await conn).query("SELECT id FROM pedidoVentas WHERE ID_Usuario=? ORDER BY ID DESC LIMIT 1",[id])
        return result;
    } catch (error) {
        console.log(error);
    }
}

//Insertar corte de caja

async function insertarCortes(datos){
    try {
        const conn = await getConnection();
        const result = await conn.query("INSERT INTO cortes SET ?",datos);
    } catch (error) {
        console.log(error);   
    }
}

//Actualizar corte con true

async function actualizarPedidoVentas(update,id){
    try {
        const conn = getConnection();
        const result = (await conn).query("UPDATE pedidoventas SET ? WHERE id = ?",[update,id])
    } catch (error) {
        console.log(error);
    }
}

module.exports={
    datosProducto,
    insertarPedidoVentas,
    insertarDetallePedidoVentas,
    obtenerUltimoIdPedidoVentas,
    cantidadAlmacen,
    actualizarAlmacen,
    ultimoCorte,
    sinCorte,
    conCorte,
    obtenerUltimaVenta,
    insertarCortes,
    actualizarPedidoVentas
}