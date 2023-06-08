import { Component, EventEmitter, Output } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { SwalService } from 'src/app/services/swal.service';

@Component({
  selector: 'app-especialidades',
  templateUrl: './especialidades.component.html',
  styleUrls: ['./especialidades.component.css']
})
export class EspecialidadesComponent {
  @Output() botonClickeado = new EventEmitter<any>();
  especialidades: string[] = [];
  listaFiltrada: string[] = [];
  valorInput: string;
  nuevaEspecialidad: string;
  inputValidado: boolean = false;
  listaEspecialidades: any;

  constructor(public firestoreService: FirestoreService,
    private swalService: SwalService,) {
    this.listaEspecialidades = [];
    this.nuevaEspecialidad = "";
    this.valorInput = "";
  }

  ngOnInit(): void {
    this.listaFiltrada = [];
    this.firestoreService.traerEspecialidades().subscribe((data: any[]) => {
      this.especialidades = data.map((doc: any) => doc.nombre);
      this.listaFiltrada = [...this.especialidades];
    });
  }

  validarEspecialidad() {
    if (this.valorInput.match(/^[a-zA-Z ]+$/)) {
      this.inputValidado = true;
      this.nuevaEspecialidad = this.valorInput;
    }
    else {
      this.inputValidado = false;
    }
    this.valorInput = '';
    this.listaFiltrada = [...this.especialidades];
  }

  filtrarLista() {
    this.listaFiltrada = this.especialidades.filter((item: string) =>
      item.toLowerCase().includes(this.valorInput.toLowerCase())
    );
  }

  agregarItem() {
    if (this.inputValidado) {
      this.firestoreService.setEspecialidad(this.nuevaEspecialidad);
      this.swalService.crearSwal("Especialidad agregada con éxito!", "AGREGADA", 'success');
    }
    else {
      this.swalService.crearSwal("Sólo debe contener letras", "FALLÓ AL AGREGAR", 'error');
    }
  }


  ayuda() {
    this.swalService.crearSwal("Si no encuentra su especialidad en la lista, puede agregarla escribiendola y tocando el botón '+'", "Modo de uso:", 'info');
  }

  // clickListado(especialidad: any) {
  //   this.botonClickeado.emit(especialidad);
  // }
  clickListado(especialidad: any) {
    if (!this.listaEspecialidades.includes(especialidad) && this.listaEspecialidades.length < 5) {
      this.listaEspecialidades.push(especialidad);
      this.botonClickeado.emit(this.listaEspecialidades);
    }
    else if (this.listaEspecialidades.includes(especialidad) && this.listaEspecialidades.length < 6) {
      let indice = this.listaEspecialidades.indexOf(especialidad);
      this.listaEspecialidades.splice(indice, 1);
      this.botonClickeado.emit(this.listaEspecialidades);
    }
  }
}
