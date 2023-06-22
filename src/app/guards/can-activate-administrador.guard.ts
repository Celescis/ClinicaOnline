import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CanActivateAdministradorGuard implements CanActivate {

  constructor(private userService:AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
   
      if (this.userService.esAdmin) {
        console.log('Usuario Admin Logueado CanActivate');
        return true;
      }
        this.router.navigate(['home']);
        return false;
  }
  

}
