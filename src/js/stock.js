const closeEls = document.querySelectorAll("[data-close]");
const openEls = document.querySelectorAll("[data-open]");
const logicaTabla = require('../js/tablaProductos');
const tbodySolicitud = document.getElementById('tbodySolicitud');
const tbody = document.getElementById('tbody');
const bdStock = require('../sql/bdStock')

//muchas de las variables no se usan en este script pero otro script si las usa, como local storage que se usa desde perfil_area_empleado, esto se hizo asi con la dinalidad de no tener problemas con variables duplicadas o variables en otro script que no quedan bien tenerlas ahí.

//inputs
const inputfill = document.getElementById('inputfill');

//botones

const bBuscar = document.getElementById('buscar')

//selects
const sFiltrarPor = document.getElementById('filtrarPor');
const sOrdenar = document.getElementById('ordenar');

const storage = require("../js/local");

let arrayStock = [];
let copiaArrayStock = [];

document.addEventListener("DOMContentLoaded", (e) => {
    // Your code to run since DOM is loaded and ready
    obtenerDatosStock();
    filtrarTabla()
});

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


//Funciones que abren y cierran cualquier modal

for (const el of openEls) {
    el.addEventListener("click", function () {
        const modalId = this.dataset.open;
        document.getElementById(modalId).classList.add(isVisible);
    });
}

//Cerrar modal con atributo data-close
for (const el of closeEls) {
    el.addEventListener("click", function () {
        console.log(this.parentElement.classList);
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

bBuscar.addEventListener('click',(e)=>{
    filtrarTabla();
})

//obtener productos stock

async function obtenerDatosStock(){
   let datosStock = await bdStock.getDataTable();
   datosStock.forEach(e => {
       arrayStock.push(e)
       copiaArrayStock.push(e)
   });
}

async function llenarTablaStock() {
    idRow = "";
    positionRows = 1
    tbodySolicitud.innerHTML = ""; // reset data
    let datosStock = await bdStock.getDataTable();
    copiaArrayStock.forEach((e) => {
        tbodySolicitud.innerHTML += `<tr id=${positionRows} value=${e.idAlmacen}>
    <td>
        <img class="tbImagen" src="${e.imagen}"/>
    </td>
    <td>
        ${e.nombre}
    </td>
    <td>
    ${e.marca}
    </td>
    <td>
    ${e.categoria}
    </td>
    <td>
    ${e.cantidad}
    </td>
    <td>
    ${e.minimo}
    </td>
    <td>
    ${e.maximo}
    </td>
    </tr>`;
        positionRows++;

    });
}



//Buscar producto
async function ordenarPor() {
    var order = sFiltrarPor.value;
    var by = sOrdenar.value;
    arrayStock = (await bdStock.getDataTableOrder(order,by)).slice();
}

async function filtrarTabla(){
    cadenaBusqueda = inputfill.value;
    copiaArrayStock = [];
    arrayStock.forEach(e => {
        console.log(e.codigo.indexOf(cadenaBusqueda))
        if (sFiltrarPor.value == "codigoBarras") {
            if ((e.codigo.indexOf(cadenaBusqueda)) != -1) {
                console.log("Se encontro una palabra");
                copiaArrayStock.push(e)
            } else {
                console.log("No se encotro la palarba");
            }
        } else if (sFiltrarPor.value == "nombre") {
            if ((e.nombre.indexOf(cadenaBusqueda)) != -1) {
                console.log("Se encontro una palabra");
                copiaArrayStock.push(e)
            } else {
                console.log("No se encotro la palarba");
            }
        } else if (sFiltrarPor.value == "marca") {
            if ((e.marca.indexOf(cadenaBusqueda)) != -1) {
                console.log("Se encontro una palabra");
                copiaArrayStock.push(e)
            } else {
                console.log("No se encotro la palarba");
            }
        } else if (sFiltrarPor.value == "categoria") {
            if ((e.categoria.indexOf(cadenaBusqueda)) != -1) {
                console.log("Se encontro una palabra");
                copiaArrayStock.push(e)
            } else {
                console.log("No se encotro la palarba");
            }
        }

    });
    ordenarPor();
    llenarTablaStock();
    inputfill.focus();
}