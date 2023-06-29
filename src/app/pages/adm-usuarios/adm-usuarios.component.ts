import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { SwalService } from 'src/app/services/swal.service';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

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
  perfil: string = "";
  listaFiltrada: any;
  especialidades: any;
  historialClinico: any[] = [];
  user: any = null;
  fechaActual: Date = new Date();
  listaTurnos: any[] = [];

  constructor(private firestoreService: FirestoreService, public authService: AuthService, private notificationService: SwalService) {
  }

  ngOnInit(): void {
    // this.listaFiltrada = [];
    // this.firestoreService.traerEspecialidades().subscribe((data: any[]) => {
    //   this.especialidades = data.map((doc: any) => doc.nombre);
    //   this.listaFiltrada = [...this.especialidades];
    // });
    // this.spinner = true;
    // this.firestoreService.traerUsuariosCombinados().subscribe((users) => {
    //   setTimeout(() => {
    //     this.usersList = users;
    //     this.spinner = false;
    //   }, 1000);
    // });

    //historial
    this.spinner = true;
    this.listaFiltrada = [];
    this.firestoreService.traerEspecialidades().subscribe((data: any[]) => {
      this.especialidades = data.map((doc: any) => doc.nombre);
      this.listaFiltrada = [...this.especialidades];
    });


    this.firestoreService.traerUsuariosCombinados().subscribe((users) => {
      this.usersList = users;

      // Obtener UIDs de usuarios pacientes
      const usuariosPacientes = this.usersList
        .filter((user: any) => user.obraSocial)
        .map((user: any) => user.uid);

      // Obtener historiales clínicos
      this.firestoreService.getHistorialesClinicos().subscribe((historiales) => {

        const historialesPacientes = historiales.filter((historial: any) =>
          usuariosPacientes.includes(historial.paciente.uid)
        );

        // Enlazar historiales clínicos a los usuarios pacientes
        this.usersList.forEach((user: any) => {
          if (user.obraSocial) {
            user.historialesClinicos = historialesPacientes.filter(
              (historial: any) =>
                historial.paciente.uid === user.uid
            );
          }
        });

        this.spinner = false;
      });
    });

    this.firestoreService.getTurnList().subscribe((turnos: any) => {
      this.listaTurnos = [];
      for (let i = 0; i < turnos.length; i++) {
        const turnoEspecialista = turnos[i].turnos;
        for (let j = 0; j < turnoEspecialista.length; j++) {
          const t = turnoEspecialista[j];
          this.listaTurnos.push(t);
        }
      }
      // console.log(this.listaTurnos);
    });
  }

  updateUser(user: any, option: number) {
    if (user.hasOwnProperty("especialidad")) {
      if (option == 1) {
        user.habilitado = true;
        this.firestoreService.updateEspecialista(user);
      } else if (option == 2) {
        user.habilitado = false;
        this.firestoreService.updateEspecialista(user);
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

  verHistorialClinico(user: any) {
    this.historialClinico = user.historialesClinicos;
  }

  //Excel
  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }


  verTurnosUsuario(usuario: any) {
    const listaTurnosUsuario: any[] = [];

    if (usuario.obraSocial) {
      this.listaTurnos.forEach((t: any) => {
        if (usuario.uid == t?.paciente?.uid) {
          const turno: any = {};
          turno.nombrePaciente = usuario.nombre;
          turno.apellidoPaciente = usuario.apellido;
          turno.fecha = new Date(t.fecha.seconds * 1000);
          turno.especialidad = t.especialidad;
          turno.nombreEspecialista = t.especialista.nombre;
          turno.apellidoEspecialista = t.especialista.apellido;
          turno.estado = t.estado;
          listaTurnosUsuario.push(turno);
        }
      });
      if (listaTurnosUsuario.length == 0) {
        this.notificationService.crearSwal(
          'El paciente no tiene turnos',
          'Usuarios',
          'info'
        );
      } else {
        this.exportAsExcelFile(listaTurnosUsuario, 'turnosPaciente');
        this.notificationService.crearSwal(
          'Turnos del paciente descargado',
          'Usuarios',
          'success'
        );
      }
    } else {
      this.notificationService.crearSwal(
        'Debes elegir un paciente',
        'Usuarios',
        'warning'
      );
    }
  }

  descargarExcel() {
    const listaUsuarios: any[] = [];
    this.usersList.forEach((user: any) => {
      const usuario: any = {};
      if (user.obraSocial) {
        usuario.perfil = "PACIENTE";
        usuario.nombre = user.nombre;
        usuario.apellido = user.apellido;
        usuario.mail = user.mail;
        usuario.dni = user.dni;
        usuario.obraSocial =user.obraSocial;
        listaUsuarios.push(usuario);
      }
      else if (user.especialidad) {
        usuario.perfil = "ESPECIALISTA";
        usuario.nombre = user.nombre;
        usuario.apellido = user.apellido;
        usuario.mail = user.mail;
        usuario.dni = user.dni;
        user.especialidad?.forEach((especialidad: any, index: number) => {
          if (especialidad != undefined) {
            if (index == 0) {
              usuario.especialidad = ""
            }
            usuario.especialidad += especialidad.nombre;

            if (index !== user.especialidad.length - 1) {
              usuario.especialidad += " - ";
            }
          }
        });
        listaUsuarios.push(usuario);
      }
      else
      {
        usuario.perfil = "ADMINISTRADOR";
        usuario.nombre = user.nombre;
        usuario.apellido = user.apellido;
        usuario.mail = user.mail;
        usuario.dni = user.dni;
        listaUsuarios.push(usuario);
      }
    });
      if (listaUsuarios.length == 0) {
        this.notificationService.crearSwal(
          'No hay usuarios registrados',
          'Usuarios',
          'info'
        );
      } else {
        this.exportAsExcelFile(listaUsuarios, 'listaUsuarios');
        this.notificationService.crearSwal(
          'Listado de usuarios descargado',
          'Usuarios',
          'success'
        );
      }
    }
  }
