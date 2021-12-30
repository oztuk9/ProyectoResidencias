const bdUsuarios = require('../sql/bdUsuario')
const storage = require("../js/local");

const nombre = document.getElementById('nombre')
const contraseña = document.getElementById('contraseña')
const iniciar = document.getElementById('iniciar');

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


iniciar.addEventListener('click', async (e)=>{
    if (nombre.value==""||contraseña.value=="") {
        Toast.fire({
            icon: 'info',
            title: 'Llene todos los campos',
            background: 'FFFF',
            width: 420
          })
    }else{
        const idUsuario = await bdUsuarios.iniciarSesion(nombre.value,contraseña.value)
        if (idUsuario==""){
            Toast.fire({
                icon: 'info',
                title: 'Usuario o contraseña incorrectos',
                background: 'FFFF',
                width: 420
              })
        }else{
          console.log(idUsuario);
          const usuarioVigente = await bdUsuarios.usuarioVigente(idUsuario.at(0).id)
          console.log(usuarioVigente);
          console.log(usuarioVigente.at(0).BajaUsuario);
          if (usuarioVigente.at(0).BajaUsuario==false) {
            let iniciarSesion = {
              id: idUsuario.at(0).id,
              sesionIniciada: true
          }
          storage.setStorage("idUsuario", iniciarSesion)
          location.href='./caja.html';
          }else{
            Toast.fire({
              icon: 'info',
              title: 'Usuario dado de baja',
              background: 'FFFF',
              width: 420
            })
          }
        }
    }
})