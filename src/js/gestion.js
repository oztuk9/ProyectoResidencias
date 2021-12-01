const storage = require('../js/local');
const bdTabla = require('../sql/bdGestion');
const logicaTabla = require('../js/tablaProductos')
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
const bAccederProductosBaja = document.getElementById('botonProductosBaja')
let arrayDataTable = [];
let copyArrayDataTable = [];
let altaBaja = true;
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
    logicaTabla.getDataTable(altaBaja);
    logicaTabla.llenarTabla();
});

//Evento para cambiar el color de la tabla cuando se da click sobre una fila al mismo tiempo captura el id del producto

tbody.addEventListener('click', (e) => {
    logicaTabla.logicaCambiarColores(e)
})

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
        logicaTabla.getDataTable(altaBaja);
        logicaTabla.llenarTabla();
        document.querySelector(".modal.is-visible").classList.remove(isVisible);
    }

    inputfill.focus();
})

//Dar de baja y alta producto

bBajaProducto.addEventListener('click', (e) => {
    if (idRow == "") {
        Toast.fire({
            icon: 'info',
            title: 'Elige que producto quieres dar de baja',
            background: 'FFFF',
            width: 450
        })
    } else {
        altaBaja ?
            Toast.fire({
                icon: 'info',
                title: 'Se dio de baja el producto',
                background: 'FFFF',
                width: 450
            })
            : Toast.fire({
                icon: 'info',
                title: 'Se dio de alta el producto',
                background: 'FFFF',
                width: 450
            });
        var baja = {
            altaBaja: !altaBaja
        }
        bdTabla.bajaProducto(baja, idRow);
        logicaTabla.getDataTable(altaBaja);
        logicaTabla.llenarTabla();
    }
})

//Cargar productos dados de baja en la pantalla

bAccederProductosBaja.addEventListener('click', (e) => {
    altaBaja ? altaBaja = false : altaBaja = true;
    logicaTabla.getDataTable(altaBaja);
    logicaTabla.llenarTabla();
    colorBotonBajaAlta();
    cambiarColorTitulo();
    cambiarBotonAltaBaja()
})

function colorBotonBajaAlta() {
    altaBaja ? backG = "rgb(27, 81, 97)" : backG = "white";
    altaBaja ? color = "white" : color = "rgb(27, 81, 97)";
    bAccederProductosBaja.style.backgroundColor = backG;
    bAccederProductosBaja.style.color = color;
}

function cambiarColorTitulo() {
    ubicacion = document.getElementById('ubicacion')
    altaBaja ? backG = "#d19d2c" : backG = "rgb(133, 1, 1)";
    ubicacion.style.backgroundColor = backG;
    altaBaja ? titulo = "General" : titulo = "Productos Dados de Baja";
    ubicacion.innerHTML = titulo;
}

function cambiarBotonAltaBaja(){
    altaBaja ? texto="DAR DE BAJA TEMPORAL" : texto="DAR DE ALTA";
    bBajaAlta = document.getElementById('darDeBajaTemporal')
    bBajaAlta.innerHTML=texto;
}

bBuscar.addEventListener('click', (e) => {
    e.preventDefault();
    logicaTabla.filtrarTabla(e);
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