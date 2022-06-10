import { Component } from '@angular/core';
import { ROUTER } from '@imports';
import { NavComponentComponent } from './nav-component/nav-component.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <app-nav-component></app-nav-component>
  `,
  imports: [ROUTER, NavComponentComponent ],
})
export class AppComponent {
  title = 'Angular Validation Done Right!';
}
