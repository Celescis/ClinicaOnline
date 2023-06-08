import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalService {

  constructor() { }
  crearSwal(mensaje:string, titulo:string, icono:SweetAlertIcon) {
    return Swal.fire(titulo, mensaje, icono);
  }
}
