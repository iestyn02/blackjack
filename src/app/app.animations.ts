import { animate, style, transition, trigger } from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  transition(':enter', [
    style({ opacity: 0, 'z-index': 1 }),
    animate('300ms', style({ opacity: 1 })),
  ]),
  transition(':leave', [
    style({ opacity: 1, 'z-index': 1 }),
    animate('300ms', style({ opacity: 0 })),
  ]),
]);
