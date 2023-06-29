import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';

@Directive({
  selector: '[appHover]',
})
export class HoverDirective implements OnInit {
  @Input('appHover') colorHover = '';

  constructor(private el: ElementRef) {}

  ngOnInit(): void {}

  @HostListener('mouseenter') onMouseEnter() {
    this.hover(this.colorHover);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hover('default');
  }

  private hover(color: string) {
    if (color == 'verde') {
      this.el.nativeElement.style.background = '#0e553f';
      this.el.nativeElement.style.transition = 'background 0.5s';
      this.el.nativeElement.style.cursor = 'pointer';
    }

    if (color == 'default') {
      this.el.nativeElement.style.background = '#83bf9b';
    }
  }
}