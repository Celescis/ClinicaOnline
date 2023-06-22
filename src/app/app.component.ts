import { Component } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { environment } from 'src/environments/environment';
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Clinica Online';
  isSideNavCollapsed = false;
  screenWidth = 0;

  constructor() {
    firebase.initializeApp(environment.firebase);
  }


  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
}
