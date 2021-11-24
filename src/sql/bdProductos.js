const { getConnection } = require('../database')
const storage = require("../js/local");

//Notificacion toast con sweetalert2
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

//Cargar datos de la base de datos.

async function cargarDatosMarca() {

    const conn = await getConnection();
    const result = await conn.query('SELECT id,nombre FROM marca');
    return result;

}

async function cargarDatosCategoria() {
    const conn = await getConnection();
    const result = await conn.query('SELECT id,nombre FROM categoria');
    console.log("ENTRO A CARGAR CATEGORIA DESDE LA BASE DE DATOS");
    console.log(result);
    return result;
}

//Inserciones a la base de datos.

async function insertarMarca(marca) {
    try {
        const conn = await getConnection();
        const result = await conn.query('INSERT INTO marca SET ?', marca)
        document.getElementById("input-new-marca").value = "";
        Toast.fire({
            icon: 'success',
            title: 'Agregado',
            text: 'Se agrego una nueva marca',
            background: 'FFFF'
        })
        cargarDatosMarca();
        document.querySelector(".modal.is-visible").classList.remove(isVisible);
        console.log(result);
    } catch (error) {
        console.log(error);
    }
    console.log('Este es el mensaje de la funcion: ')
}

//Para insertar almacen se uso un trigger

async function insertarCategoria(categoria) {
    try {
        const conn = await getConnection();
        const result = await conn.query('INSERT INTO categoria SET ?', categoria)
        document.getElementById("input-new-categoria").value = "";
        Toast.fire({
            icon: 'success',
            title: 'Agregado',
            text: 'Se agrego una nueva categoria',
            background: 'FFFF',
            width: 380
        })
        cargarDatosCategoria();
        document.querySelector(".modal.is-visible").classList.remove(isVisible);
        console.log(result);
    } catch (error) {
        console.log(error);
    }
    console.log('Este es el mensaje de la funcion: ')
}

async function insertarProducto(producto) {
    try {
        const conn = await getConnection();
        const result = await conn.query('INSERT INTO productos SET ?', producto)
        console.log(result);
        Toast.fire({
            icon: 'success',
            title: 'Agregado',
            text: 'Se agrego un nuevo producto',
            background: 'FFFF',
            width: 380
        })
    } catch (error) {
        console.log(error);
        Toast.fire({
            icon: 'error',
            title: 'Error al agregar producto',
            text: 'Llene todos los campos',
            background: 'FFFF',
            width: 380
        })
    }
    console.log('Este es el mensaje de la funcion: ')
}

async function productConsult() {
    try {
        var idProd = storage.getStorage("idProducto").id;
        const conn = await getConnection();
        const result = await conn.query("SELECT * FROM productos WHERE ID=?",idProd);
        console.log(result);
        return result;
    } catch (error) {
        console.log(error);
    }

}

async function editarProducto(update,id){
    try {
        const conn = getConnection();
        const result = (await conn).query("UPDATE productos SET ? WHERE ID=?",[update,id])
        Toast.fire({
            icon: 'success',
            title: 'Editado',
            text: 'Se edito el producto',
            background: 'FFFF',
            width: 380
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    cargarDatosMarca,
    cargarDatosCategoria,
    insertarMarca,
    insertarCategoria,
    insertarProducto,
    productConsult,
    editarProducto
}