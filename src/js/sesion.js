const storage = require("../js/local");

if (localStorage.getItem("idUsuario") === null) {
    let iniciarSesion = {
        id: 0,
        sesionIniciada: false
    }
    storage.setStorage("idUsuario", iniciarSesion)
} else {
    console.log(storage.getStorage("idUsuario").sesionIniciada);
    if ((storage.getStorage("idUsuario").sesionIniciada) == true) {
        location.href = './gestion.html';
    } else {
        location.href = './login.html';
    }
}