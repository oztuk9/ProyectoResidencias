const inputcodigoBarras = document.getElementById("inputcodigoBarras");
const bdEntradasSalidas = require('../sql/bdEntradasSalidas');
const closeEls = document.querySelectorAll("[data-close]");
const logicaTabla = require('../js/tablaProductos');
const tbodySolicitud = document.getElementById('tbodySolicitud');
const tbody = document.getElementById('tbody');


//inputs

const inputPiezas = document.getElementById('inputPiezas');
const inputPaquetes = document.getElementById('inputPaquetes');
const inputPrecioCompra = document.getElementById('inputPrecioCompra');
const sFiltrarPor = document.getElementById('filtrarPor');
const sOrdenar = document.getElementById('ordenar');
const checkBoxEntradaSalida = document.getElementById('checkBoxEntradaSalida');
const checkboxEditar = document.getElementById('checkboxEditar');

//botones

const bOk = document.getElementById('OK');
const bEliminar = document.getElementById('eliminar');
const bEditar = document.getElementById('editar');
const bEditarPrecioVenta = document.getElementsByClassName('editarPrecioVenta');
const bBuscar = document.getElementById('buscar');
const buscarProducto = document.getElementById('buscarProducto');
const bSeleccionar = document.getElementById('seleccionar');
const bFinalizar = document.getElementById('finalizar');
const bfinalizarSolicitud = document.getElementById('finalizarSolicitud');

//Selects

const sEmpleadoSolicitud = document.getElementById('empleadoSolicitud')

//variables para almacenar datos dinamicos
var idProducto = "";
var listaProductosSolicitados = [];
var piezas = "";
var paquetes = "";
var idRow = "";
var selectedRow = "";
var positionRows = 1;
var editar = false;
var altaBaja = true;
var checkInOut = true;


const checkBox = document.getElementById('checkboxEditar');
checkBox.addEventListener('click', (e) => {
    checkBox.checked ? inputPrecioCompra.disabled = false : inputPrecioCompra.disabled = true;
})

inputcodigoBarras.focus();

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
        this.parentElement.classList.remove("is-visible");
        editar = false;
        inputPiezas.value = "";
        inputPaquetes.value = "";
        inputPrecioCompra.value = "";
        inputPrecioCompra.disabled = true;
        checkboxEditar.checked = false;
    });
}

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
        } else if (consultaIdProducto.at(0).AltaBaja != false) {
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
        } else {
            Toast.fire({
                icon: 'info',
                title: 'El producto esta dado de baja',
                background: 'FFFF',
                width: 420
            })
        }
        inputcodigoBarras.value = "";
    }
})


//Agregar producto a la solicitud

