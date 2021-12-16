const bdTabla = require('../sql/bdGestion');

//llenar arrays con datos de la base de datos

async function getDataTable(altaBaja) {
    arrayDataTable = [];
    copyArrayDataTable = [];
    const res = await bdTabla.getDataTable(altaBaja);
    console.log(res);
    res.forEach(e => {
        arrayDataTable.push(e);
        copyArrayDataTable.push(e)
    });

}

//Llenar tabla con datos almacenados en el array

async function llenarTabla() {
    idRow = "";
    positionRows = 1
    tbody.innerHTML = ""; // reset data
    const res = await bdTabla.getDataTable(altaBaja);
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

//Buscar producto
async function ordenarPor() {
    var order = sFiltrarPor.value;
    var by = sOrdenar.value;
    arrayDataTable = (await bdTabla.getDataTableOrder(order, by, altaBaja)).slice();
}

//filtros

function filtrarTabla(){
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
}

module.exports={
    getDataTable,
    llenarTabla,
    logicaCambiarColores,
    filtrarTabla
}