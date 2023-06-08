import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { Router } from '@angular/router';
import { SwalService } from './swal.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: string = "";
  sePudo: boolean = false;
  esconderBotonCierre: boolean = true;
  nombreLogueado: string = "";
  fotoLogueado: any;
  emailLogueado: string = "";
  esAdmin: boolean;

  constructor(private router: Router, private swalService: SwalService) {
    this.esAdmin= false;
   }


  login(correo: any, password: any, foto: string, nombre: string, admin: boolean) {

    firebase.auth().signInWithEmailAndPassword(correo, password).then((response) => {
      firebase.auth().currentUser?.getIdToken().then(
        (token) => {
          if (firebase.auth().currentUser?.emailVerified) {
            this.emailLogueado = correo;
            this.token = token;
            this.sePudo = true;
            this.esconderBotonCierre = false;
            this.esAdmin = admin;
            this.fotoLogueado = foto;

            if (nombre != undefined) {
              this.nombreLogueado = nombre;
            }
            this.router.navigate(['/home']);
            this.swalService.crearSwal(`Ingreso exitoso`, "Bienvenido " + nombre + "!", 'success');

          }
          else {
            this.swalService.crearSwal(`Por favor revise su correo`, "Mail no verificado!", 'error');
          }
        }
      )
    })
      .catch(async (error) => {
        let errorMessage = error.message;

        if (errorMessage.includes('correo', 'password') || !correo.valid && !password.valid) {
          errorMessage = 'Debe ingresar un correo y contraseña correcta';

        } else if (errorMessage.includes('password') || !password.valid) {
          errorMessage = 'Por favor, ingrese una contraseña válida.';
        } else {
          errorMessage = "Usuario inexistente";
        }
        this.swalService.crearSwal(errorMessage, "ERROR", 'error');
      });
  }

  desloguear() {
    firebase.auth().signOut();
    this.esAdmin=false;
    this.token = "";
    this.swalService.crearSwal(`Cierre de sesión exitoso!`, "EXCELENTE", 'success');
    this.router.navigate(['home']);
    this.esconderBotonCierre = true;
    this.sePudo = false;
  }

  

}

