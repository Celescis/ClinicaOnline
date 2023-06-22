export class Especialista {

    nombre: string;
    apellido: string;
    edad: number;
    dni: number;
    especialidad: any;
    mail: string;
    password: string;
    fotos: any;
    habilitado: boolean;

    constructor(nombre: string, apellido: string, edad: number, dni: number, especialidad: any, mail: string, password: string, fotos: any, habilitado: boolean) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.dni = dni;
        this.especialidad = especialidad;
        this.mail = mail;
        this.password = password;
        this.fotos = fotos;
        this.habilitado = habilitado;
    }
}