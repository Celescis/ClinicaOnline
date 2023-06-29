import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { SwalService } from 'src/app/services/swal.service';

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.css']
})
export class MisTurnosComponent {
  formHistorial: FormGroup;
  user: any = null;
  isPaciente: boolean = false;
  isEspecialista: boolean = false;
  spinner: boolean = false;
  turnList: any[] = [];
  currentSpecialistTurnList: any[] = [];

  botonesEspecialidad: boolean = false;
  filtroEspecialidad: boolean = false;
  btnCardiologia: boolean = false;
  btnOdontologia: boolean = false;
  btnEndocrinologia: boolean = false;
  listaPorEspecialidad: any[] = [];

  vistaListadoDeEspecialistas: boolean = false;
  listaDeEspecialistas: any[] = [];
  listaPorEspecialista: any[] = [];

  cancelacionTurno: boolean = false;
  comentarioCancelacion: string = '';
  turnoACancelar: any = {};

  turnosDelPaciente: any[] = [];
  turnosDelEspecialista: any[] = [];
  pacientesDelEspecialista: any[] = [];
  auxPacientesDelEspecialista: any[] = [];

  vistaComentario: boolean = false;
  turnoACalificar: any = {};
  vistaComentarioCalificacion: boolean = false;
  comentarioCalificacion: string = '';

  botonCancelar: boolean = true;
  botonRechazar: boolean = true;
  confirmacionRechazo: boolean = false;
  confirmacionFinalizacion: boolean = false;
  comentarioFinalizacion: string = '';
  turnoAFinalizar: any = {};

  turnoFinalizado: any = {};

  cantidadClaveValor: number = 0;
  arrayClaveValorAdicionales: any[] = [];
  dato1: string[] = ['', ''];
  dato2: string[] = ['', ''];
  dato3: string[] = ['', ''];

  palabraBusqueda: string = '';
  turnosFiltrados: any[] = [];

