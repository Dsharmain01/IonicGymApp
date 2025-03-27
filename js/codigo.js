window.addEventListener("load", inicio);

const MENU = document.querySelector("#menu");
const LOGIN = document.querySelector("#pantallaLogin");
const REGISTRO = document.querySelector("#pantallaRegistro");
const AGREGARREGISTRO = document.querySelector("#agregarRegistro");
const LISTADOACTIVIDADES = document.querySelector("#listado");
const HOME = document.querySelector("#pantallaHome");
const ROUTER = document.querySelector("#ruteo");
const INFORME = document.querySelector("#informe");
const MAPA = document.querySelector("#mapa");


function inicio() {
    chequearSesion();
    ROUTER.addEventListener("ionRouteDidChange", navegar)
    document.querySelector("#btnRegistrar").addEventListener("click", previaRegistrarUsuario);
    document.querySelector("#btnLogin").addEventListener("click", previaLogin);
    document.querySelector("#btnMenuLogout").addEventListener("click", cerrarSesion);
    document.querySelector("#btnAgregarRegistro").addEventListener("click", previaRegistrarActividad);
    document.querySelector("#slcFiltro").addEventListener("ionChange", previaListado);
    document.querySelector("#btnMenuInforme").addEventListener("click", informeTiempo);
}

// MANEJO DEL MENU

function chequearSesion() {
    if (localStorage.getItem("usuario") == null) {

        cargarDatosSelectPais()
        ocultarPantallas();
        ocultarMenu();
        mostrarMenuComun();
       
    
    } else {

        mostrarMenuVip();
        cargarDatosSelectActividades();
    }
}

function ocultarMenu() {
    document.querySelector("#btnMenuRegistro").style.display = "none";
    document.querySelector("#btnMenuLogin").style.display = "none";
    document.querySelector("#btnMenuLogout").style.display = "none";
    document.querySelector("#btnMenuAgregarRegistro").style.display = "none";
    document.querySelector("#btnMenuListado").style.display = "none";
    document.querySelector("#btnMenuInforme").style.display = "none";
    document.querySelector("#btnMenuMapa").style.display = "none";
}

function mostrarMenuComun() {
    ocultarMenu();
    document.querySelector("#btnMenuLogin").style.display = "block";
    document.querySelector("#btnMenuRegistro").style.display = "block";

}

function mostrarMenuVip() {
    ocultarMenu();
    document.querySelector("#btnMenuLogout").style.display = "block";
    document.querySelector("#btnMenuAgregarRegistro").style.display = "block";
    document.querySelector("#btnMenuListado").style.display = "block";
    document.querySelector("#btnMenuInforme").style.display = "block";
    document.querySelector("#btnMenuMapa").style.display = "block";
}


function cerrarMenu() {
    MENU.close();
}

// OCULTAR PANTALLAS Y NAVEGACION

function ocultarPantallas() {
    LOGIN.style.display = "none"
    REGISTRO.style.display = "none"
    AGREGARREGISTRO.style.display = "none"
    LISTADOACTIVIDADES.style.display = "none"
    INFORME.style.display = "none"
    MAPA.style.display = "none"
}

function navegar(evt) {

    HOME.style.display = "block"
    const ruta = evt.detail.to;
    ocultarPantallas();
    if (ruta == "/login") {
        LOGIN.style.display = "block"
    }
    if (ruta == "/registro") {
        REGISTRO.style.display = "block"
    }
    if (ruta == "/agregarRegistro") {
        AGREGARREGISTRO.style.display = "block"
    }
    if (ruta == "/logout") {
        HOME.style.display = "block"
    }
    if (ruta == "/listado") {
        LISTADOACTIVIDADES.style.display = "block"
        previaListado();
    }
    if (ruta == "/informe") {
        INFORME.style.display = "block"
    }
    if (ruta == "/mapa") {
        MAPA.style.display = "block"
        cargarDatosMapa();
    }

}

//REGISTRO DE USUARIOS

let listaDePaises=[];

function cargarDatosSelectPais() {

    fetch("https://movetrack.develotion.com/paises.php")
        .then(function (response) {
            return response.json()
        })


        .then(function (data) {

            cargarSelectPais(data.paises)
            listaDePaises=data.paises;
        })

        .catch(function (error) {
            console.log(error)
        })

}




function cargarSelectPais(paises) {
    let respuesta = "";
    
    for (const pais of paises) {
        respuesta +=
        `
        <ion-select-option value="${pais.id}">${pais.name}</ion-select-option>`
    }
    document.querySelector("#slcPaises").innerHTML = respuesta;
    
    
}

function previaRegistrarUsuario() {

    let usuario = document.querySelector("#txtRegistroUsuario").value;
    let password = document.querySelector("#txtRegistroContraseña").value;
    let pais = document.querySelector("#slcPaises").value;

    let nuevoUsuario = new Usuario(usuario, password, pais);
    registrarUsuario(nuevoUsuario);
}

