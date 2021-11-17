const storage = require("./local");

const bdTabla = require('../sql/bdGestion');
const tbody = document.getElementById('tbody');
const openEls = document.querySelectorAll("[data-open]");
const closeEls = document.querySelectorAll("[data-close]");
const isVisible = "is-visible";
const bEliminar = document.getElementById('eliminar');
const bBajaProducto = document.getElementById('darDeBajaTemporal')
const inputfill = document.getElementById('inputfill');
const bBuscar = document.getElementById('buscar');
const sFiltrarPor = document.getElementById('filtrarPor');
const sOrdenar = document.getElementById('ordenar');
const bEditar = document.getElementById('editar');

let arrayDataTable = [];
let copyArrayDataTable = [];
var idRow = "";
var positionRows = 1;
var equals = false;

//Focus al input de los filtros al iniciar la pagina

inputfill.focus();

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

for (const el of closeEls) {
    el.addEventListener("click", function () {
        console.log(this.parentElement.classList);
        this.parentElement.classList.remove(isVisible);
    });
}



//Cargar tabla con la base de datos

document.addEventListener("DOMContentLoaded", (e) => {
    // Your code to run since DOM is loaded and ready
    getDataTable();
    llenarTabla();


    console.log(storage.getStorage("idProducto").id)
});

async function getDataTable() {
    arrayDataTable = [];
    copyArrayDataTable = [];
    const res = await bdTabla.getDataTable();
    console.log(res);
    res.forEach(e => {
        arrayDataTable.push(e);
        copyArrayDataTable.push(e)
    });

}

async function llenarTabla() {
    positionRows = 1
    tbody.innerHTML = ""; // reset data
    const res = await bdTabla.getDataTable();
    copyArrayDataTable.forEach((e) => {
        console.log("entro al for");
        console.log(e);
        tbody.innerHTML += `<tr id=${e.id} value=${positionRows}>
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
    ${e.precioventa}
    </td>
    <td>
    ${e.codigo}
    </td>
    <td>
    ${e.cantidad}
    </td>
    <td>
    ${totalMonetario = (parseFloat(e.cantidad)) * (parseFloat(e.precioventa))}
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
        if ((parseInt(row.getAttribute("value") % 2) == 0)) {
            backG = "#ddd";
        } else {
            backG = "#fff";
        }
        letras = "black";
        cambiarColor(backG, letras)

        if (idRow == e.path[1].id) {
            if ((parseInt(row.getAttribute("value") % 2) == 0)) {
                backG = "#ddd";
            } else {
                backG = "#fff";
            }
            letras = "black";
            equals = true;
        } else {
            idRow = (e.path[1].id)
            backG = "#369681";
            letras = "white";
        }


    } else {
        //e.path en la posicion 1 nos devolvera el id de la fila donde hicimos clic (el ID es el de la base de datos, valor que insertamos en la tabla)
        idRow = (e.path[1].id)
        backG = "#369681"
        letras = "white";
    }
    cambiarColor(backG, letras)
    console.log(idRow);
}

function cambiarColor(backG, letras) {
    row = document.getElementById(idRow)
    row.style.backgroundColor = backG;
    row.style.color = letras;
    if (equals == true) {
        idRow = "";
        equals = false;
    }
}


//Eliminar producto

bEliminar.addEventListener('click', (e) => {
    console.log("El id de la fila selecciona es: " + idRow);
    if (idRow == "") {
        Toast.fire({
            icon: 'info',
            title: 'Elige que producto quieres eliminar',
            background: 'FFFF',
            width: 420
        })
    } else {
        bdTabla.eliminarProducto(idRow);
        idRow = "";
        getDataTable();
        llenarTabla();
        document.querySelector(".modal.is-visible").classList.remove(isVisible);
    }

    inputfill.focus();
})

//Dar de baja producto

bBajaProducto.addEventListener('click', (e) => {
    if (idRow == "") {
        Toast.fire({
            icon: 'info',
            title: 'Elige que producto quieres dar de baja',
            background: 'FFFF',
            width: 450
        })
    } else {
        var baja = {
            altaBaja: false
        }
        const res = bdTabla.bajaProducto(baja, idRow);
        getDataTable();
        llenarTabla();
    }
})

//Buscar producto
async function ordenarPor() {
    var order = sFiltrarPor.value;
    var by = sOrdenar.value;
    arrayDataTable = (await bdTabla.getDataTableOrder(order, by)).slice();
}

bBuscar.addEventListener('click', (e) => {
    e.preventDefault();
    cadenaBusqueda = inputfill.value;
    copyArrayDataTable = [];


    arrayDataTable.forEach(e => {
        if (sFiltrarPor.value == "codigoBarras") {
            if ((e.codigo.indexOf(cadenaBusqueda)) != -1) {
                console.log("Se encontro una palabra");
                copyArrayDataTable.push(e)
            } else {
                console.log("No se encotro la palarba");
            }
        } else if (sFiltrarPor.value == "nombre") {
            if ((e.nombre.indexOf(cadenaBusqueda)) != -1) {
                console.log("Se encontro una palabra");
                copyArrayDataTable.push(e)
            } else {
                console.log("No se encotro la palarba");
            }

        } else if (sFiltrarPor.value == "marca") {
            if ((e.marca.indexOf(cadenaBusqueda)) != -1) {
                console.log("Se encontro una palabra");
                copyArrayDataTable.push(e)
            } else {
                console.log("No se encotro la palarba");
            }
        } else if (sFiltrarPor.value == "categoria") {
            if ((e.categoria.indexOf(cadenaBusqueda)) != -1) {
                console.log("Se encontro una palabra");
                copyArrayDataTable.push(e)
            } else {
                console.log("No se encotro la palarba");
            }
        }

    });
    ordenarPor();
    llenarTabla();
    inputfill.focus();
});

bEditar.addEventListener('click', e => {
    if (idRow == "") {
        Toast.fire({
            icon: 'info',
            title: 'Elige que producto quieres editar',
            background: 'FFFF',
            width: 420
        })
    } else {
        let idProducto = {
            id: idRow,
            editar: true
        }
        storage.setStorage("idProducto", idProducto)
        location.href = './nuevoProducto.html';
    }
})