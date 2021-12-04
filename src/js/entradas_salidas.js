const inputcodigoBarras = document.getElementById("inputcodigoBarras");
const bdEntradasSalidas = require('../sql/bdEntradasSalidas');
const closeEls = document.querySelectorAll("[data-close]");
const logicaTabla = require('../js/tablaProductos');
const tbodySolicitud = document.getElementById('tbodySolicitud');
const tbody = document.getElementById('tbody');
const irUsuario = document.getElementById('irUsuario');
const img = document.getElementById('img')
const efecto = document.getElementById('imagenInput');


//inputs

const inputPiezas = document.getElementById('inputPiezas');
const inputPaquetes = document.getElementById('inputPaquetes');
const inputPrecioCompra = document.getElementById('inputPrecioCompra');
const sFiltrarPor = document.getElementById('filtrarPor');
const sOrdenar = document.getElementById('ordenar');

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

irUsuario.addEventListener('click',(e)=>{
    document.getElementById("modal4").classList.add("is-visible");
})

efecto.onmouseover = function (e) {
    img.style.transition = '.5s';
    img.style.transform = 'scale(1.1)';
}

efecto.onmouseout = function (e) {
    img.style.transform = 'scale(1)';
}

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

//Empleado

bEmpleados.addEventListener('click',(e)=>{
    document.getElementById("modal5").classList.add("is-visible");
})

//UsuarioEdit
bUsuarios.addEventListener('click',(e)=>{
    document.getElementById("modal6").classList.add("is-visible");
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

//obtener datos

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
            piezas : piezas,
            paquetes : paquetes,
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
    }else{
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

//Abrir modal

bBuscar.addEventListener('click', (e)=>{
    logicaTabla.getDataTable(altaBaja);
    logicaTabla.llenarTabla();
    document.getElementById("modal2").classList.add("is-visible");
})

tbody.addEventListener('click', (e) => {
    logicaTabla.logicaCambiarColores(e)
})

buscarProducto.addEventListener('click',(e)=>{
    e.preventDefault();
    logicaTabla.filtrarTabla(e);
})

bSeleccionar.addEventListener('click',async(e)=>{
    if (idRow=="") {
        Toast.fire({
            icon: 'info',
            title: 'Seleccione un producto',
            background: 'FFFF',
            width: 420
        })
    }else{
        idProducto=idRow
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

bFinalzar.addEventListener('click',(e)=>{
    document.getElementById("modal3").classList.add("is-visible");
})