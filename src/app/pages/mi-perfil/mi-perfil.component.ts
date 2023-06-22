import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { SwalService } from 'src/app/services/swal.service';
import { jsPDF } from 'jspdf';


@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.scss']
})
export class MiPerfilComponent {
  user: any = null;
  spinner: boolean = false;
  isPaciente: boolean = false;
  isEspecialista: boolean = false;
  specialistDays: any[] = [];

  especialidad1: boolean = true;
  especialidad2: boolean = false;

  lunes: boolean = false;
  martes: boolean = false;
  miercoles: boolean = false;
  jueves: boolean = false;
  viernes: boolean = false;
  sabado: boolean = false;
  turnDuration: number = 30;

  currentTurnList: any = {};

  historialClinico: any[] = [];
  historialClinicoFiltrado: any[] = [];
  hayHistorial: boolean = false;
  hayHistorialFiltrado: boolean = true;
  btnTodo: boolean = true;
  btnCardiologia: boolean = false;
  btnOdontologia: boolean = false;
  btnEndocrinologia: boolean = false;
  disableDaysOne: boolean[] = [];
  disableDaysTwo: boolean[] = [];
  

  fechaActual: Date = new Date();

  constructor(
    public authService: AuthService,
    public firestoreService: FirestoreService,
    private notificationService: SwalService
  ) { }

  ngOnInit(): void {
    this.spinner = true;

    this.authService.user$.subscribe((user: any) => {
      if (user) {
        this.spinner = false;
        this.user = user;
        if (this.user.obraSocial) {
          this.isPaciente = true;
          this.firestoreService.getHistorialesClinicos().subscribe((historial) => {
            this.historialClinico = [];
            historial.forEach((h) => {
              if (h.paciente.uid == this.user.uid) {
                this.historialClinico.push(h);
              }
            });
            if (this.historialClinico.length > 0) {
              this.hayHistorial = true;
            } else {
              this.hayHistorial = false;
            }
          });
        } else if (this.user.especialidad) {
          this.isEspecialista = true;
          if (this.user.especialidad[0].diasTurnos) {
            this.specialistDays = [...this.user.especialidad[0].diasTurnos];
            this.turnDuration = this.user.especialidad[0].duracionTurno;
            this.activateDayButton();
            this.firestoreService.getTurnList().subscribe((turnosEspecialista) => {
              for (let i = 0; i < turnosEspecialista.length; i++) {
                const listaTurnos = turnosEspecialista[i];
                if (this.user.mail == listaTurnos.especialista.mail) {
                  this.currentTurnList = listaTurnos;
                }
              }
            });
          }
        }
      }
    });
  }

  addDay(day: string) {
    if (this.especialidad1) {
      if (
        !this.specialistDays.some((d) => d == day) &&
        !this?.user?.especialidad[1]?.diasTurnos?.some((d: any) => d == day)
      ) {
        this.specialistDays.push(day);
        this.notificationService.crearSwal('Día asignado', 'Mi Perfil', 'warning');
        this.activateDeactivateDayButton(day);
      } else if (this.specialistDays.some((d) => d == day)) {
        const index = this.specialistDays.indexOf(day);
        this.specialistDays.splice(index, 1);
        this.notificationService.crearSwal(
          'Asignación de día cancelada',
          'Mi Perfil',
          'info'
        );
        this.activateDeactivateDayButton(day);
      } else {
        this.notificationService.crearSwal(
          'Día asignado a otra especialidad',
          'Mi Perfil',
          'warning'
        );
      }
    } else if (this.especialidad2) {
      if (
        !this.specialistDays.some((d) => d == day) &&
        !this.user.especialidad[0].diasTurnos.some((d: any) => d == day)
      ) {
        this.specialistDays.push(day);
        this.notificationService.crearSwal('Día asignado', 'Mi Perfil', 'info');
        this.activateDeactivateDayButton(day);
      } else if (this.specialistDays.some((d) => d == day)) {
        const index = this.specialistDays.indexOf(day);
        this.specialistDays.splice(index, 1);
        this.notificationService.crearSwal(
          'Asignación de día cancelada',
          'Mi Perfil'
          , 'info'
        );
        this.activateDeactivateDayButton(day);
      } else {
        this.notificationService.crearSwal(
          'Día asignado a otra especialidad',
          'Mi Perfil'
          , 'warning'
        );
      }
    }
  }
  
  
  public getDayIndex(day: string): number {
    const days = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    return days.indexOf(day.toLowerCase());
  }
  

