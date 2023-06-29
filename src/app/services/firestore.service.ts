import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Paciente } from '../class/paciente';
import { Especialista } from '../class/especialista';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { combineLatest, map } from 'rxjs';
import { Administrador } from '../class/administrador';
import { SwalService } from './swal.service';
import { user } from '@angular/fire/auth';

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

      const uid = data.user?.uid;

      const documento = this.angularFirestore.doc('pacientes/' + uid);

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
      const uid = data.user?.uid;

      const documento = this.angularFirestore.doc('especialistas/' + uid);

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
      const uid = data.user?.uid;

      const documento = this.angularFirestore.doc('administradores/' + uid);

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
    const pacientesCollection = this.angularFirestore.collection<Paciente>('pacientes').valueChanges();
    const especialistasCollection = this.angularFirestore.collection<Especialista>('especialistas').valueChanges();
    const administradoresCollection = this.angularFirestore.collection<Administrador>('administradores').valueChanges();

    return combineLatest([pacientesCollection, especialistasCollection, administradoresCollection]).pipe(
      map(([pacientes, especialistas, administradores]) => {

        const datosCombinados = {
          pacientes,
          especialistas,
          administradores
        };

        const arrayUsuarios: any[] = [];

        for (const unUser of datosCombinados.pacientes) {
          arrayUsuarios.push(unUser);
        }
        for (const especialistas of datosCombinados.especialistas) {
          arrayUsuarios.push(especialistas);
        }
        for (const admin of datosCombinados.administradores) {
          arrayUsuarios.push(admin);
        }

        return arrayUsuarios;
      })
    );
  }

  traerUsuario(uid: string) {
    return this.traerUsuariosCombinados().pipe(
      map((usuarios: any[]) => {
        return usuarios.find(user => user.uid === uid);
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

  //TURNOS
  updateUser(userMod: any) {
    if(userMod.obraSocial)
    {
      this.angularFirestore
        .doc<any>(`pacientes/${userMod.uid}`)
        .update(userMod)
        .then(() => { })
        .catch((error) => {
          this.swalService.crearSwal('Ocurrio un error', 'Administrador', 'error');
        });
    }else if(userMod.especialidad){
      this.angularFirestore
        .doc<any>(`especialistas/${userMod.uid}`)
        .update(userMod)
        .then(() => { })
        .catch((error) => {
          this.swalService.crearSwal('Ocurrio un error', 'Administrador', 'error');
        });
    }
    else
    {
      this.angularFirestore
      .doc<any>(`administradores/${userMod.uid}`)
      .update(userMod)
      .then(() => { })
      .catch((error) => {
        this.swalService.crearSwal('Ocurrio un error', 'Administrador', 'error');
      });
    }
  }
  
  
  createTurnList(turn: any) {
    this.angularFirestore
      .collection<any>('turnos')
      .add(turn)
      .then((data) => {
        this.angularFirestore.collection('turnos').doc(data.id).set({
          id: data.id,
          especialista: turn.especialista,
          turnos: turn.turnos,
        });
      });
  }

  getTurnList() {
    const collection = this.angularFirestore.collection<any>('turnos');
    return collection.valueChanges();
  }

  updateTurnList(turn: any) {
    this.angularFirestore
      .doc<any>(`turnos/${turn.id}`)
      .update(turn)
      .then(() => { })
      .catch((error) => {
        this.swalService.crearSwal('Ocurrio un error', 'Administrador', 'error');
      });
  }

  createHistorialClinico(turn: any) {
    return this.angularFirestore
      .collection<any>('historialesClinicos')
      .add(turn)
      .then((data) => {
        this.angularFirestore
          .collection('historialesClinicos')
          .doc(data.id)
          .set({
            id: data.id,
            especialidad: turn.especialidad,
            especialista: turn.especialista,
            paciente: turn.paciente,
            fecha: turn.fecha,
            detalle: turn.detalle,
            detalleAdicional: turn.detalleAdicional,
          });
      })
      .catch((error) => {
        throw error;
      });
  }

  getHistorialesClinicos() {
    const collection = this.angularFirestore.collection<any>(
      'historialesClinicos'
    );
    return collection.valueChanges();
  }

  //INFORME USUARIOS
  createUserLog(user: any) {
    const log: any = {
      fecha: new Date(),
      uid: user.uid,
      perfil: user.obraSocial ? "Paciente" : (user.especialidad ? "Especialista" : "Administrador"),
      nombre: user.nombre,
      apellido: user.apellido,
      foto: user.fotos[0]
    };
  
    return this.angularFirestore.collection('logUsuarios').add(log);
  }
  

  getUsersLog() {
    const collection = this.angularFirestore.collection<any>(
      'logUsuarios',
      (ref) => ref.orderBy('fecha', 'desc')
    );
    return collection.valueChanges();
  }
}
