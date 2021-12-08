const storage = require("../js/local");

if (localStorage.getItem("idUsuario") === null) {
    let idUsuario = {
        id: storage.getStorage("idProducto").id,
        editar: false
      }
      storage.setStorage("idUsuario", idUsuario);
} else {
    console.log(storage.getStorage("idUsuario").sesionIniciada);
    if ((storage.getStorage("idUsuario").sesionIniciada) == true) {
        location.href = './gestion.html';
    } else {
        location.href = './login.html';
    }
}