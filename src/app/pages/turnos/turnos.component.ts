import { Component } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { SwalService } from 'src/app/services/swal.service';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent {
  spinner: boolean = false;
  turnList: any[] = [];
  currentSpecialistTurnList: any[] = [];

  botonesEspecialidad: boolean = false;
  filtroEspecialidad: boolean = false;

  vistaListadoDeEspecialistas: boolean = false;
  listaDeEspecialistas: any[] = [];
  listaPorEspecialista: any[] = [];

  cancelacionTurno: boolean = false;
  comentarioCancelacion: string = '';
  turnoACancelar: any = {};

  palabraBusqueda: string = '';
  turnosFiltrados: any[] = [];

  constructor(
    private notificationService: SwalService,
    private firestoreService: FirestoreService
  ) { }

  ngOnInit(): void {
    this.firestoreService.getTurnList().subscribe((turns: any) => {
      this.currentSpecialistTurnList = turns;
      this.turnList = [];
      for (let i = 0; i < turns.length; i++) {
        const turnSpecialist = turns[i].turnos;
        for (let j = 0; j < turnSpecialist.length; j++) {
          const turn = turnSpecialist[j];
          if (turn.estado != 'disponible') {
            this.turnList.push(turn);
          }
        }
      }
      this.turnosFiltrados = [...this.turnList];
    });

    this.firestoreService.traerEsp().subscribe((users: any) => {
      this.spinner = false;
      if (users) {
        this.listaDeEspecialistas = users.filter(
          (u: any) => u.especialidad && u.habilitado
        );
      }
    });

  }

  cancelarTurno(turno: any) {
    this.turnoACancelar = { ...turno };
    this.cancelacionTurno = true;
    console.log(turno);
  }

  confirmarCancelacion(turno: any) {
    if (this.comentarioCancelacion == '') {
      this.notificationService.crearSwal(
        'Debes ingresar un comentario sobre la razón de la cancelación',
        'Turnos',
        'warning'
      );
    } else {
      turno.estado = 'cancelado';
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
        this.notificationService.crearSwal('Turno Cancelado', 'Turnos', 'success');
      }, 1000);
    }
  }

  filtrarPorCamposAdministrador() {
    this.turnosFiltrados = [];
    if (this.palabraBusqueda == '') {
      this.turnosFiltrados = [...this.turnList];
    } else {
      const busqueda = this.palabraBusqueda.trim().toLocaleLowerCase();
      for (let i = 0; i < this.turnList.length; i++) {
        const turno = this.turnList[i];
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
