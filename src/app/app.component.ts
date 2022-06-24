import { Component } from '@angular/core';
import { ROUTER } from '@imports';
import { NavComponentComponent } from './nav-component/nav-component.component';
import { SpinnerComponent } from '@core/spinner/spinner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <app-nav-component></app-nav-component>
    <app-spinner></app-spinner>
  `,
  imports: [ROUTER, NavComponentComponent, SpinnerComponent],
})
export class AppComponent {
  title = 'Angular Validation Done Right!';
}
