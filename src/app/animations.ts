import { trigger, transition, style, query, group, animateChild, animate } from '@angular/animations';

export const slideInAnimation = trigger('routeAnimations', [
    transition('Home => Ingresar', [
        style({ position: 'fixed' }),
        query(':enter, :leave', [
          style({
            position: 'fixed',
            top: '100%',
            right: 0,
            width: '100%',
          }),
        ]),
        query(':enter', [style({ top: '100%' })]),
        query(':leave', animateChild()),
        group([
          query(':leave', [animate('1000ms ease-out', style({ top: '100%' }))]),
          query(':enter', [animate('1000ms ease-out', style({ top: '0%' }))]),
        ]),
        query(':enter', animateChild()),
      ]),
  transition('Ingresar => Home', [
    style({ position: 'fixed' }),
    query(':enter, :leave', [
      style({
        position: 'fixed',
        top: 0,
        right: 0,
        width: '100%',
      }),
    ]),
    query(':enter', [style({ top: '-100%' })]),
    query(':leave', animateChild()),
    group([
      query(':leave', [animate('1000ms ease-out', style({ top: '100%' }))]),
      query(':enter', [animate('1000ms ease-out', style({ top: '0%' }))]),
    ]),
    query(':enter', animateChild()),
  ]),
]);