function registrarUsuario(nuevoUsuario) {

    fetch(`https://movetrack.develotion.com/usuarios.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoUsuario)
    })
        .then(function (response) {

            return response.json()
        })
        .then(function (data) {
            console.log(data);

            if (data.codigo > 199 && data.codigo < 300) {

                mostrarMensaje("SUCCESS", "Bienvenido", "Registrado exitosamente!", 1900)
                ocultarPantallas();
                HOME.style.display = "block";
                localStorage.setItem("usuario", nuevoUsuario.usuario)
                localStorage.setItem("apikey", data.apiKey)
                chequearSesion();
                hacerLogin(nuevoUsuario);

            } else {
                mostrarMensaje("ERROR", "Error", `${data.mensaje}`, 1900);
            }
        })
        .catch(function (error) {
            console.log(error)
        })
}

// LOGIN

function previaLogin() {
    let usuario = document.querySelector("#txtLoginUsuario").value;
    let password = document.querySelector("#txtLoginContraseña").value;

    let usuarioConectado = new UsuarioConectado(usuario, password)
    console.log(usuarioConectado);

    hacerLogin(usuarioConectado);
}

function hacerLogin(nuevoUsuario) {

    fetch(`https://movetrack.develotion.com/login.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoUsuario)
    })
        .then(function (response) {
            console.log(response);

            return response.json()
        })
        .then(function (data) {
            console.log(data);
            if (data.codigo == "200") {
                mostrarMensaje("SUCCESS", "Welcome", "Bienvenido nuevamente!", 1900)
                ocultarPantallas();
                HOME.style.display = "block";
                localStorage.setItem("usuario", data.id);
                localStorage.setItem("apikey", data.apiKey);
                chequearSesion();

            } else {
                mostrarMensaje("ERROR", "Error", `${data.mensaje}`, 1900);
            }
        })
        .catch(function (error) {
            console.log(error)
        })
}

//  ACTIVIDADES

let arrayActividades = []

function cargarDatosSelectActividades() {
    let apiKey = localStorage.getItem("apikey");
    let usuario = localStorage.getItem("usuario");
    console.log(apiKey);
    console.log(usuario)
    fetch(`https://movetrack.develotion.com/actividades.php`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'iduser': usuario,
            'apikey': apiKey,
        }
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (informacion) {
            cargarSelectActividades(informacion.actividades)
            arrayActividades = [...informacion.actividades];
            previaListado();
        })
        .catch(function (error) {
            console.log(error)
        })

}

function cargarSelectActividades(actividades) {

    let respuesta = "";
    for (const actividad of actividades) {
        respuesta += `
            <ion-select-option value="${actividad.id}">${actividad.nombre}</ion-select-option>
        `;


    }

    document.querySelector("#slcActividad").innerHTML = respuesta;

}


function previaRegistrarActividad() {

    let actividadSeleccionada = Number(document.querySelector("#slcActividad").value);
    let fechaActividad = document.querySelector("#datetime").value;
    let tiempoEnMinutos = Number(document.querySelector("#tiempoActividadMin").value);
    let idUsuario = localStorage.getItem("usuario");

    let nuevaActividad = new Actividad(actividadSeleccionada, idUsuario, tiempoEnMinutos, fechaActividad);
    registrarActividad(nuevaActividad);

}


function registrarActividad(nuevaActividad) {
    let apiKey = localStorage.getItem("apikey");
    fetch(`https://movetrack.develotion.com/registros.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': `${apiKey}`,
            'iduser': `${nuevaActividad.idUsuario}`,
        },
        body: JSON.stringify(nuevaActividad)
    })
        .then(function (response) {

            return response.json()
        })
        .then(function (data) {
            console.log(data);

            if (data.codigo > 199 && data.codigo < 300) {
                mostrarMensaje("SUCCESS", "Exito", "Actividad registrada!", 1900);
                document.querySelector("#slcActividad").value = "";
                document.querySelector("#tiempoActividadMin").value = "";
                document.querySelector("#datetime").value = fechaMaxima;
                listarActividades();


            } else {
                mostrarMensaje("DANGER", "ERROR", `${data.mensaje}`, 1900);
            }
        })
        .catch(function (error) {
            console.log(error)
        })
}

// LOGOUT

function cerrarSesion() {
    HOME.style.display = "block";
    localStorage.removeItem("usuario");
    localStorage.removeItem("apikey");
    location.reload(chequearSesion());
}

// FECHA HASTA EL DIA DE HOY

let hoy = new Date();
let año = hoy.getFullYear();
let mes = (hoy.getMonth() + 1).toString().padStart(2, "0");
let dia = hoy.getDate().toString().padStart(2, "0");
let fechaMaxima = año + "-" + mes + "-" + dia;

document.querySelector("#datetime").setAttribute("max", fechaMaxima);

//TOAST MANEJO DE MENSAJES

function mostrarMensaje(tipo, titulo, texto, duracion) {
    const toast = document.createElement('ion-toast');
    toast.header = titulo;
    toast.message = texto;
    if (!duracion) {
        duracion = 2000;
    }
    toast.duration = duracion;
    if (tipo === "ERROR") {
        toast.color = 'danger';
        toast.icon = "alert-circle-outline";
    } else if (tipo === "WARNING") {
        toast.color = 'warning';
        toast.icon = "warning-outline";
    } else if (tipo === "SUCCESS") {
        toast.color = 'success';
        toast.icon = "checkmark-circle-outline";
    }
    document.body.appendChild(toast);
    toast.present();
}

//  LISTADO DE ACTIVIDADES

function previaListado() {

    fetch(`https://movetrack.develotion.com/registros.php?idUsuario=${localStorage.getItem("usuario")}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "apikey": `${localStorage.getItem("apikey")}`,
            "iduser": `${localStorage.getItem("usuario")}`,
        },
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (respuesta) {
            listarActividades(respuesta.registros);
            actividadesInforme = respuesta.registros;
            informeTiempo();
        })
        .catch(function (error) {
        
        })
}


