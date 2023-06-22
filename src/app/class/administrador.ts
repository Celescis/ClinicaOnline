export class Administrador {

    nombre: string;
    apellido: string;
    edad: number;
    dni: number;
    mail: string;
    password: string;
    fotos: any;

    constructor(nombre: string, apellido: string, edad: number, dni: number, mail: string, password: string, fotos: any) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.dni = dni;
        this.mail = mail;
        this.password = password;
        this.fotos = fotos;
    }
}