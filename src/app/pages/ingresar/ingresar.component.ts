import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-ingresar',
  templateUrl: './ingresar.component.html',
  styleUrls: ['./ingresar.component.css']
})
export class IngresarComponent {
  esPaciente: boolean = false;
  esEspecialista: boolean = false;
  esAdmin: boolean = false;
  sinElegir: boolean = true;
  listaFiltrada: any;
  especialidades: any;
  listaPacientes: any;
  listaEspecialistas: any;
  listaAdmin: any;
  
  constructor(private router: Router,
    public firestoreService: FirestoreService) {
    this.esPaciente = false;
    this.esEspecialista = false;
    this.sinElegir = true;
    this.listaPacientes = [];
    this.listaEspecialistas = [];
    this.listaAdmin = [];
  }

  ngOnInit() {
    this.listaFiltrada = [];
    this.firestoreService.traerEspecialidades().subscribe((data: any[]) => {
      this.especialidades = data.map((doc: any) => doc.nombre);
      this.listaFiltrada = [...this.especialidades];
    });
    this.firestoreService.traer().subscribe(usuarios => {
      this.listaPacientes = usuarios;
    });

    this.firestoreService.traerEsp().subscribe(usuarios => {
      this.listaEspecialistas = usuarios;
    });

    this.firestoreService.traerAdmin().subscribe(usuarios => {
      this.listaAdmin = usuarios;
    });
  }

  verificarIngreso(index: number) {
    if (index == 1) {
      this.esPaciente = true;
      this.sinElegir = false;
      this.esAdmin = false;
      this.router.navigate(['/registro']);
    }
    else if (index == 2) {
      this.esEspecialista = true;
      this.sinElegir = false;
      this.router.navigate(['/registroEspecialista']);
    }
    else {
      this.esAdmin = true;
      this.sinElegir = false;
    }
  }

  volverMenuPrincipal() {
    this.router.navigate(['/ingresar']);
    this.esAdmin = false;
    this.sinElegir = true;
  }
}