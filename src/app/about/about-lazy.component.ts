import { Component } from "@angular/core";

import { STANDARD } from "@imports";

@Component({
  selector: 'app-about-lazy',
  standalone: true,
  imports: [STANDARD],
  template: `<h2 *ngIf="visible">{{ title }}</h2>`
})
export class AboutLazyComponent {
  title = 'Standalone Demo';
  visible = true;
}
