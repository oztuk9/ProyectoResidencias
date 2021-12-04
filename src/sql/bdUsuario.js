const { getConnection } = require('../database')

//Notificacion toast con sweetalert2
const Swal = require('sweetalert2');
const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

async function verificarNombreRegistrado(nombre) {
    try {
        const conn = await getConnection();
        const result = await conn.query("SELECT nombre FROM usuarios WHERE nombre=?", nombre);
        return result;
    } catch (error) {
        console.log(error);
    }
}

async function registrarUsuario(usuario) {
    try {
        const conn = await getConnection();
        const result = await conn.query("INSERT INTO usuarios SET ?", usuario);
    } catch (error) {
        console.log(error);
    }

}

async function iniciarSesion(nombre, pass) {
    try {
        const conn = await getConnection();
        const result = await conn.query("SELECT id FROM usuarios WHERE nombre=? AND pass=?", [nombre, pass]);
        return result;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    registrarUsuario,
    iniciarSesion,
    verificarNombreRegistrado
}