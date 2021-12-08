const storage = require("../js/local");

console.log(storage.getStorage("idUsuario").sesionIniciada);
if ((storage.getStorage("idUsuario").sesionIniciada)==true) {
    location.href='./gestion.html';
}else{
    location.href='./login.html';
}