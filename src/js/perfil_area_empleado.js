const irUsuario = document.getElementById('irUsuario');
const img = document.getElementById('img');
const efecto = document.getElementById('imagenInput');
const bdArea = require('../sql/bdArea');
const bdEmpleado = require('../sql/bdEmpleado');
const bdUsuarios = require('../sql/bdUsuario');
const datosUsuario = document.getElementById('datosUsuario');

//inputs

const iNombre = document.getElementById('nombre');
const iEmail = document.getElementById('email');
const iContraseña = document.getElementById('contraseña')
const iConfContraseña = document.getElementById('confContraseña')
const iAgregarInputArea = document.getElementById('agregarInputArea');
const iEditarInputArea = document.getElementById('editarInputArea');
const iAgregarInputEmpleado = document.getElementById('agregarInputEmpleado');
const iEditarInputEmpleado = document.getElementById('editarInputEmpleado');

//selects

const sEditarSelectArea = document.getElementById('editarSelectArea');
const sEliminarSelectArea = document.getElementById('eliminarSelectArea');
const sEmpleadoAreaSelect = document.getElementById('empleadoAreaSelect');
const sEmpleadoEditarAreaSelect = document.getElementById('empleadoEditarAreaSelect');
const sEditarSelectEmpleado = document.getElementById('editarSelectEmpleado');
const sEliminarSelectEmpleado = document.getElementById('eliminarSelectEmpleado');
const sSelectUsuario = document.getElementById('selectUsuario');
const sSelectPermisos = document.getElementById('selectPermisos');

//botones

const bEmpleados = document.getElementById('empleados');
const bUsuarios = document.getElementById('usuarios');
const bAgregarArea = document.getElementById('areaAgregar');
const bEditarArea = document.getElementById('areaEditar');
const bEliminarArea = document.getElementById('areaEliminar');
const bAgregarEmpleado = document.getElementById('empleadoAgregar');
const bEditarEmpleado = document.getElementById('empleadoEditar');
const bEliminarEmpleado = document.getElementById('empleadoEliminar');
const bCerrarSesion = document.getElementById('cerrarSesion');
const bGuardarCambiosUsuario = document.getElementById('guardarCambiosUsuario');
const bGuardarUsuarioEdit = document.getElementById('guardarUsuarioEdit');
const bEliminarUsuario = document.getElementById('eliminarUsuario');

//variables para almacenar datos dinamicos

let idEmpleado;
let idArea;
let UsuarioLogeado;
let ID_Usuario;
var equals = false;

//Cargar usuarios en select

async function cargarUsuarios() {
    sSelectUsuario.innerHTML="";
    sSelectPermisos.innerHTML = "";
    let result = await bdUsuarios.selectUsuarios();
    objeto = document.createElement('option')
    objeto.value = 0
    objeto.text = ""
    sSelectUsuario.appendChild(objeto);
    for (let i = 0; i < result.length; i++) {
        if (result[i].id!=1) {
            objeto = document.createElement('option')
        objeto.value = result[i].id
        objeto.text = result[i].nombre
        sSelectUsuario.appendChild(objeto);
        }
    }
}

sSelectPermisos.addEventListener('change', (e) => {
    console.log(sSelectPermisos.value);
})

cargarUsuarios();

//Mostrar en el select de permisos el permiso que tiene un usuario al ser seleccionado

sSelectUsuario.addEventListener('change', async (e) => {
    var idUser = sSelectUsuario.value
    var permisos = await bdUsuarios.selectUsuarioPermisos(idUser)
    sSelectPermisos.innerHTML = "";
    if (sSelectUsuario.value != 0) {
        objeto = document.createElement('option')
        objeto.value = "1"
        objeto.text = "ADMINISTRADOR"
        sSelectPermisos.appendChild(objeto);
        objeto = document.createElement('option')
        objeto.value = "0"
        objeto.text = "COMUN"
        sSelectPermisos.appendChild(objeto);
    }
    if (permisos.length > 0) {
        console.log(permisos.at(0).TipoUsuario);
        var countEmpleado = sSelectPermisos.options;
        for (var opt, j = 0; opt = countEmpleado[j]; j++) {
            if (opt.value == permisos.at(0).TipoUsuario) {
                sSelectPermisos.selectedIndex = j;
                break;
            }
        }

    }
})

//Guardar cambios de permiso de usuario

bGuardarUsuarioEdit.addEventListener('click', (e) => {
    if (sSelectUsuario.value==0) {
        Toast.fire({
            icon: 'info',
            title: 'Seleccione un usuario',
            background: 'FFFF',
            width: 420
        })
    }else{
        let permisos = {
            TipoUsuario: sSelectPermisos.value
        }
        bdUsuarios.cambiarPermisosUsuario(permisos, parseInt(sSelectUsuario.value))
        cargarUsuarios();
    }
})