  activateDeactivateDayButton(day: string) {
    switch (day) {
      case 'lunes':
        this.lunes = !this.lunes;
        break;
      case 'martes':
        this.martes = !this.martes;
        break;
      case 'miércoles':
        this.miercoles = !this.miercoles;
        break;
      case 'jueves':
        this.jueves = !this.jueves;
        break;
      case 'viernes':
        this.viernes = !this.viernes;
        break;
      case 'sábado':
        this.sabado = !this.sabado;
        break;
    }
  }

  activateDayButton() {
    this.specialistDays.forEach((day) => {
      switch (day) {
        case 'lunes':
          this.lunes = true;
          break;
        case 'martes':
          this.martes = true;
          break;
        case 'miércoles':
          this.miercoles = true;
          break;
        case 'jueves':
          this.jueves = true;
          break;
        case 'viernes':
          this.viernes = true;
          break;
        case 'sábado':
          this.sabado = true;
          break;
      }
    });
  }

  deactivateDayButton() {
    this.specialistDays.forEach((day) => {
      switch (day) {
        case 'lunes':
          this.lunes = false;
          break;
        case 'martes':
          this.martes = false;
          break;
        case 'miércoles':
          this.miercoles = false;
          break;
        case 'jueves':
          this.jueves = false;
          break;
        case 'viernes':
          this.viernes = false;
          break;
        case 'sábado':
          this.sabado = false;
          break;
      }
    });
  }

  updateUser() {
    let esp: any = {};
    if (this.especialidad1) {
      esp.nombre = this.user.especialidad[0].nombre;
      esp.diasTurnos = [...this.specialistDays];
      esp.duracionTurno = this.turnDuration;
      this.user.especialidad[0] = esp;
    } else if (this.especialidad2) {
      esp.nombre = this.user.especialidad[1].nombre;
      esp.diasTurnos = [...this.specialistDays];
      esp.duracionTurno = this.turnDuration;
      this.user.especialidad[1] = esp;
    }

    // *******************************************************************
    // *******************************************************************
    // *******************************************************************

    const listaDeTurnos: any[] = [];
    const currentDate = new Date();
    const turnDuration = this.turnDuration * 60000;

    for (let i = 0; i < this.specialistDays.length; i++) {
      const day = this.specialistDays[i];
      let dayNumber = 0;
      switch (day) {
        case 'lunes':
          dayNumber = 1;
          break;
        case 'martes':
          dayNumber = 2;
          break;
        case 'miércoles':
          dayNumber = 3;
          break;
        case 'jueves':
          dayNumber = 4;
          break;
        case 'viernes':
          dayNumber = 5;
          break;
        case 'sábado':
          dayNumber = 6;
          break;
      }

      // CREACION DE TURNOS
      for (let j = 1; j <= 60; j++) {
        const date = new Date(currentDate.getTime() + 84600000 * j);
        if (date.getDay() == dayNumber) {
          let turnDay = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            8
          );
          let turnoNew: any = {};
          turnoNew.estado = 'disponible';
          if (this.especialidad1) {
            turnoNew.especialidad = this.user.especialidad[0].nombre;
          } else {
            turnoNew.especialidad = this.user.especialidad[1].nombre;
          }
          turnoNew.especialista = this.user;
          turnoNew.paciente = null;
          turnoNew.fecha = new Date(turnDay.getTime());
          listaDeTurnos.push(turnoNew);
          while (turnDay.getHours() < 19) {
            turnoNew = {};
            turnDay = new Date(turnDay.getTime() + turnDuration);
            if (turnDay.getHours() != 19) {
              turnoNew.estado = 'disponible';
              if (this.especialidad1) {
                turnoNew.especialidad = this.user.especialidad[0].nombre;
              } else {
                turnoNew.especialidad = this.user.especialidad[1].nombre;
              }
              turnoNew.especialista = this.user;
              turnoNew.paciente = null;
              turnoNew.fecha = new Date(turnDay.getTime());
              listaDeTurnos.push(turnoNew);
            }
          }
        }
      }
    }

    // CREACION DE LISTA DE TURNOS DEL ESPECIALISTA, ESTO SE GUARDA EN LA BD
    const turno: any = {};
    //@ts-ignore
    if (this.currentTurnList.id) {
      //@ts-ignore
      turno.id = this.currentTurnList.id;
    }
    turno.especialista = this.user;
    turno.turnos = listaDeTurnos;

