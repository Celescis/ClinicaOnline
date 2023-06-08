import { Component, EventEmitter, Output } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  @Output() botonClickeadoUsuarios = new EventEmitter<any>();
  listaPacientes: any;
  listaEspecialistas: any;
  listaAdmin: any;

  constructor(private firestoreService: FirestoreService) {
    this.listaPacientes = [];
    this.listaEspecialistas = [];
    this.listaAdmin = [];
  }

  ngOnInit(): void {
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

  clickListado(usuario: any) {
    this.botonClickeadoUsuarios.emit(usuario);
  }
  

}