//Dar de baja a usuario
bEliminarUsuario.addEventListener('click', (e) => {
    if (sSelectUsuario.value!=0) {
        Swal.fire({
            title: '¿Quieres eliminar este usuario?',
            text: "No podras deshacer esta accion",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar usuario'
          }).then((result) => {
            if (result.isConfirmed) {
                var baja={
                    BajaUsuario:1
                }
                bdUsuarios.bajaUsuario(baja,sSelectUsuario.value)
                cargarUsuarios();
            }
          })
    }else{
        Toast.fire({
            icon: 'info',
            title: 'Seleccione un usuario',
            background: 'FFFF',
            width: 420
        })
    }
})

//Cargamos todos los datos del usuario logeado

async function cargarDatosUsuario() {
    ID_Usuario = parseInt(storage.getStorage("idUsuario").id)
    let usuario = await bdUsuarios.selectUsuario(ID_Usuario)
    console.log(usuario);
    UsuarioLogeado = {
        nombre: usuario.at(0).nombre,
        email: usuario.at(0).email,
        pass: usuario.at(0).pass,
        tipoUsuario: usuario.at(0).TipoUsuario,
        imagen: usuario.at(0).imagen
    }
    var imagen = usuario.at(0).imagen
    irUsuario.src = imagen;
    img.src = imagen
    iNombre.value = UsuarioLogeado.nombre
    iEmail.value = UsuarioLogeado.email
    iContraseña.value = UsuarioLogeado.pass
    iConfContraseña.value = UsuarioLogeado.pass
    datosUsuario.innerHTML = UsuarioLogeado.nombre
}

cargarDatosUsuario();

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


efecto.onmouseover = function (e) {
    img.style.transition = '.5s';
    img.style.transform = 'scale(1.1)';
}

efecto.onmouseout = function (e) {
    img.style.transform = 'scale(1)';
}


//Abrir modal empleado/area

bEmpleados.addEventListener('click', (e) => {
    document.getElementById("modal5").classList.add("is-visible");
    cargarArea();
    cargarEmpleado();
})

//Area CRUD

async function cargarArea() {
    try {
        const result = await bdArea.mostrarAreas();
        sEditarSelectArea.innerHTML = "";
        sEliminarSelectArea.innerHTML = "";
        sEmpleadoAreaSelect.innerHTML = "";
        sEmpleadoEditarAreaSelect.innerHTML = "";
        objeto = document.createElement('option')
        objeto.value = 0
        objeto.text = ""
        sEditarSelectArea.appendChild(objeto);
        objeto = document.createElement('option')
        objeto.value = 0
        objeto.text = ""
        sEliminarSelectArea.appendChild(objeto);
        objeto = document.createElement('option')
        objeto.value = 0
        objeto.text = ""
        sEmpleadoAreaSelect.appendChild(objeto);
        objeto = document.createElement('option')
        objeto.value = 0
        objeto.text = ""
        sEmpleadoEditarAreaSelect.appendChild(objeto);
        for (let i = 0; i < result.length; i++) {
            objeto = document.createElement('option')
            objeto.value = result[i].id
            objeto.text = result[i].nombre
            sEditarSelectArea.appendChild(objeto);
            objeto = document.createElement('option')
            objeto.value = result[i].id
            objeto.text = result[i].nombre
            sEliminarSelectArea.appendChild(objeto);
            objeto = document.createElement('option')
            objeto.value = result[i].id
            objeto.text = result[i].nombre
            sEmpleadoAreaSelect.appendChild(objeto);
            objeto = document.createElement('option')
            objeto.value = result[i].id
            objeto.text = result[i].nombre
            sEmpleadoEditarAreaSelect.appendChild(objeto);
        }
    } catch (error) {
    }
}

//cargar input de editar area al seleccionar un area del select

sEditarSelectArea.addEventListener('click', (e) => {
    iEditarInputArea.value = sEditarSelectArea.options[sEditarSelectArea.selectedIndex].text;
})

//agregar area nueva

bAgregarArea.addEventListener('click', (e) => {
    var insertarArea = {
        nombre: iAgregarInputArea.value
    }
    bdArea.insertarArea(insertarArea);
    iAgregarInputArea.value = "";
    cargarArea();
})

bEditarArea.addEventListener('click', (e) => {
    let idArea = sEditarSelectArea.value
    let nombreArea = {
        nombre: iEditarInputArea.value
    }
    bdArea.editarArea(nombreArea, idArea)
    iEditarInputArea.value = "";
    cargarArea();
})

bEliminarArea.addEventListener('click', (e) => {
    bdArea.eliminarArea(sEliminarSelectArea.value)
    iEditarInputArea.value = "";
    cargarArea();
})

//Empleado CRUD

//Cargar Empleado

