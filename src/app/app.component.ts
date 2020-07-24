import { Component } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginStatusService } from './login-status.service';
import {Router} from '@angular/router'
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  onPauseSubscription:any
  loginData:any=''
  menuStatus:any = false
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private login:LoginStatusService,
    private router:Router,
    private menu: MenuController
  ) {
    this.initializeApp();
    this.loginData = this.login.getAdminLogin()
    this.loginData = JSON.parse(this.loginData)
    this.menuStatus = this.login.loginCheckStatus.subscribe((res:any)=>{
      this.loginData = this.login.getAdminLogin()
      this.loginData = JSON.parse(this.loginData)
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#f36d00');
    });
  }


  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }
  closeMenu() {
    this.menu.close();
  }


  logout(){
    this.login.logout()
    this.closeMenu()
    this.login.loginCheckStatus.next({login:false})
  }
}