    //@ts-ignore
    if (this.currentTurnList?.turnos?.length) {
      let especialidad: string = '';
      if (this.especialidad1) {
        especialidad = this.user.especialidad[0].nombre;
      } else {
        especialidad = this.user.especialidad[1].nombre;
      }
      //@ts-ignore
      this.currentTurnList.turnos = this.currentTurnList.turnos.filter(
        (t: any) => {
          return (
            (t.estado != 'disponible' && t.especialidad == especialidad) ||
            t.especialidad != especialidad
          );
        }
      );

      //@ts-ignore
      turno.turnos = [...this.currentTurnList.turnos];
      for (let i = 0; i < listaDeTurnos.length; i++) {
        const newTurn = listaDeTurnos[i];
        turno.turnos.push(newTurn);
      }
      this.firestoreService.updateTurnList(turno);
    } else {
      this.firestoreService.createTurnList(turno);
    }

    this.firestoreService.updateUser(this.user);
    this.showTurnsOne();
    this.notificationService.crearSwal('Horarios actualizados', 'Mi Perfil', 'success');
  }

  showTurnsOne() {
    if (!this.especialidad1) {
      this.especialidad1 = true;
      this.especialidad2 = false;
      this.turnDuration = this.user.especialidad[0].duracionTurno;
      this.deactivateDayButton();
      this.specialistDays = [...this.user.especialidad[0].diasTurnos];
      this.activateDayButton();
    }
  }

  showTurnsTwo() {
    if (!this.especialidad2) {
      this.especialidad1 = false;
      this.especialidad2 = true;
      this.turnDuration = this.user.especialidad[1].duracionTurno;
      this.deactivateDayButton();
      this.specialistDays = [...this.user.especialidad[1].diasTurnos];
      this.activateDayButton();
    }
  }

  showTurns(index: number) {
    if (index >= 0 && index < this.user.especialidad.length) {
      this.turnDuration = this.user.especialidad[index].duracionTurno;
      this.deactivateDayButton();
      this.specialistDays = this.user.especialidad[index].diasTurnos || [];
      this.activateDayButton();
    }
  }


    verHistorialClinico() {
      this.historialClinicoFiltrado = [...this.historialClinico];
    }

    filtrarHistorialClinico(especialidad: string) {
      switch (especialidad) {
        case 'todo':
          this.btnTodo = true;
          this.btnCardiologia = false;
          this.btnOdontologia = false;
          this.btnEndocrinologia = false;
          break;
        case 'cardiologia':
          this.btnTodo = false;
          this.btnCardiologia = true;
          this.btnOdontologia = false;
          this.btnEndocrinologia = false;
          break;
        case 'odontologia':
          this.btnTodo = false;
          this.btnCardiologia = false;
          this.btnOdontologia = true;
          this.btnEndocrinologia = false;
          break;
        case 'endocrinologia':
          this.btnTodo = false;
          this.btnCardiologia = false;
          this.btnOdontologia = false;
          this.btnEndocrinologia = true;
          break;
      }

      this.historialClinicoFiltrado = [];
      if (especialidad == 'todo') {
        this.historialClinicoFiltrado = [...this.historialClinico];
      } else {
        for (let i = 0; i < this.historialClinico.length; i++) {
          const historial = this.historialClinico[i];
          if (historial.especialidad == especialidad) {
            this.historialClinicoFiltrado.push(historial);
          }
        }
      }

      if (this.historialClinicoFiltrado.length == 0) {
        this.hayHistorialFiltrado = false;
      } else {
        this.hayHistorialFiltrado = true;
      }
    }

    crearPDF() {
      const DATA = document.getElementById('pdf');
      const doc = new jsPDF('p', 'pt', 'a4');
      const options = {
        background: 'white',
        scale: 2,
      };
      //@ts-ignore
      html2canvas(DATA, options)
        .then((canvas: any) => {
          const img = canvas.toDataURL('image/PNG');

          const bufferX = 30;
          const bufferY = 30;
          const imgProps = (doc as any).getImageProperties(img);
          const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          doc.addImage(
            img,
            'PNG',
            bufferX,
            bufferY,
            pdfWidth,
            pdfHeight,
            undefined,
            'FAST'
          );
          return doc;
        })
        .then((docResult: any) => {
          docResult.save(`historial_clinico.pdf`);
        });
    }
  }
