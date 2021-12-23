//Con esto agregamos la ruta y agregamos dos slash invertidos para que asi pueda ser leida la ruta para imprimir la imagen del negocio

let nuevaRuta = "";
for (let i = 0; i < __dirname.length; i++) {
    if (__dirname.charAt(i)=="\\") {
        nuevaRuta=nuevaRuta+"\\"
    }
    nuevaRuta=nuevaRuta+__dirname.charAt(i)
}
console.log(nuevaRuta);


const $estado = document.querySelector("#estado"),
    $listaDeImpresoras = document.querySelector("#listaDeImpresoras"),
    $btnLimpiarLog = document.querySelector("#btnLimpiarLog"),
    $btnImprimir = document.querySelector("#btnImprimir"); 
const obtenerListaDeImpresoras = () => {
    loguear("Cargando lista...");
    ConectorPlugin.obtenerImpresoras()
        .then(listaDeImpresoras => {
            loguear("Lista cargada");
            $listaDeImpresoras.innerHTML = "";
            listaDeImpresoras.forEach(nombreImpresora => {
                const option = document.createElement('option');
                option.value = option.text = nombreImpresora;
                $listaDeImpresoras.appendChild(option);
            })
        })
        .catch(() => {
            loguear("Error obteniendo impresoras. Asegúrese de que el plugin se está ejecutando");
        });
}

const loguear = texto => $estado.textContent += (new Date()).toLocaleString() + " " + texto + "\n";
const limpiarLog = () => $estado.textContent = "";

$btnLimpiarLog.addEventListener("click", limpiarLog);


$btnImprimir.addEventListener("click", async () => {
    let nombreImpresora = $listaDeImpresoras.value;
    if (!nombreImpresora) return loguear("Selecciona una impresora");
    const conector = new ConectorPlugin()
        .texto("================================================\n")
        .feed(3)
        .establecerEnfatizado(1)
        .texto("Texto con emphasize en 1\n")
        .establecerEnfatizado(0)
        .texto("Texto con emphasize en 0\n")
        .establecerFuente(ConectorPlugin.Constantes.FuenteA)
        .texto("Fuente A\n")
        .establecerFuente(ConectorPlugin.Constantes.FuenteB)
        .texto("Fuente B\n")
        .establecerFuente(ConectorPlugin.Constantes.FuenteC)
        .texto("Fuente C\n")
        .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
        .texto("Alineado al centro\n")
        .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda)
        .texto("Alineado a la izquierda\n")
        .establecerJustificacion(ConectorPlugin.Constantes.AlineacionDerecha)
        .texto("Alineado a la derecha\n")
        .establecerTamanioFuente(1, 1)
        .establecerJustificacion(ConectorPlugin.Constantes.AlineacionIzquierda); // <- Aquí dejamos de encadenar los métodos, puedes encadenarlos o llamar a la misma operación en cada paso
    // Nota: El tamaño máximo es 8,8 pero no lo pongo porque consume demasiado papel. Para la demostración solo pongo hasta el 3
    for (let i = 1; i <= 3; i++) {
        conector.establecerTamanioFuente(i, i)
            .texto(`Texto con size ${i},${i}\n`);
    }
    conector
        .feed(1)
        .establecerTamanioFuente(1, 1)
        .texto("Un QR nativo (a veces no funciona):\n")
        .qr("https://www.facebook.com/ElMitoteArandas")
        .feed(1)
        .textoConAcentos("Un código de barras:\n")
        .codigoDeBarras("123", ConectorPlugin.Constantes.AccionBarcode39)
        .feed(1)
        .establecerJustificacion(ConectorPlugin.Constantes.AlineacionCentro)
        .qrComoImagen("https://www.facebook.com/ElMitoteArandas")
        .establecerTamanioFuente(1, 1)
        .imagenLocal(nuevaRuta+"\\image\\El mitote Logotipo redimencionada.jpg")
        .abrirCajon() // Abrir cajón de dinero. Opcional
        .cortar() // Cortar
    // impresora.cutPartial(); // Cortar parcialmente (opcional)
    // Recomiendo dejar un feed de 4 al final de toda impresión
    conector.feed(4)
    const respuestaAlImprimir = await conector.imprimirEn(nombreImpresora);
    if (respuestaAlImprimir === true) {
        loguear("Impreso correctamente");
        let impresora = {
            estado: true,
            nombre: nombreImpresora
        }
        storage.setStorage("impresora", impresora)
    } else {
        let impresora = {
            estado: false,
            nombre: ""
        }
        storage.setStorage("impresora", impresora)
        loguear("Error. La respuesta es: " + respuestaAlImprimir);
    }
});
