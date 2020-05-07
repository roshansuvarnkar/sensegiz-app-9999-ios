import { Component, OnInit } from '@angular/core';
import { FormGroup,Validators,FormBuilder } from '@angular/forms';
import { ApiService } from '../api.service';
import {Router} from '@angular/router'

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.page.html',
  styleUrls: ['./admin-login.page.scss'],
})
export class AdminLoginPage implements OnInit {
adminLoginForm : any;
loginValidStatus : boolean = false;
passwordFormat : string = 'password';
passwordVisibility : string = 'eye-off';
  constructor(
  private fb:FormBuilder,
  private api:ApiService,
  private router:Router
  ) {
  	this.adminLoginForm=this.fb.group({
  	userName:['',Validators.required],
  	password:['',Validators.required],


  }); }

  ngOnInit() {
  }
login(data){
	if(this.adminLoginForm.valid){
		//console.log("Successful",data)
		data.system='mobile'
		this.api.send(data).then((res:any)=>{
			console.log("data login success",res)
			if(res.status){
				localStorage.setItem('sensegizAdminLogin',JSON.stringify(res.success))
				this.router.navigate(['/admin-dashboard'])
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
}
