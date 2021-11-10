const button_new_categoria = document.getElementById('button_new_categoria');
const finalizar = document.getElementById('finalizar');
const openEls = document.querySelectorAll("[data-open]");
const closeEls = document.querySelectorAll("[data-close]");
const isVisible = "is-visible";
const bdProductos = require('../sql/bdProductos');
bdProductos.cargarDatosMarca();
bdProductos.cargarDatosCategoria();

//Variables de getters

const nombreProducto = document.getElementById('nombre');
const marca = document.getElementById('select_marca');
const categoria = document.getElementById('select_categoria');
const precioVenta = document.getElementById('precioVenta');
const minimo = document.getElementById('minimo');
const maximo = document.getElementById('maximo');
const cantidadPorPaquete = document.getElementById('cantidadPorPaquete');
const codigoBarras = document.getElementById('codigoBarras');
const descripcion = document.getElementById('descripcion');
const image = document.getElementById("img");

//Toast seetalert2
const Swal = require('sweetalert2');
const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  
/*
Evento para ver a que elemento se le dio click

window.addEventListener("click",function(e){
  console.log(e.target);
})
*/

//Funciones que abren y cierran cualquier modal

for(const el of openEls) {
  el.addEventListener("click", function() {
    const modalId = this.dataset.open;
    document.getElementById(modalId).classList.add(isVisible);
  });
}

for (const el of closeEls) {
  el.addEventListener("click", function() {
    this.parentElement.classList.remove(isVisible);
  });
}

//Bloquear input y generar codigo de barras

function validarRadios() {
    console.log("Entro a la funcion de los radio");
    if (document.getElementById('radioSi').checked) {
      codigoBarras.disabled = false;
        console.log("Si");
    } if (document.getElementById('radioNo').checked) {
      codigoBarras.disabled = true;
        console.log("No");
    }
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
const efecto = document.getElementById('imagenInput');
efecto.onmouseover = function(e){
  image.style.transition = '.5s';
  image.style.transform = 'scale(1.1)';
}

efecto.onmouseout = function(e){
  image.style.transform = 'scale(1)';
}

//Evento para capturar teclado
//onkeypress
function shotgun(){
  Toast.fire({
      icon: 'info',
      title: 'shotgun!!!',
      text: 'Funciona!!!',
      background: 'FFFF'
    })
}

//

button_new_marca.addEventListener('click', async (e)=>{
  e.preventDefault();
  const newMarcaData = document.getElementById("input-new-marca")
  const newMarca = {
      nombre: newMarcaData.value
  }
  await bdProductos.insertarMarca(newMarca);
})

button_new_categoria.addEventListener('click', async (e)=>{
    e.preventDefault();
    const newCategoriData = document.getElementById("input-new-categoria")
    const newCategori = {
        nombre: newCategoriData.value
    }
    await bdProductos.insertarCategoria(newCategori);
})

finalizar.addEventListener('click', (e) => {
    e.preventDefault();
    
    const formulario = {
      nombre: nombreProducto.value,
      ID_Marca: marca.value,
      ID_Categoria: categoria.value,
      precioVenta: precioVenta.value,
      minimo: minimo.value,
      maximo: maximo.value,
      cantidadPorPaquete: cantidadPorPaquete.value,
      codigoBarras: codigoBarras.value,
      descripcion: descripcion.value,
      imagen: image.src
  }

  bdProductos.insertarProducto(formulario)

})