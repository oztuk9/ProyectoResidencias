const button_new_categoria = document.getElementById('button_new_categoria');
const finalizar = document.getElementById('finalizar');
const openEls = document.querySelectorAll("[data-open]");
const closeEls = document.querySelectorAll("[data-close]");
const cancelar = document.getElementById('cancelar');
const inputMarca = document.getElementById('input-new-marca')
const inputCategoria = document.getElementById('input-new-categoria')
const isVisible = "is-visible";
const bdProductos = require('../sql/bdProductos');
const storage = require('../js/local');


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

//Variables contador de elementos en un select




document.addEventListener("DOMContentLoaded", (e) => {
  // Your code to run since DOM is loaded and ready
  cargarDatosMarca();
  cargarDatosCategoria();
  editar();
});


async function cargarDatosMarca() {
  try {
    const result = await bdProductos.cargarDatosMarca();
    marca.innerHTML = "";
    for (let i = 0; i < result.length; i++) {
      objeto = document.createElement('option')
      objeto.value = result[i].id
      objeto.text = result[i].nombre
      marca.appendChild(objeto);
    }
  } catch (error) {
  }
}

async function cargarDatosCategoria() {
  try {
    const result = await bdProductos.cargarDatosCategoria();
    categoria.innerHTML = "";
    for (let i = 0; i < result.length; i++) {
      objeto = document.createElement('option')
      objeto.value = result[i].id
      objeto.text = result[i].nombre
      categoria.appendChild(objeto);
    }
  } catch (error) {
  }
}


/*
Evento para ver a que elemento se le dio click

window.addEventListener("click",function(e){
  console.log(e.target);
})
*/

//Evento para capturar teclado
//  
/*function shotgun(){
  Toast.fire({
      icon: 'info',
      title: 'shotgun!!!',
      text: 'Funciona!!!',
      background: 'FFFF'
    })
}

*/

//Funciones que abren y cierran cualquier modal

for (const el of openEls) {
  el.addEventListener("click", function () {
    const modalId = this.dataset.open;
    document.getElementById(modalId).classList.add(isVisible);
  });
}

for (const el of closeEls) {
  el.addEventListener("click", function () {
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
efecto.onmouseover = function (e) {
  image.style.transition = '.5s';
  image.style.transform = 'scale(1.1)';
}

efecto.onmouseout = function (e) {
  image.style.transform = 'scale(1)';
}

button_new_marca.addEventListener('click', async (e) => {
  console.log(inputMarca.value);
  if (inputMarca.value == "") {
    Toast.fire({
      icon: 'info',
      title: 'Escribe el nombre de la marca',
      background: 'FFFF',
      width: 420
    })
  } else {
    e.preventDefault();
    const newMarca = {
      nombre: inputMarca.value
    }
    await bdProductos.insertarMarca(newMarca);
    cargarDatosMarca();
  }
})

button_new_categoria.addEventListener('click', async (e) => {
  e.preventDefault();
  if (inputCategoria.value == "") {
    Toast.fire({
      icon: 'info',
      title: 'Escribe el nombre de la categoria',
      background: 'FFFF',
      width: 420
    })
  } else {
    const newCategori = {
      nombre: inputCategoria.value
    }
    await bdProductos.insertarCategoria(newCategori);
    cargarDatosCategoria();
  }
})

finalizar.addEventListener('click', (e) => {
  e.preventDefault();
  const formulario = {
    nombre: nombreProducto.value,
    precioVenta: parseFloat(precioVenta.value),
    imagen: image.src,
    descripcion: descripcion.value,
    cantidadPorPaquete: cantidadPorPaquete.value,
    codigoBarras: codigoBarras.value,
    minimo: minimo.value,
    maximo: maximo.value,
    ID_Categoria: categoria.value,
    ID_Marca: marca.value,
  }

  var id = parseInt(storage.getStorage("idProducto").id)

  if (storage.getStorage("idProducto").editar == true) {
    bdProductos.editarProducto(formulario, id);
  } else {
    bdProductos.insertarProducto(formulario);
    resetForm();
  }
})

function resetForm() {
  nombreProducto.value = "";
  cargarDatosMarca();
  cargarDatosCategoria();
  precioVenta.value = "";
  minimo.value = "";
  maximo.value = "";
  cantidadPorPaquete.value = "";
  codigoBarras.value = "";
  image.src = "image/pngwing.com.png";
  descripcion.value = "";
}

cancelar.addEventListener('click', (e) => {
  let idProducto = {
    id: storage.getStorage("idProducto").id,
    editar: false
  }
  storage.setStorage("idProducto", idProducto);
  location.href = './gestion.html'
})

async function editar() {
  if (storage.getStorage("idProducto").editar == true) {
    const result = await bdProductos.productConsult();
    console.log(result[0].Nombre);
    addValuesEdit(result)

    document.getElementById('ubicacion').innerHTML = "EDITAR PRODUCTO"
  } else {
    document.getElementById('ubicacion').innerHTML = "NUEVO PRODUCTO"
  }
}

function addValuesEdit(result) {
  nombreProducto.value = result[0].Nombre;
  //Seleccionamos la marca en el select con base a la marca que se registro en el producto
  var countMarca = marca.options;
  for (var opt, j = 0; opt = countMarca[j]; j++) {
    if (opt.value == result[0].ID_Marca) {
      marca.selectedIndex = j;
      break;
    }
  }
  //Seleccionamos la marca en el select con base a la categoria que se registro en el producto
  var countCategoria = categoria.options;
  for (var opt, j = 0; opt = countCategoria[j]; j++) {
    if (opt.value == result[0].ID_Categoria) {
      categoria.selectedIndex = j;
      break;
    }
  }
  precioVenta.value = result[0].PrecioVenta;
  maximo.value = result[0].Maximo;
  minimo.value = result[0].Minimo;
  cantidadPorPaquete.value = result[0].CantidadPorPaquete;
  codigoBarras.value = result[0].CodigoBarras;
  image.src = result[0].Imagen;
  descripcion.value = result[0].Descripcion;

}