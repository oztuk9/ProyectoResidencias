const inputcodigoBarras = document.getElementById("inputcodigoBarras");
const bdEntradasSalidas = require('../sql/bdEntradasSalidas');
const closeEls = document.querySelectorAll("[data-close]");
const logicaTabla = require('../js/tablaProductos');
const tbodySolicitud = document.getElementById('tbodySolicitud');
const tbody = document.getElementById('tbody');
const irUsuario = document.getElementById('irUsuario');
const img = document.getElementById('img')
const efecto = document.getElementById('imagenInput');
const bdArea = require('../sql/bdArea');
const bdEmpleado = require('../sql/bdEmpleado')
const storage = require("../js/local");
const bdUsuarios = require('../sql/bdUsuario')
const datosUsuario = document.getElementById('datosUsuario')

//inputs

const inputPiezas = document.getElementById('inputPiezas');
const inputPaquetes = document.getElementById('inputPaquetes');
const inputPrecioCompra = document.getElementById('inputPrecioCompra');
const sFiltrarPor = document.getElementById('filtrarPor');
const sOrdenar = document.getElementById('ordenar');
const iNombre = document.getElementById('nombre')
const iEmail = document.getElementById('email')
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

const bOk = document.getElementById('OK');
const bEliminar = document.getElementById('eliminar');
const bEditar = document.getElementById('editar');
const bEditarPrecioVenta = document.getElementsByClassName('editarPrecioVenta');
const bBuscar = document.getElementById('buscar');
const buscarProducto = document.getElementById('buscarProducto');
const bSeleccionar = document.getElementById('seleccionar');
const bFinalzar = document.getElementById('finalizar');
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
let idProducto = "";
let listaProductosSolicitados = [];
var piezas = "";
var paquetes = "";
var idRow = "";
var selectedRow = "";
var positionRows = 1;
var equals = false;
var editar = false;
let altaBaja = true;
let idEmpleado;
let idArea;
let UsuarioLogeado;
let ID_Usuario;

const checkBox = document.getElementById('checkboxEditar');
checkBox.addEventListener('click', (e) => {
    checkBox.checked ? inputPrecioCompra.disabled = false : inputPrecioCompra.disabled = true;
    console.log(checkBox.checked);
})

//Toast seetalert2
const Swal = require('sweetalert2');
const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

//Cerrar modal con atributo data-close
for (const el of closeEls) {
    el.addEventListener("click", function () {
        console.log(this.parentElement.classList);
        this.parentElement.classList.remove("is-visible");
        editar = false;
        inputPiezas.value = "";
        inputPaquetes.value = "";
        inputPrecioCompra.value = "";
    });
}

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

//  Efecto Imagen 

irUsuario.onmouseover = function (e) {
    irUsuario.style.transition = '.5s';
    irUsuario.style.transform = 'scale(1.1)';
}

irUsuario.onmouseout = function (e) {
    irUsuario.style.transform = 'scale(1)';
}

//Usuario

