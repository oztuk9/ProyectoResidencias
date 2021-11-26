const inputcodigoBarras = document.getElementById("inputcodigoBarras");
const bdEntradasSalidas = require('../sql/bdEntradasSalidas')
const closeEls = document.querySelectorAll("[data-close]");

//inputs

const inputPiezas = document.getElementById('inputPiezas');
const inputPaquetes = document.getElementById('inputPaquetes');
const inputPrecioCompra = document.getElementById('inputPrecioCompra');

//botones

const bOk = document.getElementById('OK');
const editarPrecioVenta = document.getElementsByClassName('editarPrecioVenta')

//variables para almacenar datos dinamicos
let idProducto = "";
let listaProductosSolicitados = [];
var idRow = "";
var selectedRow="";
var positionRows = 1;
var equals = false;

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
    });
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
                editarPrecioVenta.disabled = true;
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
    const piezas = inputPiezas.value
    const paquetes = inputPaquetes.value
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
                agregarSolicitudProductoArray(piezas, paquetes)
            }
        }
    }
}

async function agregarSolicitudProductoArray(piezas, paquetes) {
    const result = await bdEntradasSalidas.datosProducto(idProducto);
    console.log(result);
    if (paquetes == "") {
        paquetes = 0;
    } else {
        paquetes = paquetes * parseInt(result.at(0).cantidadPorPaquete);
    }
    if (piezas == "") {
        piezas = 0;
    }
    var cantidad = piezas + paquetes;
    console.log(result);
    const solicitudProductos = {
        idProducto: idProducto,
        imagen: result.at(0).imagen,
        nombre: result.at(0).nombre,
        precioCompra: inputPrecioCompra.value,
        cantidad: cantidad,
        idAlmacen: idProducto
    }
    listaProductosSolicitados.push(solicitudProductos)
    inputPiezas.value="";
    inputPaquetes.value="";
    inputPrecioCompra.value="";
    llenarTabla()
}

//Llenar tabla con los productos solicitados

async function llenarTabla() {
    idRow = "";
    positionRows = 1
    tbody.innerHTML = ""; // reset data
    listaProductosSolicitados.forEach((e) => {
        console.log("entro al for");
        console.log(e);
        tbody.innerHTML += `<tr id=${positionRows} value=${e.idProducto}>
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

tbody.addEventListener('click', (e) => {
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
        //e.path en la posicion 1 nos devolvera el id de la fila donde hicimos clic (el ID es el de la base de datos, valor que insertamos en la tabla)
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