async function cargarEmpleado() {
    try {
        const result = await bdEmpleado.mostrarEmpleados();
        sEditarSelectEmpleado.innerHTML = "";
        sEliminarSelectEmpleado.innerHTML = "";
        objeto = document.createElement('option')
        objeto.value = 0
        objeto.text = ""
        sEditarSelectEmpleado.appendChild(objeto);
        objeto = document.createElement('option')
        objeto.value = 0
        objeto.text = ""
        sEliminarSelectEmpleado.appendChild(objeto);
        for (let i = 0; i < result.length; i++) {
            objeto = document.createElement('option')
            objeto.value = result[i].id
            objeto.text = result[i].nombre
            sEditarSelectEmpleado.appendChild(objeto);
            objeto = document.createElement('option')
            objeto.value = result[i].id
            objeto.text = result[i].nombre
            sEliminarSelectEmpleado.appendChild(objeto);
        }
    } catch (error) {
    }
}


bAgregarEmpleado.addEventListener('click', (e) => {
    if (iAgregarInputEmpleado.value == "" || sEmpleadoAreaSelect.value == 0) {
        Toast.fire({
            icon: 'error',
            title: 'Llene todos los datos del Empleado',
            background: 'FFFF',
            width: 420
        })
    } else {
        var empleado = {
            nombre: iAgregarInputEmpleado.value,
            ID_Area: parseInt(sEmpleadoAreaSelect.value)
        }
        bdEmpleado.insertarEmpleado(empleado);
        iAgregarInputEmpleado.value = "";
        cargarEmpleado();
        cargarArea();
    }
})

bEditarEmpleado.addEventListener('click', (e) => {
    if (sEditarSelectEmpleado.value == 0) {
        Toast.fire({
            icon: 'info',
            title: 'Seleccione el empleado',
            background: 'FFFF',
            width: 420
        })
    } else if (sEmpleadoEditarAreaSelect.value == 0) {
        Toast.fire({
            icon: 'info',
            title: 'Seleccione un area para el empleado',
            background: 'FFFF',
            width: 420
        })
    } else {
        var empleado = {
            nombre: iEditarInputEmpleado.value,
            ID_Area: sEmpleadoEditarAreaSelect.value
        }
        bdEmpleado.editarEmpleado(empleado, idEmpleado)
        cargarArea();
        cargarEmpleado();
        iEditarInputEmpleado.value = "";
    }
})

//Seleccionar el area de un empleado cuando sea seleccionado

sEditarSelectEmpleado.addEventListener('change', async (e) => {
    idEmpleado = sEditarSelectEmpleado.value
    idArea = await bdEmpleado.buscarAreaEmpleado(idEmpleado)
    if (idArea.length > 0) {
        console.log(idArea.at(0).ID_Area);
        var countEmpleado = sEmpleadoEditarAreaSelect.options;
        for (var opt, j = 0; opt = countEmpleado[j]; j++) {
            if (opt.value == idArea.at(0).ID_Area) {
                sEmpleadoEditarAreaSelect.selectedIndex = j;
                break;
            }
        }

    }
    iEditarInputEmpleado.value = sEditarSelectEmpleado.options[sEditarSelectEmpleado.selectedIndex].text;
})

bEliminarEmpleado.addEventListener('click', (e) => {
    bdEmpleado.eliminarEmpleado(sEliminarSelectEmpleado.value)
    iEditarInputEmpleado.value = "";
    cargarEmpleado();
    cargarArea();
})



//Abrir modal para editar usuarios, areas y empleados

bUsuarios.addEventListener('click', (e) => {
    document.getElementById("modal6").classList.add("is-visible");
})

//Guardar cambios usuario

bGuardarCambiosUsuario.addEventListener('click', async (e) => {
    if (iNombre.value == "" || iEmail.value == "" || iContraseña.value == "" || iConfContraseña.value == "") {
        Toast.fire({
            icon: 'info',
            title: 'Llene todos los campos',
            background: 'FFFF',
            width: 420
        })
    } else {
        const usuarioRegistado = await bdUsuarios.verificarNombreRegistrado(nombre.value)
        if (usuarioRegistado.length == 0) {
            validarEmailPass();
        } else {
            if (usuarioRegistado.at(0).nombre == UsuarioLogeado.nombre) {
                validarEmailPass();
            }
            Toast.fire({
                icon: 'info',
                title: 'Ese nombre de usuario ya existe',
                background: 'FFFF',
                width: 420
            })
        }
    }
})

function validarEmailPass() {
    //validacion de email
    const emailRegex = /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i;
    if (emailRegex.test(email.value)) {
        //validacion contraseña y confirmacion contraseña
        if (contraseña.value == confContraseña.value) {
            let usuario = {
                nombre: nombre.value,
                email: email.value,
                pass: contraseña.value,
                imagen: img.src
            }
            console.log(UsuarioLogeado);
            console.log(ID_Usuario);
            bdUsuarios.editarUsuario(usuario, ID_Usuario);
            cargarDatosUsuario();
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
}

//Cerrar sesión

bCerrarSesion.addEventListener('click', (e) => {
    let iniciarSesion = {
        id: 0,
        sesionIniciada: false
    }
    storage.setStorage("idUsuario", iniciarSesion)
    location.href = './login.html';
})