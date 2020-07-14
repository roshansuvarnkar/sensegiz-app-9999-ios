import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginStatusService } from './login-status.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

loginData:any
constructor(private router: Router, private login: LoginStatusService) {}


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.loginData = this.login.getLoginData()
      this.loginData = JSON.parse(this.loginData)
      console.log("url=",state)


      if(this.login.LoginStatus() && this.loginData.role == next.data.role ){
      	if(state.url == '/admin-login' && next.data.role=='admin'){
      		this.router.navigate(['/admin-dashboard'])
      	}
      	else if(state.url == '/admin-login' && next.data.role=='user'){
      		this.router.navigate(['/device-scan'])
      	}
        return true; 
      }
      else{
        this.router.navigate(['/admin-login'])
      }
  }
  
}
