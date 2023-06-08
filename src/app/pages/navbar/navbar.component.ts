import { Component, EventEmitter, Output } from '@angular/core';
import { navbarData } from './nav-data';
import { AuthService } from 'src/app/services/auth.service';
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed: boolean = false;
  navData = navbarData;
  screenWidth: number = 0;
  fechaHora: Date;
  nombreUser: string;
  fotoUser: string;


  constructor(public authService: AuthService) {
    this.nombreUser = authService.nombreLogueado;
    this.fotoUser = authService.fotoLogueado;
    this.fechaHora = new Date();
    setInterval(() => {
      this.fechaHora = new Date();
    }, 1000);
    console.log(this.nombreUser, authService.nombreLogueado);
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }
  cerrarSesion(){
    this.authService.desloguear()
  }
}
