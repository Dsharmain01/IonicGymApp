class Usuario {
    constructor(usuario, password, pais) {
        this.usuario = usuario;
        this.password = password;
        this.pais = pais;
    }
}

class UsuarioConectado {
    constructor(usuario,password){
        this.usuario=usuario;
        this.password=password;
    }
}

class Actividad {
    constructor(idActividad,idUsuario,tiempo,fecha,img){
        this.idActividad=idActividad;
        this.idUsuario=idUsuario;
        this.tiempo=tiempo;
        this.fecha=fecha;
    }
}