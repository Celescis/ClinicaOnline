import { Component } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-adm-usuarios',
  templateUrl: './adm-usuarios.component.html',
  styleUrls: ['./adm-usuarios.component.css']
})
export class AdmUsuariosComponent {
  dondeEsta: boolean = false;
  usersList: any[] = [];
  createrUserMenu: boolean = false;
  formPaciente: boolean = false;
  formEspecialista: boolean = false;
  formAdministrador: boolean = false;
  spinner: boolean = false;
  perfil:string = "";
  listaFiltrada:any;
  especialidades:any;

  constructor(private firestoreService: FirestoreService) {
  }

  ngOnInit(): void {
    this.listaFiltrada = [];
    this.firestoreService.traerEspecialidades().subscribe((data: any[]) => {
      this.especialidades = data.map((doc: any) => doc.nombre);
      this.listaFiltrada = [...this.especialidades];
    });
    this.spinner = true;
    this.firestoreService.traerUsuariosCombinados().subscribe((users) => {
      setTimeout(() => {
        this.usersList = users;
        this.spinner = false;
      }, 1000);
    });
  }


  updateUser(user: any, option: number) {
    if (user.hasOwnProperty("especialidad")) {
      if (option == 1) {
        user.habilitado = true;
        this.firestoreService.updateEspecialista(user);
        // this.notificationService.showSuccess(
        //   'Especialista Habilitado',
        //   'Administrador'
        // );
      } else if (option == 2) {
        user.habilitado = false;
        this.firestoreService.updateEspecialista(user);
        // this.notificationService.showSuccess(
        //   'Especialista Deshabilitado',
        //   'Administrador'
        // );
      }
    }
  }

  showCreateUserMenu() {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
    }, 1500);
    this.createrUserMenu = true;
  }

  showUserList() {
    this.createrUserMenu = false;
    this.formPaciente = false;
    this.formEspecialista = false;
    this.formAdministrador = false;
  }

  goToFormPaciente() {
    this.formPaciente = true;
  }

  goToFormEspecialista() {
    this.formEspecialista = true;
  }

  goToFormAdministrador() {
    this.formAdministrador = true;
  }

  goToRegistro() {
    this.formPaciente = false;
    this.formEspecialista = false;
    this.formAdministrador = false;
  }
}
