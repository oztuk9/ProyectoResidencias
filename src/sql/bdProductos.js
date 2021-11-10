const { getConnection } = require('../database')

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
    let select = await document.getElementById('select_marca');

    for (let i = 0; i < result.length; i++) {
        objeto = document.createElement('option')
        objeto.value = result[i].id
        objeto.text = result[i].nombre
        select.appendChild(objeto);
    }
}

async function cargarDatosCategoria() {
    const conn = await getConnection();
    const result = await conn.query('SELECT id,nombre FROM categoria');
    let select = await document.getElementById('select_categoria');

    for (let i = 0; i < result.length; i++) {
        objeto = document.createElement('option')
        objeto.value = result[i].id
        objeto.text = result[i].nombre
        select.appendChild(objeto);
    }
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
          
        console.log(result);
    } catch (error) {
        console.log(error);
    }
    console.log('Este es el mensaje de la funcion: ')
}


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
        console.log(result);
    } catch (error) {
        console.log(error);
    }
    console.log('Este es el mensaje de la funcion: ')
}

async function insertarProducto(producto){
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
    }
    console.log('Este es el mensaje de la funcion: ')
}

module.exports = {
    cargarDatosMarca,
    cargarDatosCategoria,
    insertarMarca,
    insertarCategoria,
    insertarProducto
}