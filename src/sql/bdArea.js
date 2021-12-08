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

//Cargar area

async function mostrarAreas(){
    try {
        const conn = await getConnection();
        const result = await conn.query("SELECT id, nombre FROM area");
        return result;
    } catch (error) {
        console.log(error);
    }
}

//Agregar area 

async function insertarArea(insert){
    try {
        const conn = await getConnection();
        const result = await conn.query("INSERT INTO area SET ?", insert);
        Toast.fire({
            icon: 'success',
            title: 'Se agrego una nueva area',
            background: 'FFFF',
            width: 450
        })
    } catch (error) {
        console.log(error);
    }
}

//Editar Area

async function editarArea(update,id){
    try {
        const conn = getConnection();
        const result = (await conn).query("UPDATE  area SET ? WHERE ID=?",[update,id])
        Toast.fire({
            icon: 'success',
            title: 'Area editada',
            background: 'FFFF',
            width: 450
        })
    } catch (error) {
        console.log(error);
    }
}

//Eliminar Area

async function eliminarArea(idArea){
    try {
        const conn = await getConnection();
        const result = await conn.query("DELETE FROM area WHERE id=?", idArea);
        Toast.fire({
            icon: 'success',
            title: 'Area eliminada',
            background: 'FFFF',
            width: 450
        })
    } catch (error) {
        Toast.fire({
            icon: 'error',
            title: 'Elimine a los usuarios que esten asignados a esta area o cambielos de area para poder eliminar esta area',
            background: 'FFFF',
            width: 700
        })
        console.log(error);
    }
}

module.exports = {
    mostrarAreas,
    insertarArea,
    editarArea,
    eliminarArea

}