bOk.addEventListener('click', (e) => {
    validarEspaciosSolicitud();
    inputPrecioCompra.disabled = true;
    checkboxEditar.checked = false;
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
        paquetes = parseInt(paquetes) * parseInt(result.at(0).cantidadPorPaquete);
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
        const solicitudProductos = {
            imagen: result.at(0).imagen,
            nombre: result.at(0).nombre,
            precioCompra: inputPrecioCompra.value,
            piezas: parseInt(piezas),
            paquetes: parseInt(paquetes),
            cantidad: await obtenerCantidadTotal(),
            idProducto: idProducto
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

        tbodySolicitud.innerHTML += `<tr id=${"ES" + positionRows} value=${e.idAlmacen}>
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
        if ((parseInt(idRow.substring(2)) % 2 == 0)) {
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
        if (parseInt(idRow.substring(2)) - 1 == i) {
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
    if (parseInt(idRow.substring(2)) == "") {
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
        if (parseInt(idRow.substring(2)) - 1 == i) {
            inputPiezas.value = listaProductosSolicitados[i].piezas
            inputPaquetes.value = listaProductosSolicitados[i].paquetes
            inputPrecioCompra.value = listaProductosSolicitados[i].precioCompra;
        }
    }
}

//Editar productos en la lista

async function editarProductoLista() {
    for (let i = 0; i < listaProductosSolicitados.length; i++) {
        if (parseInt(idRow.substring(2)) - 1 == i) {
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

bFinalizar.addEventListener('click', (e) => {
    if (listaProductosSolicitados.length == 0) {
        Toast.fire({
            icon: 'info',
            title: 'No hay ningun producto en la solicitud',
            background: 'FFFF',
            width: 420
        })
    } else {
        console.log(listaProductosSolicitados);
        cargarEmpleadoSolicitud()
        document.getElementById("modal3").classList.add("is-visible");
    }
})

//Cambiar color de las letras cuando cambie el checkBox

checkBoxEntradaSalida.addEventListener('change', (e) => {
    let letrasSalida = document.getElementById('letrasSalida');
    let letrasEntrada = document.getElementById('letrasEntrada');
    if (checkInOut == true) {
        letrasSalida.style.color = "#bb0000";
        letrasEntrada.style.color = "black";
    } else {
        letrasEntrada.style.color = "#236e25";
        letrasSalida.style.color = "black";
    }
    checkInOut ? checkInOut = false : checkInOut = true;
})

//llenar select empleado en la finalizacion de pedido

async function cargarEmpleadoSolicitud() {
    try {
        const result = await bdEmpleado.mostrarEmpleados();
        sEmpleadoSolicitud.innerHTML = "";
        objeto = document.createElement('option')
        objeto.value = 0
        objeto.text = ""
        sEmpleadoSolicitud.appendChild(objeto);
        for (let i = 0; i < result.length; i++) {
            objeto = document.createElement('option')
            objeto.value = result[i].id
            objeto.text = result[i].nombre
            sEmpleadoSolicitud.appendChild(objeto);
        }
    } catch (error) {
    }
}

//Finalizar solicitud

bfinalizarSolicitud.addEventListener('click', (e) => {
    if (sEmpleadoSolicitud.value == 0) {
        Toast.fire({
            icon: 'info',
            title: 'Seleccione quien pide la solicitud',
            background: 'FFFF',
            width: 420
        })
    } else {
        if (checkBoxEntradaSalida.checked) {
            validacionSolicitudSalida();
        } else {
            pedidoAlmacen();
            detallePedidoAlmacen();
            imprimirTicket();
        }
        document.querySelector(".modalFinalizar.is-visible").classList.remove("is-visible");
    }
})

//Ingresar pedido en la base de datos

function pedidoAlmacen() {
    let totalDinero = 0;
    for (let i = 0; i < listaProductosSolicitados.length; i++) {
        totalDinero = listaProductosSolicitados[i].totalMonetario = (parseFloat(listaProductosSolicitados[i].cantidad)) * (parseFloat(listaProductosSolicitados[i].precioCompra)) + totalDinero;
    }
    let pedidoAlmacen = {
        tipo: checkInOut,
        totalDinero: totalDinero,
        ID_Usuario: ID_Usuario,
        ID_Trabajador: sEmpleadoSolicitud.value
    }
    bdEntradasSalidas.insertarPedidoAlmacen(pedidoAlmacen);
}

async function detallePedidoAlmacen() {
    let idAlmacen = await bdEntradasSalidas.obtenerUltimoIdPedidoAlmacen();
    for (let i = 0; i < listaProductosSolicitados.length; i++) {
        let detallePedidoAlmacen = {
            cantidad: listaProductosSolicitados[i].cantidad,
            precioCompra: listaProductosSolicitados[i].precioCompra,
            total: (parseFloat(listaProductosSolicitados[i].cantidad)) * (parseFloat(listaProductosSolicitados[i].precioCompra)),
            ID_PedidoAlmacen: parseInt(idAlmacen[0].id),
            ID_Productos: listaProductosSolicitados[i].idProducto
        }

        //Operacion para modificar la cantidad en almacen

        var cantidadSolicitada = listaProductosSolicitados[i].cantidad;
        var cantidadAlmacen = await bdEntradasSalidas.cantidadAlmacen(parseInt(listaProductosSolicitados[i].idProducto));
        var cantidadFinal = 0;
        console.log(cantidadAlmacen);
        if (checkBoxEntradaSalida.checked) {
            cantidadFinal = parseInt(cantidadAlmacen.at(0).cantidad) - parseInt(cantidadSolicitada);
        } else {
            cantidadFinal = parseInt(cantidadAlmacen.at(0).cantidad) + parseInt(cantidadSolicitada);
        }
        console.log(listaProductosSolicitados[i].nombre + ": " + cantidadFinal);
        var actualizarAlmacen = {
            cantidad: cantidadFinal
        }
        console.log(cantidadAlmacen.at(0).cantidad);
        console.log(cantidadSolicitada);
        bdEntradasSalidas.actualizarAlmacen(actualizarAlmacen, listaProductosSolicitados[i].idProducto);
        bdEntradasSalidas.insertarDetallePedidoAlmacen(detallePedidoAlmacen);
    }
}


//Comprobar que el producto solicitado en caso de ser SALIDA no sea mayor a la cantidad existente en el almacen
async function validacionSolicitudSalida() {
    console.log("Entro a la funcion validar Salida");
    cantidadSuperior = false
    var productosExeden = "";
    for (let i = 0; i < listaProductosSolicitados.length; i++) {
        var idProducto = listaProductosSolicitados[i].idProducto;
        var cantidadAlmacen = await bdEntradasSalidas.cantidadAlmacen(idProducto);
        console.log("ID producto");
        console.log("Cantidad solicitada: " + listaProductosSolicitados[i].cantidad);
        console.log("Cantidad almacenada: " + cantidadAlmacen.at(0).cantidad);

        if ((parseInt(listaProductosSolicitados[i].cantidad)) > (parseInt(cantidadAlmacen.at(0).cantidad))) {
            cantidadSuperior = true
            if (i == 0) {
                productosExeden = listaProductosSolicitados[i].nombre;
            } else {
                productosExeden = productosExeden + ", " + listaProductosSolicitados[i].nombre;
            }
        }
    }

    if (cantidadSuperior == false) {
        pedidoAlmacen();
        detallePedidoAlmacen();
        imprimirTicket();
    } else {
        Toast.fire({
            icon: 'error',
            title: 'Algunos de los productos que desea solicitar exceden la cantiad de existencias en almacen. \nLos productos son:' + productosExeden,
            background: 'FFFF',
            width: 600,
            timer: 6000,
        })
    }
}

async function imprimirTicket() {
    let totalProductosSolicitados = 0;
    let idP = await bdEntradasSalidas.obtenerUltimoIdPedidoAlmacen();
    console.log(idP.at(0).id);
    const result = await bdEntradasSalidas.datosProducto(idProducto);
    tipoSolicitud = "";
    checkInOut ? tipoSolicitud = "Entrada" : tipoSolicitud = "Salida";
    empeladoNombre = sEmpleadoSolicitud.options[sEmpleadoSolicitud.selectedIndex].text;
    areaEmpeado = await bdEntradasSalidas.areaEmpleado(sEmpleadoSolicitud.value)
    console.log(areaEmpeado.at(0).nombre);
    let encabezadoTabla = "Producto        Paquetes  Piezas   Total      "
    //la impresora puede imprimir 48 caracteres en un renglon antes de hacer salto de linea
    const conector = new ConectorPlugin()
        .cortar()
        .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
        .establecerTamanioFuente(2, 2)
        .texto("========================\n")
        .texto("ENTRADAS Y SALIDAS\n")
        .texto("========================\n")
        .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
        .establecerTamanioFuente(1, 1)
        .texto("Tipo: " + tipoSolicitud + "\n")
        .texto("No.Solicitud: " + idP.at(0).id + "\n")
        .texto("Solicita: " + empeladoNombre + " del area de: " + areaEmpeado.at(0).nombre + "\n")
        .texto("Autorizo: " + usuario.at(0).nombre + "\n")
        .texto("================================================\n")
        .texto(encabezadoTabla + "\n")
        .texto("================================================\n")
    listaProductosSolicitados.forEach(e => {
        if (isNaN(e.paquetes)) {
            paquetes = 0;
        } else {
            paquetes = e.paquetes;
        }
        if (isNaN(e.piezas)) {
            piezas = 0;
        } else {
            piezas = parseInt(e.piezas);
        }
        let totalProductos = piezas + parseInt(e.paquetes) * parseInt(result.at(0).cantidadPorPaquete);
        totalProductosSolicitados = totalProductosSolicitados + totalProductos;
        let rowProducto = ""
        agregarEspacios(e.nombre, "Producto")
        rowProducto = rowProducto + palabraMoldeada;
        agregarEspacios(paquetes, "Paquetes")
        rowProducto = rowProducto + palabraMoldeada;
        agregarEspacios(piezas, "Piezas")
        rowProducto = rowProducto + palabraMoldeada;
        agregarEspacios(totalProductos, "Total")
        rowProducto = rowProducto + palabraMoldeada;
        console.log(rowProducto);
        conector
            .establecerTamanioFuente(1, 1)
            .textoConAcentos(rowProducto + "\n")
    });
    conector
        .texto("================================================\n")
        .establecerTamanioFuente(2, 2)
        .establecerJustificacion(ConectorPlugin.Constantes.AlineacionDerecha)
        .texto("Total: " + totalProductosSolicitados + "\n")
        .establecerTamanioFuente(1, 1)
        .cortar();
    if (localStorage.getItem("impresora") === null) {
        Toast.fire({
            icon: 'info',
            title: 'No se a configurado correctamente la impresora',
            background: 'FFFF',
            width: 420
        })
    } else {
        if ((storage.getStorage("impresora").estado) == true) {
            let nombreImpresora = storage.getStorage("impresora").nombre
            console.log(nombreImpresora);
            const respuestaAlImprimir = await conector.imprimirEn(nombreImpresora);
        } else {
            Toast.fire({
                icon: 'info',
                title: 'No se a configurado correctamente la impresora',
                background: 'FFFF',
                width: 420
            })
        }
    }
    listaProductosSolicitados = [];
    llenarTabla();
    Toast.fire({
        icon: 'success',
        title: 'Se a realizado la solicitud con exito',
        background: 'FFFF',
        width: 420
    })
}

function agregarEspacios(palabra, tipoPalabra) {
    palabraMoldeada = "";
    palabra = palabra + "";
    let sizeLetra;
    switch (tipoPalabra) {
        case 'Producto':
            sizeLetra = 16;
            break;
        case 'Paquetes':
            sizeLetra = 10;
            break;
        case 'Piezas':
            sizeLetra = 9;
            break;
        case 'Total':
            sizeLetra = 11;
            break;
    }

    if (palabra.length < sizeLetra) {
        contador = sizeLetra - palabra.length;
        for (let i = 0; i < contador; i++) {
            palabra = palabra + " ";
        }
        palabraMoldeada = palabra
    } else if (palabra.length >= sizeLetra) {
        for (let i = 0; i < sizeLetra - 1; i++) {
            palabraMoldeada = palabraMoldeada + palabra.charAt(i)
        }
        palabraMoldeada = palabraMoldeada + " ";
    }
}