irUsuario.addEventListener('click', (e) => {
    document.getElementById("modal4").classList.add("is-visible");
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
        console.log("Area nueva" + sEmpleadoEditarAreaSelect.value);
        var empleado = {
            nombre: iAgregarInputEmpleado.value,
            ID_Area: parseInt(sEmpleadoEditarAreaSelect.value)
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

//Evento que se acciona al precionar la tecla "enter" busca el producto en la base de datos y si encuentra un resultado abre la modal para ingresar un producto a la solicitud

inputcodigoBarras.addEventListener('keypress', async (e) => {
    codigo = inputcodigoBarras.value;
    if (e.key === 'Enter') {
        const consultaIdProducto = await bdEntradasSalidas.idProductoEscaneado(inputcodigoBarras.value)
        if (consultaIdProducto.length == 0) {
            Toast.fire({
                icon: 'info',
                title: 'El producto no esta registrado',
                background: 'FFFF',
                width: 420
            })
        } else {
            idProducto = consultaIdProducto.at(0).ID;
            const precio = await bdEntradasSalidas.ultimoRegistroPrecio(idProducto)
            document.getElementById("modal1").classList.add("is-visible");
            if (precio.length == 0) {
                bEditarPrecioVenta.disabled = true;
                Toast.fire({
                    icon: 'info',
                    title: 'No a tenido entradas este producto',
                    background: 'FFFF',
                    width: 420
                })
            } else {
                inputPrecioCompra.value = precio.at(0).precioCompra;
            }
        }
        inputcodigoBarras.value = "";
    }
})


//Agregar producto a la solicitud

bOk.addEventListener('click', (e) => {
    validarEspaciosSolicitud()
})

function validarEspaciosSolicitud() {
    piezas = inputPiezas.value
    paquetes = inputPaquetes.value
    if ((piezas == "" && paquetes == "") || ((parseInt(piezas)) == 0 && (parseInt(paquetes)) == 0) || (piezas == "" && (parseInt(paquetes)) == 0) || ((parseInt(piezas)) == 0 && paquetes == "")) {
        Toast.fire({
            icon: 'info',
            title: 'Coloque la cantidad de productos que solicita',
            background: 'FFFF',
            width: 420
        })
    } else {
        if ((parseInt(piezas)) < 0 || (parseInt(paquetes)) < 0) {
            Toast.fire({
                icon: 'info',
                title: 'Coloque una cantidad mayor a cero',
                background: 'FFFF',
                width: 420
            })
        } else {
            Toast.fire({
                icon: 'success',
                title: 'El valor ingresado es correcto',
                background: 'FFFF',
                width: 420
            })
            if ((inputPrecioCompra.value == "") || (parseInt(inputPrecioCompra.value) == 0) || (parseInt(inputPrecioCompra.value) < 0)) {
                Toast.fire({
                    icon: 'info',
                    title: 'Coloque el "precio compra" del producto valido',
                    background: 'FFFF',
                    width: 420
                })
            } else {
                solicitudProductoArray()
            }
        }
    }
}

//Calcula el total de productos que se ingresan multiplicando la cantidad de paquetes por la cantidad de piezas que contiene el paquete y sumando las piezas ingresadas. paquetes*cantidad de piezas por paquete+piezas

async function obtenerCantidadTotal() {
    const result = await bdEntradasSalidas.datosProducto(idProducto);
    if (paquetes == "") {
        paquetes = 0;
    } else {
        paquetes = paquetes * parseInt(result.at(0).cantidadPorPaquete);
    }
    if (piezas == "") {
        piezas = 0;
    }
    var cantidad = parseInt(piezas) + parseInt(paquetes);
    return cantidad;
}

async function solicitudProductoArray() {
    if (editar == true) {
        editarProductoLista();
        inputPiezas.value = "";
        inputPaquetes.value = "";
        inputPrecioCompra.value = "";
        llenarTabla()
        document.querySelector(".modal.is-visible").classList.remove("is-visible");
    } else {
        const result = await bdEntradasSalidas.datosProducto(idProducto);
        console.log(result);
        const solicitudProductos = {
            imagen: result.at(0).imagen,
            nombre: result.at(0).nombre,
            precioCompra: inputPrecioCompra.value,
            piezas: piezas,
            paquetes: paquetes,
            cantidad: await obtenerCantidadTotal(),
            idAlmacen: idProducto
        }
        listaProductosSolicitados.push(solicitudProductos)
        inputPiezas.value = "";
        inputPaquetes.value = "";
        inputPrecioCompra.value = "";
        llenarTabla()
        document.querySelector(".modal.is-visible").classList.remove("is-visible");
    }
}

//Llenar tabla con los productos solicitados

async function llenarTabla() {
    idRow = "";
    positionRows = 1
    tbodySolicitud.innerHTML = ""; // reset data
    listaProductosSolicitados.forEach((e) => {
        console.log("entro al for");
        console.log(e);
        tbodySolicitud.innerHTML += `<tr id=${positionRows} value=${e.idAlmacen}>
    <td>
        <img class="tbImagen" src="${e.imagen}"/>
    </td>
    <td>
        ${e.nombre}
    </td>
    <td>
    ${e.precioCompra}
    </td>
    <td>
    ${e.cantidad}
    </td>
    <td>
    ${totalMonetario = (parseFloat(e.cantidad)) * (parseFloat(e.precioCompra))}
    </td>
    </tr>`;
        console.log(positionRows);
        positionRows++;

    });
}

//Evento para cambiar el color de la tabla cuando se da click sobre una fila al mismo tiempo captura el id del producto

tbodySolicitud.addEventListener('click', (e) => {
    logicaCambiarColores(e)
})

function logicaCambiarColores(e) {
    var backG, letras;
    if (idRow != "") {
        if ((idRow % 2 == 0)) {
            backG = "#ddd";
        } else {
            backG = "#fff";
        }
        letras = "black";
        cambiarColor(backG, letras)

        if (idRow == e.path[1].id) {
            equals = true;
        } else {
            selectedRow = (e.path[1].getAttribute("value"))
            idRow = (e.path[1].id)
            backG = "#369681";
            letras = "white";
        }
    } else {
        //e.path en la posicion 1 nos devolvera el id de la fila donde hicimos clic (el ID es el valor de la fila, valor que insertamos en la tabla)
        selectedRow = (e.path[1].getAttribute("value"))
        idRow = (e.path[1].id)
        backG = "#369681"
        letras = "white";
    }
    cambiarColor(backG, letras)
    console.log(selectedRow);
}

function cambiarColor(backG, letras) {
    row = document.getElementById(idRow)
    row.style.backgroundColor = backG;
    row.style.color = letras;
    if (equals == true) {
        selectedRow = "";
        idRow = "";
        equals = false;
    }
}

bEliminar.addEventListener('click', (e) => {
    var copiaArray = listaProductosSolicitados.slice();
    listaProductosSolicitados = [];
    for (let i = 0; i < copiaArray.length; i++) {
        if (idRow - 1 == i) {
            Toast.fire({
                icon: 'info',
                title: 'Se elimino el elemento: ' + (i + 1),
                background: 'FFFF',
                width: 420
            })
        } else {
            listaProductosSolicitados.push(copiaArray[i])
        }
    }
    llenarTabla();
})

bEditar.addEventListener('click', (e) => {
    if (idRow == "") {
        Toast.fire({
            icon: 'info',
            title: 'Seleccione el producto que quiere editar',
            background: 'FFFF',
            width: 420
        })
    } else {
        editar = true
        cargarDatosProductoEditar();
        document.getElementById("modal1").classList.add("is-visible");
    }
})

//Cargar datos del producto a editar

function cargarDatosProductoEditar() {
    for (let i = 0; i < listaProductosSolicitados.length; i++) {
        if (idRow - 1 == i) {
            inputPiezas.value = listaProductosSolicitados[i].piezas
            inputPaquetes.value = listaProductosSolicitados[i].paquetes
            inputPrecioCompra.value = listaProductosSolicitados[i].precioCompra;
        }
    }
}

//Editar productos en la lista

async function editarProductoLista() {
    for (let i = 0; i < listaProductosSolicitados.length; i++) {
        if (idRow - 1 == i) {
            console.log(listaProductosSolicitados[i]);
            listaProductosSolicitados[i].precioCompra = inputPrecioCompra.value;
            listaProductosSolicitados[i].piezas = piezas;
            listaProductosSolicitados[i].paquetes = paquetes;
            listaProductosSolicitados[i].cantidad = await obtenerCantidadTotal();
            Toast.fire({
                icon: 'info',
                title: 'Se edito el elemento: ' + (i + 1),
                background: 'FFFF',
                width: 420
            })
        }
    }
    llenarTabla();
    editar = false;
}

//Abrir modal 'Buscar' donde se muestra la tabla para seleccionar el producto que se desea agregar

bBuscar.addEventListener('click', (e) => {
    logicaTabla.getDataTable(altaBaja);
    logicaTabla.llenarTabla();
    document.getElementById("modal2").classList.add("is-visible");
})

tbody.addEventListener('click', (e) => {
    logicaTabla.logicaCambiarColores(e)
})

buscarProducto.addEventListener('click', (e) => {
    e.preventDefault();
    logicaTabla.filtrarTabla(e);
})

bSeleccionar.addEventListener('click', async (e) => {
    if (idRow == "") {
        Toast.fire({
            icon: 'info',
            title: 'Seleccione un producto',
            background: 'FFFF',
            width: 420
        })
    } else {
        idProducto = idRow
        const precio = await bdEntradasSalidas.ultimoRegistroPrecio(idProducto)
        document.querySelector(".modalBuscar.is-visible").classList.remove("is-visible");
        document.getElementById("modal1").classList.add("is-visible");
        if (precio.length == 0) {
            bEditarPrecioVenta.disabled = true;
            Toast.fire({
                icon: 'info',
                title: 'No a tenido entradas este producto',
                background: 'FFFF',
                width: 420
            })
        } else {
            inputPrecioCompra.value = precio.at(0).precioCompra;
        }
    }
})

//Finalizar solicitud

bFinalzar.addEventListener('click', (e) => {
    document.getElementById("modal3").classList.add("is-visible");
})