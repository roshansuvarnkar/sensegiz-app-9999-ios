import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class LoginStatusService {

  constructor(

    private router:Router
  ) { }

  adminLoginStatus(){
  	var status = localStorage.getItem('sensegizAdminLogin')
  	if(status){
  		return true
  	}
  	else{
  		return false
  	}
  }

  // <edit-config file="app/src/main/AndroidManifest.xml" mode="merge" target="/manifest/application" xmlns:android="http://schemas.android.com/apk/res/android">
  //     <application android:usesCleartextTraffic="true" />
  //      <application android:networkSecurityConfig="@xml/network_security_config" />
  // </edit-config>




  // <network-security-config>
  //     <domain-config cleartextTrafficPermitted="true">
  //         <!-- <domain includeSubdomains="true">localhost</domain> -->
  //         <domain>http://52.41.233.117:3000</domain>
  //     </domain-config>
  // </network-security-config>

  getAdminLogin(){
    var status = localStorage.getItem('sensegizAdminLogin')
    console.log("login==",status)
    if(status){
      return status
    }
    else{
      return false
    }
  }



  logout(){
  	localStorage.clear()
    this.router.navigate(['/admin-login'])
  }




}
