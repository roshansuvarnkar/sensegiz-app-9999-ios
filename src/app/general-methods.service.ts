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
  constructor(private toastctrl:ToastController,private network: Network,private api:ApiService) {
    setInterval(()=>{
      this.dataSyncOnNetwork()
    },10000)
    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!=');
      this.networkStatus=true
      this.dataSyncOnNetwork()
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

  dataBackUp(key='backUpdataSensegiz',value){
    var obj = this.getObject(key)
    console.log("value==",value,"obj==",obj)
    if(obj!=null){
      obj.push(value.data)
      console.log("value 1==",value.data,"obj==",obj)
    }
    else{
      obj=[]
      obj[0] = value.data
      console.log("value 2==",value.data,"obj==",obj)
    }
    this.setObject(key,obj)
  }

  getObject(key='backUpdataSensegiz'){
    return JSON.parse(localStorage.getItem(key))
  }

  setObject(key='backUpdataSensegiz',obj){
    localStorage.setItem(key,JSON.stringify(obj))
  }

  async dataSyncOnNetwork(){
    var network = this.checkNetwork()
    if(network != 'none'){
      var obj = this.getObject('backUpdataSensegiz')
      console.log("obj sync==",obj);
      if(obj != null){
        if(obj.length>0){
          for(var i = 0 ; i<obj.length ; i++){
            console.log("obj[i]==",obj[i],"obj===",obj);
            var data = {
              data : obj[i]
            }
            await this.api.SendData(data).then((apis:any)=>{
              if(apis.status){
                console.log("backup data sync",obj[i])
                obj.splice(i, 1);
                this.setObject('backUpdataSensegiz',obj)
              }
            }).catch(err=>{
              console.log("back up error",err)
            })
          }
        }
      }
    }
    else{
      console.log("no network");

    }
  }

}
