import { Component, OnInit, ViewChild, ViewContainerRef } from "@angular/core";

@Component({
  selector: 'app-about',
  standalone: true,

  template: `
    <h1>About</h1>
    <ng-container #container></ng-container>
  `
})
export class AboutComponent implements OnInit {
  title = 'Standalone Demo';

  @ViewChild('container', {read: ViewContainerRef})
  viewContainer!: ViewContainerRef;

  async ngOnInit() {
    const esm = await import('./about-lazy.component');
    const ref = this.viewContainer.createComponent(esm.AboutLazyComponent)
    ref.instance.title = `Lazy About Sub Component !!`;
  }
}
