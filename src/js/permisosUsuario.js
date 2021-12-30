const botonEmpleados = document.getElementById('empleados')
const botonUsuarios = document.getElementById('usuarios')

var consultaUsuario;

obtenerUsuario();

async function obtenerUsuario() {
    ID_Usuario = parseInt(storage.getStorage("idUsuario").id)
    consultaUsuario = await bdUsuarios.selectUsuario(ID_Usuario)
    console.log(consultaUsuario);
    if (ID_Usuario!=1) {
        if (consultaUsuario.at(0).TipoUsuario == 0) {
            console.log(consultaUsuario.at(0).TipoUsuario);
            botonEmpleados.style.display = 'none'
            botonUsuarios.style.display = 'none'
            document.getElementById('dimecionesGrid').href = 'ccs/permisosComun.css';
            //Busca primero si el elemento con el id "gestion" existe y si existe lo desaparece del flujo html con display none
            if (!!document.getElementById('gestion')) {
                var bNavegacionGestion = document.getElementById('gestion');
                bNavegacionGestion.style.display = 'none';
                console.log("el elemento html existe");
            } else {
                console.log("el elemento html NO existe");
            }
    
        }else{
            botonUsuarios.style.display = 'none'
            document.getElementById('dimecionesGrid').href = 'ccs/permisosAdministrador.css';
        }
    }
}  