function listarActividades(actividades) {
    let filtro = document.querySelector("#slcFiltro").value;
    let verActividad = ``;
    let img;

    if (!filtro) {
        filtro = "todos";
    }

    let fechaActual = new Date();
    let actividadesFiltradas = [];

    for (let unaAct of actividades) {
        let fechaActividad = new Date(unaAct.fecha);
        let agregar = false;

        if (filtro === "todos" || filtro === "") {
            agregar = true;
        } else if (filtro === "semanal") {
            let haceUnaSemana = new Date(fechaActual);
            haceUnaSemana.setDate(fechaActual.getDate() - 7);
            if (fechaActividad >= haceUnaSemana) {
                agregar = true;
            }
        } else if (filtro === "mensual") {
            let haceUnMes = new Date(fechaActual);
            haceUnMes.setMonth(fechaActual.getMonth() - 1);
            if (fechaActividad >= haceUnMes) {
                agregar = true;
            }
        }

        if (agregar) {
            actividadesFiltradas.push(unaAct);
        }
    }


    for (const unaAct of actividadesFiltradas) {
        for (const actividad of arrayActividades) {
            if (unaAct.idActividad === actividad.id) {
                img = actividad.imagen;
            }
        }

        verActividad += `
       <ion-item lines="none">
           <ion-label>
               <ul>
                   <li><img src="https://movetrack.develotion.com/imgs/${img}.png" alt="Imagen de la actividad" class="actividad-img"></li>
                   <li><strong>Fecha:</strong> ${unaAct.fecha}</li>
                   <li><strong>Tiempo:</strong> ${unaAct.tiempo} min</li>
               </ul>
           </ion-label>
           <ion-button id="btnEliminar" onclick="eliminarActividad(${unaAct.id})">Eliminar</ion-button>
       </ion-item>`;
    }

    document.querySelector("#contenedorListado").innerHTML = verActividad;
}

function eliminarActividad(idActividad) {
    fetch(`https://movetrack.develotion.com/registros.php?idRegistro=${idActividad}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            "apikey": localStorage.getItem("apikey"),
            "iduser": localStorage.getItem("usuario")
        },
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        if (data && data.error) {
            mostrarMensaje("ERROR", "Error", `${data.mensaje}`, 1900);
        } else {

            mostrarMensaje("SUCCESS", "Exito", "Actividad eliminada", 1900);
            previaListado();

        }
    })
    .catch(function (error) {
        console.log(error)
    })
}

//INFORME DEL TIEMPO DIARIO Y TOTAL 

let actividadesInforme = [];
function informeTiempo() {
    previaListado()
    let tiempoTotal = 0;
    let tiempoDiario = 0;


    for (const unaActi of actividadesInforme) {
        tiempoTotal += unaActi.tiempo;
        if (unaActi.fecha === fechaMaxima) {
            tiempoDiario += unaActi.tiempo;
        }
    }

    document.querySelector("#txtTiempoTotal").innerHTML = tiempoTotal + " " + "Min";
    document.querySelector("#txtTiempoDiario").innerHTML = tiempoDiario + " " +"Min";

}

// MAPA

function cargarDatosMapa(){

    cargarDatosSelectPais();
    

    fetch(`https://movetrack.develotion.com/usuariosPorPais.php`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "apikey": `${localStorage.getItem("apikey")}`,
            "iduser": `${localStorage.getItem("usuario")}`,
        },
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (respuesta) {
           cargarMapa(respuesta.paises);
        })
        .catch(function (error) {
            console.log(error)
        })
}


var map;

function cargarMapa(paises) {

    if (map) {
        map.remove();
    }

    map = L.map('map').setView([-15, -60], 2.5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    for (const pais of paises) {
        for (const coord of listaDePaises) {
            if (pais.name.toLowerCase() === coord.name.toLowerCase()) {
                L.marker([coord.latitude, coord.longitude])
                    .addTo(map)
                    .bindPopup(`País: ${pais.name}<br>Cantidad de usuarios: ${pais.cantidadDeUsuarios}`);
            }
        }
    }
}

