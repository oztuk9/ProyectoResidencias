const { getConnection } = require('../database')

const Swal = require('sweetalert2');
const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

async function getDataTable(altaBaja) {
    try {
        const conn = await getConnection();
        const result = await conn.query("SELECT P.id,P.imagen, P.nombre, M.nombre as marca, C.nombre as categoria, P.precioventa, P.codigobarras as codigo,A.cantidad  FROM PRODUCTOS P INNER JOIN CATEGORIA C ON P.id_categoria=C.id INNER JOIN MARCA M ON P.id_marca=M.id INNER JOIN ALMACEN A ON P.id=A.id_Productos where altaBaja=?",[altaBaja]);
        return result;
    } catch (e) {
        console.log(e);
    }
}


async function getDataTableOrder(order,by,altaBaja) {

    try {
        const sql = `SELECT P.id,P.imagen, P.nombre, M.nombre as marca, C.nombre as categoria, P.precioventa, P.codigobarras as codigo,A.cantidad  FROM PRODUCTOS P INNER JOIN CATEGORIA C ON P.id_categoria=C.id INNER JOIN MARCA M ON P.id_marca=M.id INNER JOIN ALMACEN A ON P.id=A.id_Productos WHERE altaBaja=${altaBaja} ORDER BY ${order} ${by}`;
        const conn = await getConnection();
        const result = await conn.query(sql);
        console.log(result);
        return result;
    } catch (e) {
        console.log(e);
    }
}



async function eliminarProducto(idProducto) {
    try {
        const conn = await getConnection();
        const result = await conn.query("DELETE FROM productos WHERE id=?", idProducto);
        if (idProducto=="") {
            Toast.fire({
                icon: 'error',
                title: 'Ningun Dato Eliminado',
                text: 'Selecciona el producto a elminar',
                background: 'FFFF',
                width: 450
            })
        }else{
            Toast.fire({
                icon: 'success',
                title: 'Eliminado',
                text: 'Se elimino con exito el producto',
                background: 'FFFF',
                width: 400
            })
        }
    } catch (error) {
        console.log(error);
    }
}

async function bajaProducto(update,id){
    try {
        const conn = getConnection();
        const result = (await conn).query("UPDATE productos SET ? WHERE ID=?",[update,id])
        console.log(result);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getDataTable,
    eliminarProducto,
    bajaProducto,
    getDataTableOrder
}