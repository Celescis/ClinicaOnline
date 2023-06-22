export class Paciente {

    nombre: string;
    apellido: string;
    edad: number;
    dni: number;
    obraSocial: any;
    mail: string;
    password: string;
    fotos: any;

    constructor(nombre: string, apellido: string, edad: number, dni: number, obraSocial: string, mail: string, password: string, fotos: any) {

        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.dni = dni;
        this.obraSocial = obraSocial;
        this.mail = mail;
        this.password = password;
        this.fotos = fotos;
    }
}