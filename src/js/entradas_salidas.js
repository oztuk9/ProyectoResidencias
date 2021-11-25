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

const checkBox = document.getElementById('checkboxEditar');
checkBox.addEventListener('click',(e)=>{
    checkBox.checked? inputPrecioCompra.disabled = false:inputPrecioCompra.disabled = true;
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

inputcodigoBarras.addEventListener('keypress', async (e) =>{
    codigo = inputcodigoBarras.value;
    if (e.key === 'Enter') {
        const consultaIdProducto = await bdEntradasSalidas.idProductoEscaneado(inputcodigoBarras.value)
        if (consultaIdProducto.length==0) {
            Toast.fire({
                icon: 'info',
                title: 'El producto no esta registrado',
                background: 'FFFF',
                width: 420
            })
        }else{
            const precio = await bdEntradasSalidas.ultimoRegistroPrecio(consultaIdProducto)
            document.getElementById("modal1").classList.add("is-visible");
             if (precio.length==0) {
                editarPrecioVenta.disabled = true;
            Toast.fire({
                icon: 'info',
                title: 'No a tenido entradas este producto',
                background: 'FFFF',
                width: 420
            })
            console.log(document.getElementById('inputPiezas').value);
            console.log(precio);
            console.log(consultaIdProducto.at(0).ID);
            idProducto=consultaIdProducto.at(0).ID;
        }else{
            inputPrecioCompra.value=precio;
        }
        }
        inputcodigoBarras.value="";
    }  
})

//Agregar producto a la solicitud

bOk.addEventListener('click',(e)=>{
    validarEspaciosSolicitud()
})

function validarEspaciosSolicitud(){
    const piezas = inputPiezas.value
    const paquetes = inputPaquetes.value
    if ((piezas=="" && paquetes=="") || ((parseInt(piezas))==0 && (parseInt(paquetes))==0) || (piezas=="" && (parseInt(paquetes))==0) ||((parseInt(piezas))==0 && paquetes=="")) {
        Toast.fire({
            icon: 'info',
            title: 'Coloque la cantidad de productos que solicita',
            background: 'FFFF',
            width: 420
        })
    }else{
        if ((parseInt(piezas))<0 || (parseInt(paquetes))<0) {
            Toast.fire({
                icon: 'info',
                title: 'Coloque una cantidad mayor a cero',
                background: 'FFFF',
                width: 420
            })
        }else{
            Toast.fire({
                icon: 'success',
                title: 'El valor ingresado es correcto',
                background: 'FFFF',
                width: 420
            })
            if (inputPrecioCompra.value=="") {
                Toast.fire({
                    icon: 'info',
                    title: 'Coloque el "precio compra" del producto',
                    background: 'FFFF',
                    width: 420
                })
            }else{
                agregarSolicitudProductoArray(piezas,paquetes)
            }
        }
    }
}

async function agregarSolicitudProductoArray(piezas,paquetes){
    const result = await bdEntradasSalidas.datosProducto(idProducto);
    console.log(result);
    if (paquetes=="") {
        paquetes=0;
    }else{
        paquetes=paquetes*parseInt(result.at(0).cantidadPorPaquete);
    }
    if (piezas=="") {
        piezas=0;
    }
    var cantidad = piezas+paquetes;
    console.log(result);
    const solicitudProductos = {
        idProducto: idProducto,
        imagen : result.at(0).imagen,
        nombre : result.at(0).nombre,
        precioCompra : inputPrecioCompra,
        cantidad : cantidad,
        idAlmacen : idProducto
    }
    listaProductosSolicitados.push(solicitudProductos)
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
        tbody.innerHTML += `<tr id=${e.id} value=${positionRows}>
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