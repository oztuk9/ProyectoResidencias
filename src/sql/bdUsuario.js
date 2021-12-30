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
        Swal.fire({
            title: 'Te haz registrado con exito',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'CONTINUAR'
          }).then((result) => {
            if (result.isConfirmed) {
                location.href = './login.html';
            }
          })
    } catch (error) {
        console.log(error);
    }

}

async function selectUsuario(ID_Usuario) {
    try {
        const conn = await getConnection();
        const result = await conn.query(`SELECT id, nombre, email, TipoUsuario, pass, imagen FROM usuarios WHERE id=${ID_Usuario}`);
        return result;
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


async function editarUsuario(update,id){
    try {
        const conn = getConnection();
        const result = (await conn).query("UPDATE usuarios SET ? WHERE ID=?",[update,id])
        Toast.fire({
            icon: 'success',
            title: 'Se han guardado los cambios',
            background: 'FFFF',
            width: 380
        })
    } catch (error) {
        console.log(error);
    }
}

async function selectUsuarios() {
    try {
        const conn = await getConnection();
        const result = await conn.query("SELECT id, nombre FROM usuarios WHERE bajaUsuario=false");
        return result;
    } catch (error) {
        console.log(error);
    }
}

async function cambiarPermisosUsuario(permisos, idUsuario){
    try {
        const conn = getConnection();
        const result = (await conn).query("UPDATE usuarios SET ? WHERE ID=?",[permisos,idUsuario])
        Toast.fire({
            icon: 'success',
            title: 'Se han cambiado los permisos del usuario',
            background: 'FFFF',
            width: 380
        })
    } catch (error) {
        console.log(error);
    }
}

async function bajaUsuario(baja, idUsuario){
    try {
        const conn = getConnection();
        const result = (await conn).query("UPDATE usuarios SET ? WHERE ID=?",[baja,idUsuario])
        Toast.fire({
            icon: 'success',
            title: 'El usuario fue eliminado',
            background: 'FFFF',
            width: 380
        })
    } catch (error) {
        console.log(error);
    }
}

async function selectUsuarioPermisos(id) {
    try {
        const conn = await getConnection();
        const result = await conn.query("SELECT TipoUsuario FROM usuarios WHERE id=?",id);
        return result;
    } catch (error) {
        console.log(error);
    }
}

async function usuarioVigente(id) {
    try {
        const conn = await getConnection();
        const result = await conn.query("SELECT BajaUsuario FROM usuarios WHERE id=?",id);
        return result;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    registrarUsuario,
    iniciarSesion,
    verificarNombreRegistrado,
    selectUsuario,
    editarUsuario,
    selectUsuarios,
    cambiarPermisosUsuario,
    bajaUsuario,
    selectUsuarioPermisos,
    usuarioVigente
}