import { Component, OnInit } from '@angular/core';
import { FormGroup,Validators,FormBuilder } from '@angular/forms';
import { ApiService } from '../api.service';
import {Router} from '@angular/router'

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
  private router:Router
  ) {

  	this.loginForm=this.fb.group({
  	username:['',Validators.required],
  	password:['',Validators.required],


  });

   }

ngOnInit()
   {

  	}

login(data){
	if(this.loginForm.valid){
		//console.log("Successful",data)
		data.system='mobile'
		this.api.send(data).then((res:any)=>{
			console.log("data login success",res)
			if(res.status){
				localStorage.setItem('sensegizLogin',JSON.stringify(res[0]))
				this.router.navigate(['/home'])
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