  constructor(
    private authService: AuthService,
    private notificationService: SwalService,
    private formBuilder: FormBuilder,
    private firestoreService: FirestoreService
  ) {
    this.formHistorial = this.formBuilder.group({
      altura: ['', [Validators.required]],
      peso: ['', [Validators.required]],
      temperatura: ['', [Validators.required]],
      presion: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.spinner = true;
    this.authService.user$.subscribe((user: any) => {
      if (user) {
        this.spinner = false;
        this.user = user;
        if (this.user.obraSocial) {
          this.isPaciente = true;
        } else {
          this.isEspecialista = true;
        }

        this.firestoreService.getTurnList().subscribe((turns: any) => {
          this.currentSpecialistTurnList = turns;
          this.turnList = [];
          this.turnosFiltrados = [];
          this.turnosDelPaciente = [];
          this.turnosDelEspecialista = [];
          this.pacientesDelEspecialista = [];
          this.auxPacientesDelEspecialista = [];
          for (let i = 0; i < turns.length; i++) {
            const turnSpecialist = turns[i].turnos;
            for (let j = 0; j < turnSpecialist.length; j++) {
              const turn = turnSpecialist[j];
              if (turn.estado != 'disponible' && !this.turnList.includes(turn)) {
                this.turnList.push(turn);
                if (turn.paciente.uid == this.user.uid) {
                  this.turnosDelPaciente.push(turn);
                }
                if (turn.especialista.uid == this.user.uid) {
                  this.turnosDelEspecialista.push(turn);
                  this.auxPacientesDelEspecialista.push(turn.paciente);
                }
              }
            }
          }
          

          for (let i = 0; i < this.auxPacientesDelEspecialista.length; i++) {
            const paciente = this.auxPacientesDelEspecialista[i];
            const index = this.pacientesDelEspecialista.findIndex((p) => {
              return paciente.uid == p.uid;
            });
            if (index == -1) {
              this.pacientesDelEspecialista.push(paciente);
            }
          }

          if (this.isPaciente) {
            this.turnosFiltrados = [...this.turnosDelPaciente];
          } else if (this.isEspecialista) {
            this.turnosFiltrados = [...this.turnosDelEspecialista];
          }
        });
      }
    });

    this.firestoreService.traerEsp().subscribe((users:any) => {
      this.spinner = false;
      if (users) {
        this.listaDeEspecialistas = users.filter(
          (u:any) => u.especialidad && u.habilitado
        );
      }
    });

  }

  verBotonesEspecialidades() {
    this.botonesEspecialidad = !this.botonesEspecialidad;
    this.btnCardiologia = false;
    this.btnOdontologia = false;
    this.btnEndocrinologia = false;
    this.vistaListadoDeEspecialistas = false;
    this.filtroEspecialidad = false;
  }

  filtrarPorEspecialidad(especialidad: string) {
    this.spinner = true;
    setTimeout(() => {
      this.activarBoton(especialidad);
      this.spinner = false;
      this.listaPorEspecialidad = [];
      this.filtroEspecialidad = true;
      for (let i = 0; i < this.turnosDelPaciente.length; i++) {
        const turno = this.turnosDelPaciente[i];
        if (turno.especialidad == especialidad) {
          this.listaPorEspecialidad.push(turno);
        }
      }
    }, 500);
  }

  filtrarPorEspecialidadDelEspecialista(especialidad: string) {
    this.spinner = true;
    setTimeout(() => {
      this.activarBoton(especialidad);
      this.spinner = false;
      this.listaPorEspecialidad = [];
      this.filtroEspecialidad = true;
      for (let i = 0; i < this.turnosDelEspecialista.length; i++) {
        const turno = this.turnosDelEspecialista[i];
        if (turno.especialidad == especialidad) {
          this.listaPorEspecialidad.push(turno);
        }
      }
    }, 500);
  }

  activarBoton(especialidad: string) {
    switch (especialidad) {
      case 'Cardiología':
        this.btnCardiologia = true;
        this.btnOdontologia = false;
        this.btnEndocrinologia = false;
        break;
      case 'Odontología':
        this.btnCardiologia = false;
        this.btnOdontologia = true;
        this.btnEndocrinologia = false;
        break;
      case 'Endocrinología':
        this.btnCardiologia = false;
        this.btnOdontologia = false;
        this.btnEndocrinologia = true;
        break;
    }
  }

  verListaDeEspecialistas() {
    this.vistaListadoDeEspecialistas = !this.vistaListadoDeEspecialistas;
    this.listaPorEspecialista = [...this.turnosDelPaciente];
    this.botonesEspecialidad = false;
    this.btnCardiologia = false;
    this.btnOdontologia = false;
    this.btnEndocrinologia = false;
    this.filtroEspecialidad = false;
  }

  elegirEspecialista(especialista: any) {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      this.listaPorEspecialista = [];
      this.filtroEspecialidad = true;
      for (let i = 0; i < this.turnosDelPaciente.length; i++) {
        const turno = this.turnosDelPaciente[i];
        if (turno.especialista.uid == especialista.uid) {
          this.listaPorEspecialista.push(turno);
        }
      }
    }, 500);
  }

  verListaDePacientes() {
    this.vistaListadoDeEspecialistas = !this.vistaListadoDeEspecialistas;
    this.listaPorEspecialista = [...this.turnosDelEspecialista];
    this.botonesEspecialidad = false;
    this.filtroEspecialidad = false;
  }

