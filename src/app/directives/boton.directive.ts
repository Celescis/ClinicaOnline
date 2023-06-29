import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';

@Directive({
  selector: '[appBoton]',
})
export class BotonDirective implements OnInit {
  @Input('appBoton') tipoBoton = '';

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.el.nativeElement.classList.add('btn');
    if (this.tipoBoton == 'pdf') {
      this.el.nativeElement.classList.add('btn-danger');
    } else if (this.tipoBoton == 'excel') {
      this.el.nativeElement.classList.add('btn-success');
    }
  }
}