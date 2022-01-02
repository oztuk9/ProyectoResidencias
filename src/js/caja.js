const inputcodigoBarras = document.getElementById("inputcodigoBarras");
const bdEntradasSalidas = require('../sql/bdEntradasSalidas');
const bdCaja = require('../sql/bdCaja');
const closeEls = document.querySelectorAll("[data-close]");
const logicaTabla = require('../js/tablaProductos');
const tbodySolicitud = document.getElementById('tbodySolicitud');
const tbody = document.getElementById('tbody');


//inputs

const sFiltrarPor = document.getElementById('filtrarPor');
const sOrdenar = document.getElementById('ordenar');
const inputEfectivo = document.getElementById('inputEfectivo');
const inputCantidad = document.getElementById('inputCantidad');
const checkBoxMultiplicar = document.getElementById('checkBoxMultiplicar');
const inputEfectivoCorte = document.getElementById('inputEfectivoCorte');

//botones

const bOk = document.getElementById('OK');
const bEliminar = document.getElementById('eliminar');
const bBuscar = document.getElementById('buscar');
const buscarProducto = document.getElementById('buscarProducto');
const bSeleccionar = document.getElementById('seleccionar');
const b500 = document.getElementById('500');
const b200 = document.getElementById('200');
const b100 = document.getElementById('100');
const b50 = document.getElementById('50');
const b20 = document.getElementById('20');
const btnCobrar = document.getElementById('btnCobrar');
const btnCorte = document.getElementById('btnCorte');
const btnSeleccionarUsuario = document.getElementById('btnSeleccionarUsuario');
const btnFinalizarCorte = document.getElementById('finalizarCorte');
const btnCancelarCorte = document.getElementById('cancelarCorte')

//Selects

const sEmpleadoSolicitud = document.getElementById('empleadoSolicitud');
const selectUsuarioCorte = document.getElementById('selectUsuarioCorte');

//Texto

const Ttotal = document.getElementById('total');
const Tefectivo = document.getElementById('efectivo');
const Tcambio = document.getElementById('cambio');
const TefectivoBaseDatos = document.getElementById('efectivoBaseDatos');
const TdiferenciaCorte = document.getElementById('diferenciaCorte');

//variables para almacenar datos dinamicos
var idProducto = "";
var listaProductosSolicitados = [];
var piezas = 1;
var idRow = "";
var selectedRow = "";
var positionRows = 1;
var altaBaja = true;
var multiplicar = false;
var total = 0;
var efectivo = 0;
let nuevaRuta = "";
var fechaHora = "";
var totalCorte = 0;
var efectivoCaja = 0;
var diferencia = 0;
var idUsuarioCorte = 0;
var ultimaVenta = 0;

//Con esto agregamos la ruta y agregamos dos slash invertidos para que asi pueda ser leida la ruta para imprimir la imagen del negocio
for (let i = 0; i < __dirname.length; i++) {
    if (__dirname.charAt(i) == "\\") {
        nuevaRuta = nuevaRuta + "\\"
    }
    nuevaRuta = nuevaRuta + __dirname.charAt(i)
}
console.log(nuevaRuta);

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

//Evento para validar la multiplicacion de productos

