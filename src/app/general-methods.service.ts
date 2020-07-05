import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Network } from '@ionic-native/network';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralMethodsService {
  networkStatus:boolean
  myDate:any
  toDate:any
  dataBackUp:any=[]
  constructor(private toastctrl:ToastController,private network: Network,private api:ApiService) {
    this.locationAutorize()
    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      this.networkStatus=true
      if(this.dataBackUp.length>0){
        for(var i=0 ; i<this.dataBackUp.length ; i++){
          this.api.SendData(this.dataBackUp[i]).then((apis:any)=>{
            if(apis.status){
              console.log("backup data sync",this.dataBackUp[i])
              this.dataBackUp.splice(i, 1);
            }
          })
        }
      }
    });
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      console.log('network disconnected!');

      this.networkStatus=false
    });
  }


  async toast(msg){

  	const toast = await this.toastctrl.create({
      message: msg,
      position: 'bottom',
    });
  		toast.present();
  		setTimeout(function(){ toast.dismiss() }, 3000);
  }


  checkNetwork(){
    console.log("connection type===",this.network.type);
    return this.network.type;
  }



  timeBle(){
    this.myDate = new Date();
    this.myDate = this.myDate.getUTCHours() + ':' + this.myDate.getUTCMinutes() + ':' + this.myDate.getUTCSeconds()
    this.toDate = this.myDate.split(':')
    if(this.toDate[0].length==1){
      this.toDate[0]='0'+this.toDate[0]
    }
    if(this.toDate[1].length==1){
      this.toDate[1]='0'+this.toDate[1]
    }
    if(this.toDate[2].length==1){
      this.toDate[2]='0'+this.toDate[2]
    }
    this.myDate = '00' + this.toDate[0] + this.toDate[1] + this.toDate[2] +'00'
    console.log("date====",this.myDate)
    return this.myDate
  }



  locationAutorize(){
    // this.diagnostic.isLocationAuthorized().then((res:any)=>{
    //   console.log("res location authorize",res);
    //
    //   if(res == 'GRANTED'){
    //
    //   }
    //   else{
    //
    //   }
    // })
  }


}
