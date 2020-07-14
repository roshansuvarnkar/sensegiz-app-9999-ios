import { Component, OnInit } from '@angular/core';
import { FormGroup,Validators,FormBuilder } from '@angular/forms';
import { ApiService } from '../api.service';
import {Router} from '@angular/router'
import { LoginStatusService } from '../login-status.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

loginForm : any;
loginValidStatus : boolean = false;
passwordFormat : string = 'password';
passwordVisibility : string = 'eye-off';

  constructor(
  private fb:FormBuilder,
  private api:ApiService,
  private router:Router,
  private login:LoginStatusService
  ) {

  	this.loginForm=this.fb.group({
  	userName:['',Validators.required],
  	password:['',Validators.required],


  });

   }

  ngOnInit()
   {
     var status = this.login.LoginStatus()
     if(status){
       this.router.navigate(['/device-scan'])
     }
     else{
     }
  }


  ionViewWillEnter(){
    var status = this.login.LoginStatus()
    if(status){
     this.router.navigate(['/device-scan'])
    }
    else{
    }
  }

loginUser(data){
	if(this.loginForm.valid){
		//console.log("Successful",data)
		data.system='user'
		this.api.send(data).then((res:any)=>{
			//console.log("data login success",res)
			if(res.status){
				localStorage.setItem('sensegizUserLogin',JSON.stringify(res.success))
				this.router.navigate(['/device-scan'])
			}
			else{
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
}
