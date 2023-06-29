import { Component } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { environment } from 'src/environments/environment';
import { slideInAnimation } from './animations';
import { RouterOutlet } from '@angular/router';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    slideInAnimation
  ]
})
export class AppComponent {
  title = 'Clinica Online';
  isSideNavCollapsed = false;
  screenWidth = 0;

  constructor() {
    firebase.initializeApp(environment.firebase);
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData["animation"];
  }

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
}
