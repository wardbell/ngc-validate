import { Component } from '@angular/core';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatIconModule  } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule  } from '@angular/material/sidenav';
import { MatToolbarModule  } from '@angular/material/toolbar';

import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { COMMON, ROUTER } from '@imports';

@Component({
  selector: 'app-nav-component',
  standalone: true,
  templateUrl: './nav-component.component.html',
  imports: [COMMON, MatIconModule, MatListModule, MatSidenavModule, MatToolbarModule, ROUTER],
  styleUrls: ['./nav-component.component.scss']
})
export class NavComponentComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) {}

}
