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

//Cargar Empleado

async function mostrarEmpleados(){
    try {
        const conn = await getConnection();
        const result = await conn.query("SELECT id, nombre FROM trabajador");
        return result;
    } catch (error) {
        console.log(error);
    }
}

//Agregar Empleado

async function insertarEmpleado(insert){
    try {
        const conn = await getConnection();
        const result = await conn.query("INSERT INTO trabajador SET ?", insert);
        Toast.fire({
            icon: 'success',
            title: 'Se agrego un nuevo empleado',
            background: 'FFFF',
            width: 450
        })
    } catch (error) {
        console.log(error);
    }
}

//Editar Empleado

async function editarEmpleado(update,id){
    try {
        const conn = getConnection();
        const result = (await conn).query("UPDATE  trabajador SET ? WHERE ID=?",[update,id])
        Toast.fire({
            icon: 'success',
            title: 'Empleado editado',
            background: 'FFFF',
            width: 450
        })
    } catch (error) {
        console.log(error);
    }
}

//Eliminar Empleado

async function eliminarEmpleado(idEmpleado){
    try {
        const conn = await getConnection();
        const result = await conn.query("DELETE FROM trabajador WHERE id=?", idEmpleado);
        Toast.fire({
            icon: 'success',
            title: 'Empleado eliminado',
            background: 'FFFF',
            width: 450
        })
    } catch (error) {
        console.log(error);
    }
}

async function buscarAreaEmpleado(idEmpleado){
    try {
        const conn = await getConnection();
        const result = await conn.query("SELECT ID_Area FROM trabajador WHERE id=?", idEmpleado);
        return result;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    mostrarEmpleados,
    insertarEmpleado,
    editarEmpleado,
    eliminarEmpleado,
    buscarAreaEmpleado

}