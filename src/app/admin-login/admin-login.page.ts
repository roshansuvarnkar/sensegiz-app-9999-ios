import { Component, OnInit } from '@angular/core';
import { FormGroup,Validators,FormBuilder } from '@angular/forms';
import { ApiService } from '../api.service';
import {Router} from '@angular/router'
import { LoginStatusService } from '../login-status.service';
import { GeneralMethodsService } from '../general-methods.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.page.html',
  styleUrls: ['./admin-login.page.scss'],
})
export class AdminLoginPage implements OnInit {
  servers:any=[]
  serverSelected:any=undefined
  adminLoginForm : any;
  loginData : any;
  loginValidStatus : boolean = false;
  passwordFormat : string = 'password';
  passwordVisibility : string = 'eye-off';
  constructor(
  private fb:FormBuilder,
  private api:ApiService,
  private router:Router,
  private login:LoginStatusService,
  private general:GeneralMethodsService
  ) {
  	this.adminLoginForm=this.fb.group({
    	userName:['',Validators.required],
    	password:['',Validators.required],
      role:['',Validators.required],
    });

  }

  ngOnInit() {
    console.log("init enter")

    var status = this.login.LoginStatus()
    if(status){
      this.loginData = this.login.getLoginData()
      this.loginData = JSON.parse(this.loginData)
      if(this.loginData.role == 'admin'){
        this.router.navigate(['/admin-dashboard'])
      }
      else{
        this.router.navigate(['/device-scan'])
      }
    }
    else{
      this.refreshServer()
    }
  }


  ionViewWillEnter() {
    var status = this.login.LoginStatus()
    if(status){
      this.loginData = this.login.getLoginData()
      this.loginData = JSON.parse(this.loginData)
      if(this.loginData.role == 'admin'){
        this.router.navigate(['/admin-dashboard'])
      }
      else{
        this.router.navigate(['/device-scan'])
      }

    }
    else{
    }
  }


loginAdmin(data){
	if(this.adminLoginForm.valid){
		console.log("Successful",data)
    if(data.role == 'admin'){
      data.system='mobile'
    }
    else{
      data.system='user'
    }

		this.api.send(data).then((res:any)=>{
			console.log("data login success",res)
			if(res.status){
        res.success.role = data.role
        localStorage.setItem('sensegizLogin',JSON.stringify(res.success))

        if(data.role == 'admin'){
          this.router.navigate(['/admin-dashboard'])
        }
        else{
          this.router.navigate(['/device-scan'])
        }
			}
			else{
        this.router.navigate(['/admin-login'])
				this.loginValidStatus = true;
			}
		})
	}
	else{
	this.loginValidStatus = true;
	}
}


togglePassword(){
	this.passwordFormat = this.passwordFormat === 'text' ? 'password' : 'text';
    this.passwordVisibility = this.passwordVisibility === 'eye-off' ? 'eye' : 'eye-off';
}


refreshServer(){
  var data = {}
  // this.api.getServers(data).then((res:any)=>{
  //   if(res.status){
  //     this.servers = res.success
  //   }
  // })
}

onSelectChange(selectedValue: any) {
    console.log('Selected==', selectedValue.detail.value);
    this.serverSelected = selectedValue.detail.value
    localStorage.setItem('sensegizapi',selectedValue.detail.value+':3000')
}


}
