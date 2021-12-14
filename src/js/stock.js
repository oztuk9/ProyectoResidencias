const inputcodigoBarras = document.getElementById("inputcodigoBarras");
const bdEntradasSalidas = require('../sql/bdEntradasSalidas');
const closeEls = document.querySelectorAll("[data-close]");
const openEls = document.querySelectorAll("[data-open]");
const logicaTabla = require('../js/tablaProductos');
const tbodySolicitud = document.getElementById('tbodySolicitud');
const tbody = document.getElementById('tbody');

//muchas de las variables no se usan en este script pero otro script si las usa, como local storage que se usa desde perfil_area_empleado, esto se hizo asi con la dinalidad de no tener problemas con variables duplicadas o variables en otro script que no quedan bien tenerlas ahí.

const storage = require("../js/local");

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
