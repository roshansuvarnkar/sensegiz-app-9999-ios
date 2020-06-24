import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import {Router,ActivatedRoute} from '@angular/router'
import { LoginStatusService } from '../login-status.service';
import { ApiService } from '../api.service';
import { GeneralMethodsService } from '../general-methods.service';
@Component({
  selector: 'app-add-ble-mac',
  templateUrl: './add-ble-mac.page.html',
  styleUrls: ['./add-ble-mac.page.scss'],
})
export class AddBleMacPage implements OnInit {
  loginData:any=[]
  deviceData:any=[]
  addBle:any=[]
  status:boolean=false
  constructor(
    private ble:BLE,
    private router:Router,
    private route:ActivatedRoute,
    private login:LoginStatusService,
    private api: ApiService,
    private general:GeneralMethodsService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    var status = this.login.LoginStatus()
    if(status){
      this.loginData = this.login.getLoginData()
      this.loginData = JSON.parse(this.loginData)
    }
    else{
      this.router.navigate(['/admin-login'])
    }

    this.route.queryParams.subscribe(params => {
        this.deviceData = JSON.parse(params.record) ;
        console.log("records=",this.deviceData)
        this.connect(this.deviceData.id)
    })
  }

  ionViewWillLeave(){
    this.disConnect(this.addBle.id)
  }


  connect(id){
    this.ble.connect(id).subscribe((res:any)=>{
      console.log("connected==",res)
      this.addBle = res
      this.status = true
      this.changeDetectorRef.detectChanges();
    },err=>{
      console.log("cannot connect",err)
      this.status = false
      this.changeDetectorRef.detectChanges();
    })
  }


  disConnect(id){
    this.ble.disconnect(id).then((res:any)=>{
      console.log("dis connected==",res)
      this.status = false
      this.changeDetectorRef.detectChanges();
      this.router.navigate(['/scan-ble-mac'])
    }).catch(err=>{
      console.log("cannot disconnect connect",err)
      this.status = false
      this.changeDetectorRef.detectChanges();
    })
  }

  clickAddBle(){
    console.log("this.addBle===",this.addBle)
    var data = {
      userId:this.loginData.userId,
      deviceId:this.addBle.name.slice(5),
      bleId:this.addBle.id
    }
    this.api.addBleMac(data).then((res:any)=>{
      console.log("ble added successfully");
       this.general.toast("Ble MAC added successfully")
       setTimeout(() => {
         this.disConnect(this.addBle.id)
       },2000)
    }).catch(err=>{
      console.log("err http==",err)
    }) 
  }

}