checkBoxMultiplicar.addEventListener('click', () => {
    checkBoxMultiplicar.checked ? inputCantidad.disabled = false : inputCantidad.disabled = true;
    checkBoxMultiplicar.checked ? multiplicar = true : multiplicar = false;
    if (multiplicar == false) {
        inputCantidad.value = "";
    }
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
            if (multiplicar == true) {
                if (inputCantidad.value.length != 0) {
                    piezas = piezas * parseInt(inputCantidad.value);
                }
            }
            const result = await bdCaja.datosProducto(idProducto);
            const solicitudProductos = {
                imagen: result.at(0).imagen,
                nombre: result.at(0).nombre,
                precioVenta: result.at(0).precioVenta,
                cantidad: piezas,
                idProducto: idProducto
            }
            listaProductosSolicitados.push(solicitudProductos)
            inputCantidad.value = "";
            checkBoxMultiplicar.checked = false;
            inputCantidad.disabled = true;
            multiplicar = false;
            piezas = 1;
            totalCuenta();
            llenarTabla();

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


//Llenar tabla con los productos solicitados

async function llenarTabla() {
    idRow = "";
    positionRows = 1
    tbodySolicitud.innerHTML = ""; // reset data
    listaProductosSolicitados.forEach((e) => {

        tbodySolicitud.innerHTML += `<tr id=${"Caja"+positionRows} value=${e.idAlmacen}>
    <td>
        <img class="tbImagen" src="${e.imagen}"/>
    </td>
    <td>
        ${e.nombre}
    </td>
    <td>
    ${e.precioVenta}
    </td>
    <td>
    ${e.cantidad}
    </td>
    <td>
    ${totalMonetario = (parseFloat(e.cantidad)) * (parseFloat(e.precioVenta))}
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
        if ((parseInt(idRow.substring(4)) % 2 == 0)) {
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
    console.log(idRow.substring(4));
    for (let i = 0; i < copiaArray.length; i++) {
        if (parseInt(idRow.substring(4)) - 1 == i) {
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
    totalCuenta();
})

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
        if (multiplicar == true) {
            if (inputCantidad.value.length != 0) {
                piezas = piezas * parseInt(inputCantidad.value);
            }
        }
        const result = await bdCaja.datosProducto(idProducto);
        const solicitudProductos = {
            imagen: result.at(0).imagen,
            nombre: result.at(0).nombre,
            precioVenta: result.at(0).precioVenta,
            cantidad: piezas,
            idProducto: idProducto
        }
        listaProductosSolicitados.push(solicitudProductos)
        inputCantidad.value = "";
        checkBoxMultiplicar.checked = false;
        inputCantidad.disabled = true;
        multiplicar = false;
        piezas = 1;
        totalCuenta();
        llenarTabla();

    }
})
//Colocar efectivo con botones

b500.addEventListener('click', () => {
    inputEfectivo.value = "500";
    modificarEfectivo()
})

b200.addEventListener('click', () => {
    inputEfectivo.value = "200";
    modificarEfectivo()
})

b100.addEventListener('click', () => {
    inputEfectivo.value = "100";
    modificarEfectivo()
})

b50.addEventListener('click', () => {
    inputEfectivo.value = "50";
    modificarEfectivo()
})

b20.addEventListener('click', () => {
    inputEfectivo.value = "20";
    modificarEfectivo();
})

inputEfectivo.addEventListener('keyup', () => {
    var efectivoValido = "";
    for (let i = 0; i < inputEfectivo.value.length; i++) {
        if (inputEfectivo.value.charAt(i) != "-" || inputEfectivo.value.charAt(i) != "e") {
            efectivoValido = efectivoValido + inputEfectivo.value.charAt(i)
        }
    }
    inputEfectivo.value = efectivoValido;
    modificarEfectivo();
})

//Modificar el total monetario de la cuenta

function totalCuenta() {
    total = 0;
    listaProductosSolicitados.forEach(e => {
        totalMonetario = (parseFloat(e.cantidad)) * (parseFloat(e.precioVenta))
        total = total + totalMonetario
    });
    Ttotal.innerHTML = "TOTAL:$" + total;
    modificarCambio()
}

function modificarEfectivo() {
    if (inputEfectivo.value.length == 0) {
        efectivo = 0;
    } else {
        efectivo = inputEfectivo.value;
    }
    Tefectivo.innerHTML = "EFECTIVO:$" + efectivo
    modificarCambio()
}


function modificarCambio() {
    Tcambio.innerHTML = "CAMBIO:$" + (parseFloat(efectivo) - parseFloat(total)).toFixed(2)
}

//Finalizar compra

btnCobrar.addEventListener('click', () => {
    if (listaProductosSolicitados.length == 0) {
        Toast.fire({
            icon: 'info',
            title: 'No hay ningun producto en la solicitud',
            background: 'FFFF',
            width: 420
        })
    } else {
        validarSolicitud();
    }
})

function insertarPedidoVentas() {
    let datos = {
        TotalDinero: total,
        ID_Usuario: ID_Usuario
    }
    bdCaja.insertarPedidoVentas(datos)
}

async function insertarDetallePedidoVentas() {
    console.log("Entro a la funcion para insertar detalle pedido ventas");
    var idPedidoVentas = await bdCaja.obtenerUltimoIdPedidoVentas();
    fechaHora = idPedidoVentas.at(0).tiempo.toString().substring(4, 24);
    console.log(listaProductosSolicitados);
    for (let i = 0; i < listaProductosSolicitados.length; i++) {
        let detallePedidoVentas = {
            cantidad: listaProductosSolicitados[i].cantidad,
            precioVenta: listaProductosSolicitados[i].precioVenta,
            total: (parseFloat(listaProductosSolicitados[i].cantidad)) * (parseFloat(listaProductosSolicitados[i].precioVenta)),
            ID_PedidoVentas: idPedidoVentas.at(0).id,
            ID_Productos: listaProductosSolicitados[i].idProducto
        }
        console.log(detallePedidoVentas);
        bdCaja.insertarDetallePedidoVentas(detallePedidoVentas)
    }
    imprimirTicket()
    listaProductosSolicitados = [];
    llenarTabla();
    inputEfectivo.value = "";
    totalCuenta();
    modificarEfectivo();
    modificarCambio()
}


async function validarSolicitud() {
    var cantidadSuperior = false
    var productosExeden = "";

    for (let i = 0; i < listaProductosSolicitados.length; i++) {
        var cantidadFinal = 0;
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
        } else {
            cantidadFinal = parseInt(cantidadAlmacen.at(0).cantidad) - parseInt(listaProductosSolicitados[i].cantidad)
            console.log(cantidadFinal);
            var actualizarAlmacen = {
                cantidad: cantidadFinal
            }
            bdCaja.actualizarAlmacen(actualizarAlmacen, listaProductosSolicitados[i].idProducto)
        }
    }
    if (cantidadSuperior == false) {
        if ((efectivo - total) >= 0) {
            insertarPedidoVentas();
            insertarDetallePedidoVentas();
            Toast.fire({
                icon: 'success',
                title: 'Cobrado con exito',
                background: 'FFFF',
                width: 420
            })
        } else {
            Toast.fire({
                icon: 'error',
                title: 'Efectivo insuficiente',
                background: 'FFFF',
                width: 420
            })
        }

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
    //la impresora puede imprimir 48 caracteres en un renglon antes de hacer salto de linea
    let lineaDivisora = "================================================\n";
    let nombreRestaurant = "El Mitote";
    let calle = "Calle Gobernador Medina Ascencio 556 Centro, 47180 Arandas, Jalisco";
    let telefono = "3487832388"
    let encabezadoTabla = "Producto        Cantidad    Precio   Total     "
    console.log(lineaDivisora);
    console.log(encabezadoTabla);

    const conector = new ConectorPlugin()
        .cortar()
        .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
        .imagenLocal(nuevaRuta + "\\image\\El mitote Logotipo redimencionada.jpg")
        .texto("================================================\n")
        .texto(nombreRestaurant + "\n")
        .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
        .textoConAcentos("Ubicación: " + calle + "\n")
        .texto("Telefono: " + telefono + "\n")
        .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
        .texto("================================================\n")
        .texto("Fecha y hora: " + fechaHora + "\n")
        .texto("Lo atendio: " + usuario.at(0).nombre + "\n")
        .texto("================================================\n")
        .establecerTamanioFuente(3, 3)
        .texto("============\n")
        .texto("CUENTA\n")
        .texto("============\n")
        .establecerTamanioFuente(1, 1)
        .texto("================================================\n")
        .texto(encabezadoTabla + "\n")
        .texto("================================================\n")
    listaProductosSolicitados.forEach(e => {
        let rowProducto = ""
        agregarEspacios(e.nombre, "Producto")
        rowProducto = rowProducto + palabraMoldeada;
        agregarEspacios(e.cantidad, "Cantidad")
        rowProducto = rowProducto + palabraMoldeada;
        agregarEspacios(e.precioVenta, "Precio")
        rowProducto = rowProducto + palabraMoldeada;
        agregarEspacios(e.cantidad * e.precioVenta, "Total")
        rowProducto = rowProducto + palabraMoldeada;
        console.log(rowProducto);
        conector
            .establecerTamanioFuente(1, 1)
            .textoConAcentos(rowProducto + "\n")
    });
    console.log("Total: $" + total);
    console.log("Efectivo: $" + efectivo);
    console.log("Cambio: $" + (efectivo - total));
    console.log(fechaHora);
    console.log("Lo atendio: " + usuario.at(0).nombre);
    conector
        .texto("================================================\n")
        .establecerTamanioFuente(2, 2)
        .feed(1)
        .texto("========================\n")
        .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
        .texto("Total: $" + total + "\n")
        .texto("Efectivo: $" + efectivo + "\n")
        .texto("Cambio: $" + (efectivo - total) + "\n")
        .texto("========================\n")
        .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
        .texto("Gracias por su compra\n")
        .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
        .texto("========================\n")
        .establecerTamanioFuente(1, 1)
        .qrComoImagen("https://www.facebook.com/ElMitoteArandas")
        .abrirCajon()
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
}

function agregarEspacios(palabra, tipoPalabra) {
    palabraMoldeada = "";
    palabra = palabra + "";
    let sizeLetra;
    switch (tipoPalabra) {
        case 'Producto':
            sizeLetra = 16;
            break;
        case 'Cantidad':
            sizeLetra = 12;
            break;
        case 'Precio':
            sizeLetra = 9;
            break;
        case 'Total':
            sizeLetra = 10;
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

btnCorte.addEventListener('click',()=>{
    document.getElementById("modal7").classList.add("is-visible");
    cargarUsuariosCorte();
})

async function cargarUsuariosCorte() {
    selectUsuarioCorte.innerHTML="";
    let result = await bdUsuarios.selectUsuarios();
    objeto = document.createElement('option')
    objeto.value = 0
    objeto.text = ""
    selectUsuarioCorte.appendChild(objeto);
    for (let i = 0; i < result.length; i++) {
        if (result[i].id!=1) {
        objeto = document.createElement('option')
        objeto.value = result[i].id
        objeto.text = result[i].nombre
        selectUsuarioCorte.appendChild(objeto);
        }
    }
}

btnSeleccionarUsuario.addEventListener('click',async ()=>{
    idUsuarioCorte = selectUsuarioCorte.value;
    ultimoCorte =  await bdCaja.ultimoCorte(idUsuarioCorte);
    obtenerUltimaVenta = await bdCaja.obtenerUltimaVenta(idUsuarioCorte);
    ultimaVenta = obtenerUltimaVenta.at(0).id
    console.log(ultimoCorte.at(0).id);
    if (ultimoCorte.length==0) {
        sinCorte = await bdCaja.sinCorte(idUsuarioCorte)
        totalCorte=sinCorte.at(0).TotalDinero;
    }else{
        console.log(ultimaVenta);
        console.log(ultimoCorte.at(0).id);
        if (ultimaVenta>ultimoCorte.at(0).id) {
            inicioVenta = parseInt(ultimoCorte.at(0).id)+1;
            conCorte = await bdCaja.conCorte(inicioVenta,ultimaVenta,idUsuarioCorte)
            totalCorte=conCorte.at(0).TotalDinero;
            console.log(ultimoCorte.length );
        }
    }
    TefectivoBaseDatos.innerHTML = "$"+totalCorte;
})

inputEfectivoCorte.addEventListener('keyup',()=>{
    efectivoCaja = inputEfectivoCorte.value;
    diferencia = efectivoCaja-totalCorte;
    TdiferenciaCorte.innerHTML = "$"+diferencia.toFixed(2)
})

btnFinalizarCorte.addEventListener('click',()=>{
    datos ={
        esperadoCaja: totalCorte,
        efectivoCaja: efectivoCaja,
        diferencia: diferencia,
        IDUsuarioCorte: idUsuarioCorte,
        IDUsuarioAdmin: usuario.at(0).id
    }
    corte = {
        corte: true
    }
    bdCaja.insertarCortes(datos);
    bdCaja.actualizarPedidoVentas(corte,ultimaVenta);
    esperadoCaja = 0;
    efectivoCaja = 0;
    diferencia = 0;
    TdiferenciaCorte.innerHTML = "$0"
    TefectivoBaseDatos.innerHTML = "$0"
    inputEfectivoCorte.value=""
    document.querySelector(".modalCorteCaja.is-visible").classList.remove("is-visible");
    Toast.fire({
        icon: 'info',
        title: 'Corte realizado',
        background: 'FFFF',
        width: 420
    })
})

btnCancelarCorte.addEventListener('click',()=>{
    document.querySelector(".modalCorteCaja.is-visible").classList.remove("is-visible");
    esperadoCaja = 0;
    efectivoCaja = 0;
    diferencia = 0;
    TdiferenciaCorte.innerHTML = "$0"
    TefectivoBaseDatos.innerHTML = "$0"
    inputEfectivoCorte.value=""
})