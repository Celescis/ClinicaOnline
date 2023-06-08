import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Paciente } from '../class/paciente';
import { Especialista } from '../class/especialista';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { combineLatest, map } from 'rxjs';
import { Administrador } from '../class/administrador';
import { SwalService } from './swal.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  images: string[] = [];

  constructor(private angularFirestore: AngularFirestore,
    private angularFireAuth: AngularFireAuth,
    private swalService: SwalService) {
  }

  //PACIENTES
  guardar(elemento: Paciente) {
    this.angularFireAuth.createUserWithEmailAndPassword(elemento.mail, elemento.password).then((data) => {
      data.user?.sendEmailVerification();


      const documento = this.angularFirestore.doc('pacientes/' + this.angularFirestore.createId());
      const uid = documento.ref.id;

      documento.set({
        uid: uid,
        nombre: elemento.nombre,
        apellido: elemento.apellido,
        edad: elemento.edad,
        dni: elemento.dni,
        obraSocial: elemento.obraSocial,
        mail: elemento.mail,
        password: elemento.password,
        fotos: elemento.fotos
      });
      this.swalService.crearSwal('Datos subidos correctamente', 'EXCELENTE', 'success');
    }).catch((error) => {
      const errorMessage = this.createMessage(error.code);
      this.swalService.crearSwal(errorMessage, "ERROR", "error");
    });
  }

  traer() {
    const collection = this.angularFirestore.collection<any>('pacientes');
    return collection.valueChanges();
  }

  //ESPECIALISTAS
  guardarEsp(elemento: Especialista) {
    this.angularFireAuth.createUserWithEmailAndPassword(elemento.mail, elemento.password).then((data) => {
      data.user?.sendEmailVerification();

      const documento = this.angularFirestore.doc('especialistas/' + this.angularFirestore.createId());
      const uid = documento.ref.id;

      documento.set({
        uid: uid,
        nombre: elemento.nombre,
        apellido: elemento.apellido,
        edad: elemento.edad,
        dni: elemento.dni,
        especialidad: elemento.especialidad,
        mail: elemento.mail,
        password: elemento.password,
        fotos: elemento.fotos,
        habilitado: elemento.habilitado
      });
      this.swalService.crearSwal('Datos subidos correctamente', 'EXCELENTE', 'success');
    }).catch((error) => {
      const errorMessage = this.createMessage(error.code);
      this.swalService.crearSwal(errorMessage, "ERROR", "error");
    });
  }

  traerEsp() {
    const collection = this.angularFirestore.collection<any>('especialistas');
    return collection.valueChanges();
  }


  //MANEJO DE COMPONENTE ESPECIALIDADES
  setEspecialidad(nombres: any) {
    const documento = this.angularFirestore.doc('especialidades/' + this.angularFirestore.createId());
    const uid = documento.ref.id;

    documento.set({
      uid: uid,
      nombre: nombres
    });
  }

  traerEspecialidades() {
    const collection = this.angularFirestore.collection<any>('especialidades');
    return collection.valueChanges();
  }

  //ADMINISTRADORES
  guardarAdmin(elemento: Administrador) {
    this.angularFireAuth.createUserWithEmailAndPassword(elemento.mail, elemento.password).then((data) => {
      data.user?.sendEmailVerification();

      const documento = this.angularFirestore.doc('administradores/' + this.angularFirestore.createId());
      const uid = documento.ref.id;

      documento.set({
        uid: uid,
        nombre: elemento.nombre,
        apellido: elemento.apellido,
        edad: elemento.edad,
        dni: elemento.dni,
        mail: elemento.mail,
        password: elemento.password,
        fotos: elemento.fotos
      });
      this.swalService.crearSwal('Datos subidos correctamente', 'EXCELENTE', 'success');
    }).catch((error) => {
      const errorMessage = this.createMessage(error.code);
      this.swalService.crearSwal(errorMessage, "ERROR", "error");
    });
  }

  traerAdmin() {
    const collection = this.angularFirestore.collection<any>('administradores');
    return collection.valueChanges();
  }

  //ADMINISTRACION USUARIOS
  traerUsuariosCombinados() {
    const pacientesCollection = this.angularFirestore.collection<any>('pacientes').valueChanges();
    const especialidadesCollection = this.angularFirestore.collection<any>('especialistas').valueChanges();
    const administradoresCollection = this.angularFirestore.collection<any>('administradores').valueChanges();

    return combineLatest([pacientesCollection, especialidadesCollection, administradoresCollection]).pipe(
      map(([pacientes, especialidades, administradores]) => {

        const datosCombinados = {
          pacientes,
          especialidades,
          administradores
        };

        const arrayUsuarios: any[] = [];

        for (const unUser of datosCombinados.pacientes) {
          arrayUsuarios.push(unUser);
        }
        for (const especialistas of datosCombinados.especialidades) {
          arrayUsuarios.push(especialistas);
        }
        for (const admin of datosCombinados.administradores) {
          arrayUsuarios.push(admin);
        }

        return arrayUsuarios;
      })
    );
  }

  updateEspecialista(userMod: any) {
    this.angularFirestore
      .doc<any>(`especialistas/${userMod.uid}`)
      .update(userMod)
      .then(() => { })
      .catch((error) => {
      });
  }


  private createMessage(errorCode: string): string {
    let message: string = '';
    switch (errorCode) {
      case 'auth/internal-error':
        message = 'Los campos estan vacios';
        break;
      case 'auth/operation-not-allowed':
        message = 'La operación no está permitida.';
        break;
      case 'auth/email-already-in-use':
        message = 'El email ya está registrado.';
        break;
      case 'auth/invalid-email':
        message = 'El email no es valido.';
        break;
      case 'auth/weak-password':
        message = 'La contraseña debe tener al menos 6 caracteres';
        break;
      default:
        message = 'Error al crear el usuario.';
        break;
    }

    return message;
  }
}
