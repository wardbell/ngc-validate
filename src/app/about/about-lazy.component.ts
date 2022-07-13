import { Component } from "@angular/core";

import { COMMON } from "@imports";

@Component({
  selector: 'app-about-lazy',
  standalone: true,
  imports: [COMMON],
  
  template: `<h2 *ngIf="visible">{{ title }}</h2>`
})
export class AboutLazyComponent {
  title = 'Standalone Demo';
  visible = true;
}
