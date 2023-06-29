import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';

@Directive({
  selector: '[appTarjeta]',
})
export class TarjetaDirective implements OnInit {
  @Input('appTarjeta') tipoTarjeta = '';

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    const img = document.createElement('img');
    const p = document.createElement('p');
    const small = document.createElement('small');
    let contenidoP: any = '';
    let contenidoSmall: any = '';

    //IMG ESTILOS
    img.style.marginTop = '2%';
    img.style.width = '15%';
    img.style.height = '15%';
    img.style.marginLeft = '2%';
    img.style.marginRight = '2%';
    //P ESTILOS
    p.style.textAlign = 'center';
    p.style.textTransform = 'uppercase';
    p.style.color = '#fff';
    p.style.fontWeight = 'bolder';
    p.style.textShadow = '1px 1px 2px rgb(0, 0, 0)';
    p.style.marginTop = '1rem';
    //SMALL ESTILOS
    // small.style.display='block';
    small.style.color = '#000';
    small.style.fontSize = '1rem';
    small.style.textAlign = 'left';

    if (this.tipoTarjeta == 'log') {
      img.src = '/assets/usuarios/personas.png';
      contenidoP = document.createTextNode('LOG DE USUARIOS');
      contenidoSmall = document.createTextNode(
        'Información de ingresos al sistema'
      );
    } else if (this.tipoTarjeta == 'especialidad') {
      img.src = '/assets/informes/linea.png';
      contenidoP = document.createTextNode('POR ESPECIALIDAD');
      contenidoSmall = document.createTextNode(
        'Cantidad de turnos por especialidad'
      );
    } else if (this.tipoTarjeta == 'dia') {
      img.src = '/assets/informes/barra.png';
      contenidoP = document.createTextNode('TURNOS POR DÍA');
      contenidoSmall = document.createTextNode(
        'Cantidad de turnos por día'
      );
    } else if (this.tipoTarjeta == 'solicitados') {
      img.src = '/assets/informes/radar.png';
      contenidoP = document.createTextNode('TURNOS SOLICITADOS');
      contenidoSmall = document.createTextNode(
        'Cantidad de turnos solicitados por un médico en un lapso de tiempo'
      );
    } else if (this.tipoTarjeta == 'finalizados') {
      img.src = '/assets/informes/dona.png';
      contenidoP = document.createTextNode('TURNOS FINALIZADOS');
      contenidoSmall = document.createTextNode(
        'Cantidad de turnos finalizados por un médico en un lapso de tiempo'
      );
    }

    p.appendChild(contenidoP);
    small.appendChild(contenidoSmall);

    this.el.nativeElement.appendChild(img);
    this.el.nativeElement.appendChild(p);
    this.el.nativeElement.appendChild(small);
  }
}