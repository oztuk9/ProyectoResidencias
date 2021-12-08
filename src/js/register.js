const bdUsuarios = require('../sql/bdUsuario')
const image = document.getElementById("img");
const efecto = document.getElementById('imagenInput');
const nombre = document.getElementById('nombre')
const email = document.getElementById('email')
const contraseña = document.getElementById('contraseña')
const confContraseña = document.getElementById('confContraseña')
const bRegistrarse = document.getElementById('registrarse')

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


//Cargar imagen

const reader = new FileReader();
const fileInput = document.getElementById("imagenInput");
reader.onload = e => {
    img.src = e.target.result;
}
fileInput.addEventListener('change', e => {
    const f = e.target.files[0];
    reader.readAsDataURL(f);
})

//  Efecto Imagen  

efecto.onmouseover = function (e) {
    image.style.transition = '.5s';
    image.style.transform = 'scale(1.1)';
}

efecto.onmouseout = function (e) {
    image.style.transform = 'scale(1)';
}

bRegistrarse.addEventListener('click', (e) => {
    validaciones();
})

async function validaciones() {
    //validacion campos llenos
    if (nombre.value == "" || email.value == "" || contraseña.value == "" || confContraseña.value == "") {
        Toast.fire({
            icon: 'info',
            title: 'Llene todos los campos',
            background: 'FFFF',
            width: 420
        })
    } else {
        const usuarioRegistado = await bdUsuarios.verificarNombreRegistrado(nombre.value)
        console.log(usuarioRegistado);
        if (usuarioRegistado.length == 0) {
            //validacion de email
            const emailRegex = /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i;
            if (emailRegex.test(email.value)) {
                //validacion contraseña y confirmacion contraseña
                if (contraseña.value == confContraseña.value) {
                    let usuario = {
                        nombre: nombre.value,
                        email: email.value,
                        pass: contraseña.value,
                        tipoUsuario: false,
                        imagen: image.src,
                        bajaUsuario : false,
                    }
                    bdUsuarios.registrarUsuario(usuario);
                } else {
                    Toast.fire({
                        icon: 'info',
                        title: 'Las contraseñas no son iguales',
                        background: 'FFFF',
                        width: 420
                    })
                }
            } else {
                Toast.fire({
                    icon: 'info',
                    title: 'Email no valido',
                    background: 'FFFF',
                    width: 420
                })
            }
        } else {
            Toast.fire({
                icon: 'info',
                title: 'Ese nombre de usuario ya existe',
                background: 'FFFF',
                width: 420
            })
        }
    }
}