  elegirPaciente(paciente: any) {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      this.listaPorEspecialista = [];
      this.filtroEspecialidad = true;
      for (let i = 0; i < this.turnosDelEspecialista.length; i++) {
        const turno = this.turnosDelEspecialista[i];
        if (turno.paciente.uid == paciente.uid) {
          this.listaPorEspecialista.push(turno);
        }
      }
    }, 500);
  }

  cancelarTurno(turno: any) {
    this.turnoACancelar = { ...turno };
    this.cancelacionTurno = true;
    this.vistaComentario = false;
    this.vistaComentarioCalificacion = false;
    this.botonRechazar = !this.botonRechazar;
    this.confirmacionFinalizacion = false;
    console.log(turno);
  }

  confirmarCancelacion(turno: any) {
    if (this.comentarioCancelacion == '') {
      this.notificationService.crearSwal(
        'Debes ingresar un comentario sobre la razón de la cancelación',
        'Turnos', 'warning'
      );
    } else {
      if (this.botonCancelar) {
        turno.estado = 'cancelado';
      } else {
        turno.estado = 'rechazado';
      }
      turno.comentarioPaciente = this.comentarioCancelacion;
      for (let i = 0; i < this.currentSpecialistTurnList.length; i++) {
        const turnosEspecialista = this.currentSpecialistTurnList[i];
        const index = turnosEspecialista.turnos.findIndex((t: any) => {
          return (
            new Date(t.fecha.seconds * 1000).getTime() ==
            new Date(turno.fecha.seconds * 1000).getTime() &&
            t.especialidad == turno.especialidad
          );
        });
        turnosEspecialista.turnos[index] = turno;
        this.firestoreService.updateTurnList(turnosEspecialista);
      }

      this.spinner = true;
      setTimeout(() => {
        this.spinner = false;
        this.turnoACancelar = {};
        this.cancelacionTurno = false;
        this.confirmacionFinalizacion = false;
        this.notificationService.crearSwal('Turno Cancelado', 'Turnos', 'success');
      }, 1000);
    }
  }

  cancelarTurnoEspecialista(turno: any) {
    this.turnoACancelar = { ...turno };
    this.cancelacionTurno = true;
    this.vistaComentario = false;
    this.vistaComentarioCalificacion = false;
    this.botonRechazar = !this.botonRechazar;
    this.confirmacionFinalizacion = false;
    console.log(turno);
  }

  confirmarCancelacionRechazoEspecialista(turno: any) {
    if (this.comentarioCancelacion == '') {
      this.notificationService.crearSwal(
        'Debes ingresar un comentario sobre la razón de la cancelación o rechazo',
        'Turnos',
        'warning'
      );
    } else {
      if (this.botonCancelar) {
        turno.estado = 'cancelado';
      } else {
        turno.estado = 'rechazado';
      }
      turno.comentario = this.comentarioCancelacion;
      for (let i = 0; i < this.currentSpecialistTurnList.length; i++) {
        const turnosEspecialista = this.currentSpecialistTurnList[i];
        const index = turnosEspecialista.turnos.findIndex((t: any) => {
          return (
            new Date(t.fecha.seconds * 1000).getTime() ==
            new Date(turno.fecha.seconds * 1000).getTime() &&
            t.especialidad == turno.especialidad
          );
        });
        turnosEspecialista.turnos[index] = turno;
        this.firestoreService.updateTurnList(turnosEspecialista);
      }

      this.spinner = true;
      setTimeout(() => {
        this.spinner = false;
        this.turnoACancelar = {};
        this.cancelacionTurno = false;
        this.confirmacionRechazo = false;
        this.confirmacionFinalizacion = false;
        this.notificationService.crearSwal('Turno Cancelado', 'Turnos', 'success');
      }, 1000);
    }
  }

  calificarTurno(turno: any) {
    this.turnoACalificar = { ...turno };
    this.vistaComentarioCalificacion = true;
    this.vistaComentario = false;
    this.confirmacionFinalizacion = false;
  }

  confirmarCalificacion(turno: any) {
    if (this.comentarioCalificacion == '') {
      this.notificationService.crearSwal(
        'Debes ingresar un comentario para calificar.',
        'Turnos',
        'warning'
      );
    } else {
      turno.comentarioPaciente = this.comentarioCalificacion;
      for (let i = 0; i < this.currentSpecialistTurnList.length; i++) {
        const turnosEspecialista = this.currentSpecialistTurnList[i];
        const index = turnosEspecialista.turnos.findIndex((t: any) => {
          return (
            new Date(t.fecha.seconds * 1000).getTime() ==
            new Date(turno.fecha.seconds * 1000).getTime() &&
            t.especialidad == turno.especialidad
          );
        });
        turnosEspecialista.turnos[index] = turno;
        this.firestoreService.updateTurnList(turnosEspecialista);
      }

      this.spinner = true;
      setTimeout(() => {
        this.spinner = false;
        this.turnoACalificar = {};
        this.vistaComentarioCalificacion = false;
        this.confirmacionFinalizacion = false;
        this.notificationService.crearSwal('Turno Calificado', 'Turnos', 'success');
      }, 1000);
    }
  }

  verComentario(turno: any) {
    this.turnoACancelar = { ...turno };
    this.vistaComentario = true;
    this.cancelacionTurno = false;
    this.vistaComentarioCalificacion = false;
    this.botonCancelar = true;
    this.confirmacionFinalizacion = false;
  }

  rechazarTurno(turno: any) {
    this.turnoACancelar = { ...turno };
    this.botonCancelar = !this.botonCancelar;
    this.vistaComentario = false;
    this.vistaComentarioCalificacion = false;
    this.cancelacionTurno = true;
    this.confirmacionRechazo = true;
    this.confirmacionFinalizacion = false;
  }

  aceptarTurno(turno: any) {
    turno.estado = 'aceptado';
    for (let i = 0; i < this.currentSpecialistTurnList.length; i++) {
      const turnosEspecialista = this.currentSpecialistTurnList[i];
      const index = turnosEspecialista.turnos.findIndex((t: any) => {
        return (
          new Date(t.fecha.seconds * 1000).getTime() ==
          new Date(turno.fecha.seconds * 1000).getTime() &&
          t.especialidad == turno.especialidad
        );
      });
      turnosEspecialista.turnos[index] = turno;
      this.firestoreService.updateTurnList(turnosEspecialista);
    }

    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      this.vistaComentario = false;
      this.vistaComentarioCalificacion = false;
      this.cancelacionTurno = false;
      this.confirmacionRechazo = false;
      this.confirmacionFinalizacion = false;
      this.notificationService.crearSwal('Turno Aceptado', 'Turnos', 'success');
    }, 1000);
  }

  finalizarTurno(turno: any) {
    this.turnoAFinalizar = { ...turno };
    this.confirmacionFinalizacion = true;
    this.vistaComentario = false;
    this.vistaComentarioCalificacion = false;
  }

  confirmarFinalizacion(turno: any) {
    turno.estado = 'realizado';
    turno.comentario = this.comentarioFinalizacion;
    for (let i = 0; i < this.currentSpecialistTurnList.length; i++) {
      const turnosEspecialista = this.currentSpecialistTurnList[i];
      const index = turnosEspecialista.turnos.findIndex((t: any) => {
        return (
          new Date(t.fecha.seconds * 1000).getTime() ==
          new Date(turno.fecha.seconds * 1000).getTime() &&
          t.especialidad == turno.especialidad
        );
      });
      turnosEspecialista.turnos[index] = turno;
      this.firestoreService.updateTurnList(turnosEspecialista);
    }

    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      this.turnoACancelar = {};
      this.cancelacionTurno = false;
      this.confirmacionRechazo = false;
      this.confirmacionFinalizacion = false;
      this.notificationService.crearSwal('Turno Finalizado', 'Turnos', 'success');
    }, 1000);
  }

  abrirFormHistorialClinico(turno: any) {
    this.turnoFinalizado = { ...turno };
  }

  agregarClaveValor() {
    if (this.cantidadClaveValor < 3) {
      this.cantidadClaveValor++;
      if (this.cantidadClaveValor == 1) {
        this.arrayClaveValorAdicionales.push(this.dato1);
      } else if (this.cantidadClaveValor == 2) {
        this.arrayClaveValorAdicionales.push(this.dato2);
      } else {
        this.arrayClaveValorAdicionales.push(this.dato3);
      }
    }
  }

  crearHistorialClinico() {
    if (this.formHistorial.valid) {
      let detalle: any = {
        altura: this.formHistorial.getRawValue().altura,
        peso: this.formHistorial.getRawValue().peso,
        temperatura: this.formHistorial.getRawValue().temperatura,
        presion: this.formHistorial.getRawValue().presion,
      };

      let detalleAdicional: any = {};
      if (this.arrayClaveValorAdicionales.length == 1) {
        detalleAdicional.clave1 = this.dato1[0];
        detalleAdicional.valor1 = this.dato1[1];
      }
      if (this.arrayClaveValorAdicionales.length == 2) {
        detalleAdicional.clave1 = this.dato1[0];
        detalleAdicional.valor1 = this.dato1[1];
        detalleAdicional.clave2 = this.dato2[0];
        detalleAdicional.valor2 = this.dato2[1];
      }
      if (this.arrayClaveValorAdicionales.length == 3) {
        detalleAdicional.clave1 = this.dato1[0];
        detalleAdicional.valor1 = this.dato1[1];
        detalleAdicional.clave2 = this.dato2[0];
        detalleAdicional.valor2 = this.dato2[1];
        detalleAdicional.clave3 = this.dato3[0];
        detalleAdicional.valor3 = this.dato3[1];
      }

      this.turnoFinalizado.detalle = detalle;
      this.turnoFinalizado.detalleAdicional = detalleAdicional;
      this.spinner = true;
      this.modificarTurnoFinalizado(this.turnoFinalizado);
      this.firestoreService
        .createHistorialClinico(this.turnoFinalizado)
        .then(() => {
          this.spinner = false;
          this.dato1 = ['clave 1', 'valor 1'];
          this.dato2 = ['clave 2', 'valor 2'];
          this.dato3 = ['clave 3', 'valor 3'];
          this.arrayClaveValorAdicionales = [];
          this.cantidadClaveValor = 0;
          this.formHistorial.reset();
          this.notificationService.crearSwal(
            'Historial clínico creado',
            'Mis Turnos'
            , 'success'
          );
        })
        .catch(() => {
          this.spinner = false;
        });
    }
  }

  modificarTurnoFinalizado(turno: any) {
    turno.historial = true;
    for (let i = 0; i < this.currentSpecialistTurnList.length; i++) {
      const turnosEspecialista = this.currentSpecialistTurnList[i];
      const index = turnosEspecialista.turnos.findIndex((t: any) => {
        return (
          new Date(t.fecha.seconds * 1000).getTime() ==
          new Date(turno.fecha.seconds * 1000).getTime() &&
          t.especialidad == turno.especialidad
        );
      });
      turnosEspecialista.turnos[index] = turno;
      this.firestoreService.updateTurnList(turnosEspecialista);
    }
  }

  filtrarPorCamposPaciente() {
    this.turnosFiltrados = [];
    if (this.palabraBusqueda == '') {
      this.turnosFiltrados = [...this.turnosDelPaciente];
    } else {
      const busqueda = this.palabraBusqueda.trim().toLocaleLowerCase();
      for (let i = 0; i < this.turnosDelPaciente.length; i++) {
        const turno = this.turnosDelPaciente[i];
        const fechaBusqueda = this.transformarFechaParaBusqueda(turno.fecha);
        if (
          turno.especialista.nombre.toLocaleLowerCase().includes(busqueda) ||
          turno.especialista.apellido.toLocaleLowerCase().includes(busqueda) ||
          turno.especialidad.toLocaleLowerCase().includes(busqueda) ||
          turno.estado.toLocaleLowerCase().includes(busqueda) ||
          turno.paciente.nombre.toLocaleLowerCase().includes(busqueda) ||
          turno.paciente.apellido.toLocaleLowerCase().includes(busqueda) ||
          turno.paciente.obraSocial.toLocaleLowerCase().includes(busqueda) ||
          fechaBusqueda.includes(busqueda) ||
          turno?.detalle?.altura?.toString().includes(busqueda) ||
          turno?.detalle?.peso?.toString().includes(busqueda) ||
          turno?.detalle?.temperatura?.toString().includes(busqueda) ||
          turno?.detalle?.presion?.includes(busqueda) ||
          turno?.detalleAdicional?.clave1?.includes(busqueda) ||
          turno?.detalleAdicional?.clave2?.includes(busqueda) ||
          turno?.detalleAdicional?.clave3?.includes(busqueda) ||
          turno?.detalleAdicional?.valor1?.includes(busqueda) ||
          turno?.detalleAdicional?.valor2?.includes(busqueda) ||
          turno?.detalleAdicional?.valor3?.includes(busqueda)
        ) {
          this.turnosFiltrados.push(turno);
        }
      }
    }
  }

  filtrarPorCamposEspecialista() {
    this.turnosFiltrados = [];
    if (this.palabraBusqueda == '') {
      this.turnosFiltrados = [...this.turnosDelEspecialista];
    } else {
      const busqueda = this.palabraBusqueda.trim().toLocaleLowerCase();
      for (let i = 0; i < this.turnosDelEspecialista.length; i++) {
        const turno = this.turnosDelEspecialista[i];
        const fechaBusqueda = this.transformarFechaParaBusqueda(turno.fecha);
        if (
          turno.especialista.nombre.toLocaleLowerCase().includes(busqueda) ||
          turno.especialista.apellido.toLocaleLowerCase().includes(busqueda) ||
          turno.especialidad.toLocaleLowerCase().includes(busqueda) ||
          turno.estado.toLocaleLowerCase().includes(busqueda) ||
          turno.paciente.nombre.toLocaleLowerCase().includes(busqueda) ||
          turno.paciente.apellido.toLocaleLowerCase().includes(busqueda) ||
          turno.paciente.obraSocial.toLocaleLowerCase().includes(busqueda) ||
          fechaBusqueda.includes(busqueda) ||
          turno?.detalle?.altura?.toString().includes(busqueda) ||
          turno?.detalle?.peso?.toString().includes(busqueda) ||
          turno?.detalle?.temperatura?.toString().includes(busqueda) ||
          turno?.detalle?.presion?.includes(busqueda) ||
          turno?.detalleAdicional?.clave1?.includes(busqueda) ||
          turno?.detalleAdicional?.clave2?.includes(busqueda) ||
          turno?.detalleAdicional?.clave3?.includes(busqueda) ||
          turno?.detalleAdicional?.valor1?.includes(busqueda) ||
          turno?.detalleAdicional?.valor2?.includes(busqueda) ||
          turno?.detalleAdicional?.valor3?.includes(busqueda)
        ) {
          this.turnosFiltrados.push(turno);
        }
      }
    }
  }

  transformarFechaParaBusqueda(value: any) {
    if (value.seconds) {
      value = new Date(value.seconds * 1000);
    }
    let rtn =
      value.getFullYear() +
      '-' +
      (value.getMonth() + 1) +
      '-' +
      value.getDate();
    if (parseInt(rtn.split('-')[2]) < 10 && parseInt(rtn.split('-')[2]) > 0) {
      rtn =
        value.getFullYear() +
        '-' +
        (value.getMonth() + 1) +
        '-0' +
        value.getDate();
    } else {
      rtn =
        value.getFullYear() +
        '-' +
        (value.getMonth() + 1) +
        '-' +
        value.getDate();
    }
    return rtn;
  }
}
