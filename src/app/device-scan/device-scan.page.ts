import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import {Router} from '@angular/router'
import { LoginStatusService } from '../login-status.service';
import { ApiService } from '../api.service';
import { GeneralMethodsService } from '../general-methods.service';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { ForegroundService } from '@ionic-native/foreground-service/ngx';

declare var cordova;
@Component({
  selector: 'app-device-scan',
  templateUrl: './device-scan.page.html',
  styleUrls: ['./device-scan.page.scss'],
})
export class DeviceScanPage implements OnInit {
goHead:boolean = false
status:boolean=false
devices:any=[]
myDate:any = new Date();
toDate:any
dataFull:any
loginData:any
connectStatus:any
scanStatus:any='kjrjeg'
stopStatus:boolean=false

  constructor(private ble:BLE,
    private router:Router,
    private login:LoginStatusService,
    private api: ApiService,
    private general:GeneralMethodsService,
    private backgroundMode: BackgroundMode,
    public foregroundService: ForegroundService,
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

    this.myDate = this.general.timeBle()
    console.log("time===",this.myDate)
  }



  ionViewWillEnter(){
    var status = this.login.LoginStatus()
    if(status){
      this.loginData = this.login.getLoginData()
      this.loginData = JSON.parse(this.loginData)
      this.stopStatus = false
      this.background()
    }
    else{
      this.router.navigate(['/admin-login'])
    }
  }

  background(){
    // this.backgroundMode.on('activate').subscribe(() => {
    //     this.backgroundMode.disableWebViewOptimizations();
    //     this.backgroundMode.disableBatteryOptimizations();
    //     this.startScan()
    //     console.log("active background");
    //     this.startService()
    //      setInterval(() => {
    //         this.backgroundMode.wakeUp();
    //       }, 10000)
    // },
    // ()=>{
    //   console.log("not active background")
    //   this.stopService()
    //   this.startScan()
    // });

    this.startScan()

    // this.backgroundMode.enable();
  }

// startService() {
//  this.foregroundService.start('Sensegiz Social Distancing App Running', 'Background Service', 'drawable-port-hdpi/screen.png');
// }
//
// stopService() {
//  this.foregroundService.stop();
// }


ionViewWillLeave() {
  this.stopStatus = true
  this.stopScan()
}


startScan(){
  this.devices=[]
    console.log("status  ===",this.stopStatus)
    if(!this.stopStatus){
      this.scanStatus ="Scan started"
      console.log("scan started")
      this.ble.startScan([]).subscribe(
       device=>this.showDevice(device),
       error=>this.scanError(error)
     )
    }

    setTimeout(()=>{
       this.ble.stopScan().then(res=>{
        console.log("scan com",res)
        this.scanStatus ="Scan stopped"
        this.changeDetectorRef.detectChanges();
        this.stopStatus = true
        this.autoStart()
       }).catch(err=>{
          console.log("err==",err)
       })
     }, 3000);

    console.log("after set time out");
}


showDevice(device){
  this.status=true
  this.devices.push(device)
  console.log("devices===",this.devices)
}


scanError(error){
  console.log("device error",error)
  this.status=false
  return
}


stopScan(){
    this.stopStatus = true
    this.ble.stopScan().then(res=>{
      console.log("stop scan com",res)
      this.scanStatus ="Scan stopped"
      this.changeDetectorRef.detectChanges();
      this.stopStatus = true
    }).catch(err=>{
        console.log("err==",err)
     })
}

async autoStart(){
  console.log("auto start")
  await this.connectDevice()
  console.log("came from conect")
  this.stopStatus = false
  this.startScan()
  return
}


async connectDevice(){
  console.log("came connect 1",this.devices);

  if(this.devices.length>0){
    console.log("came connect 2",this.devices);
    for(let i=0 ; i<this.devices.length ; i++){
      console.log("came connect 3",this.devices[i]);
      if(this.devices[i].hasOwnProperty('name')){
        console.log("came connect 4",this.devices[i].name);

        if((this.devices[i].name.toString().indexOf("FInDR")>-1) && !(this.devices[i].name.toString().indexOf("FInDR00")>-1)){
          console.log("came connect 5",this.devices[i]);

          await this.connectBleDevice(this.devices[i]).then((res:any)=>{
             console.log("return from connect")
          })
        }

        else if((this.devices[i].name.toString().indexOf("FINDr")>-1) && !(this.devices[i].name.toString().indexOf("FINDr00")>-1)){
          console.log("came connect 6",this.devices[i]);

          await this.connectBleDeviceWriteTime(this.devices[i]).then((res:any)=>{
            console.log("return from time connect")
          })
        }

        else{
          if(i == this.devices.length-1){
            console.log("else 1");
          }
          else{
            console.log("else 2");
            continue;
          }
        }

      }
      else{
        console.log("else 3");
      }
    }
  }
  else{
    console.log("else 4");
  }
  console.log("else 5");
}


 async connectBleDevice(resId){
   console.log("camere connect ble")
   return new Promise((resolve,reject)=>{
     console.log("resId====",resId)

     var hexDataAdvertising = this.buf2hex(resId.advertising).toUpperCase()
     console.log("hexDataAdvertising===",hexDataAdvertising)
     var split = hexDataAdvertising.split('0308')
     console.log("split===",split)
     var findIdAdvertisement = this.hex2dec(split[1].substring(0,2))
     console.log("findIdAdvertisement===",findIdAdvertisement)

     var data = {
       userId : this.loginData.userId,
       macId : resId.id,
       deviceId : findIdAdvertisement
     }

     this.api.validateMac(data).then((resValid:any)=>{
       if(resValid.status){
         this.ble.connect(resId.id).subscribe((res:any)=>{
           console.log("connected device==",res)
           this.connectStatus = "Connected "+res.name+" device"
           this.changeDetectorRef.detectChanges();
             var inc = 0
             if(res.characteristics.length>0){
               if(res.characteristics[17].service == 'fff0' && res.characteristics[17].characteristic=='fff4'){
                 console.log("char up if",res.characteristics[17]);

                 var value = this.str2abb('A0')
                 this.write(resId.id,res,'A000').then(resWrite=>{
                   console.log("start")
                   this.ble.startNotification(resId.id,res.characteristics[17].service,res.characteristics[17].characteristic).subscribe((data:any)=>{
                     var hexData = this.buf2hex(data).toUpperCase()
                     console.log("started notified",hexData)

                     if(hexData == "00000000000000"){
                       var value = this.str2abb(this.general.timeBle())
                       this.ble.writeWithoutResponse(resId.id,res.characteristics[14].service,res.characteristics[14].characteristic,value).then((resdata:any)=>{
                         console.log("written time on data 000",resdata)
                       })
                     }

                     else if(hexData == "00111111110000"){
                       var dataRssi = {
                         userId : this.loginData.userId
                       }
                       this.api.getRssi(dataRssi).then((resRssi:any)=>{
                         console.log("resRssi====",resRssi)
                         if(resRssi.status){
                           var valueData = '00' + '46' + resRssi.success[0].rssi + '00'
                           var value = this.str2abb(valueData)
                           this.ble.writeWithoutResponse(resId.id,res.characteristics[14].service,res.characteristics[14].characteristic,value).then((resdata:any)=>{
                             console.log("written rssi",resdata)
                           })
                         }
                         else{
                           var value = this.str2abb('00000000')
                           this.ble.writeWithoutResponse(resId.id,res.characteristics[14].service,res.characteristics[14].characteristic,value).then((resdata:any)=>{
                             console.log("written rssi else",resdata)
                           })
                         }
                       }).catch(err=>{
                         console.log("err==",err)
                       })
                     }

                     else if(hexData == '00222222220000'){
                       var dataOnOff = {
                         deviceId : findIdAdvertisement,
                         userId : this.loginData.userId
                       }
                       this.api.getOnOffTime(dataOnOff).then((reson:any)=>{
                         console.log("reson====",reson)
                         if(reson.status){
                           if(reson.success[0].fromTime != null && reson.success[0].toTime != null){
                             var from = reson.success[0].fromTime.split(':')
                             var to = reson.success[0].toTime.split(':')
                             var valueData = '00' + from[0].toString() + from[1].toString() + to[0].toString() + to[1].toString() + '00'
                             console.log("valueData===",valueData)
                             var value = this.str2abb(valueData)
                             this.ble.writeWithoutResponse(resId.id,res.characteristics[14].service,res.characteristics[14].characteristic,value).then((resdata:any)=>{
                               console.log("written on off time",resdata)
                             })
                           }
                           else{
                             var value = this.str2abb('000000000000')
                             this.ble.writeWithoutResponse(resId.id,res.characteristics[14].service,res.characteristics[14].characteristic,value).then((resdata:any)=>{
                               console.log("written on off time else 1",resdata)
                             })
                           }
                         }
                         else{
                           var value = this.str2abb('000000000000')
                           this.ble.writeWithoutResponse(resId.id,res.characteristics[14].service,res.characteristics[14].characteristic,value).then((resdata:any)=>{
                             console.log("written on off time else 2",resdata)
                           })
                         }
                       }).catch(err=>{
                         console.log("err==",err)
                       })
                     }

                     else if(hexData == "00333333330000"){
                       var dataTxPower = {
                         userId : this.loginData.userId
                       }
                       this.api.getRssi(dataTxPower).then((reson:any)=>{
                         console.log("reson====",reson)
                         if(reson.status){
                           if(reson.success[0].txPowerHex != null){
                             var valueData = '0045' + reson.success[0].txPowerHex
                             console.log("valueData===",valueData)
                             var value = this.str2abb(valueData)
                             this.ble.writeWithoutResponse(resId.id,res.characteristics[14].service,res.characteristics[14].characteristic,value).then((resdata:any)=>{
                               console.log("written tx power",resdata)
                             })
                           }
                           else{
                             var value = this.str2abb('000000')
                             this.ble.writeWithoutResponse(resId.id,res.characteristics[14].service,res.characteristics[14].characteristic,value).then((resdata:any)=>{
                               console.log("written tx power else 1",resdata)
                             })
                           }
                         }
                         else{
                           var value = this.str2abb('000000')
                           this.ble.writeWithoutResponse(resId.id,res.characteristics[14].service,res.characteristics[14].characteristic,value).then((resdata:any)=>{
                             console.log("written tx power else 2",resdata)
                           })
                         }
                       }).catch(err=>{
                         console.log("err==",err)
                       })
                     }

                     else if(hexData == "dummy here is 4444"){
                       var dataInactivity = {
                         userId : this.loginData.userId
                       }
                       this.api.getRssi(dataInactivity).then((reson:any)=>{
                         console.log("reson====",reson)
                         if(reson.status){
                           if(reson.success[0].inactivity != 0){
                            var inactivity = '000'
                             if(reson.success[0].inactivity.toString().length == 1){
                               inactivity = '00' + reson.success[0].inactivity
                             }
                             else if(reson.success[0].inactivity.toString().length == 2){
                               inactivity = '0' + reson.success[0].inactivity
                             }
                             else if(reson.success[0].inactivity.toString().length == 3){
                               inactivity = reson.success[0].inactivity
                             }

                             var valueData = '0050' + inactivity
                             console.log("value inactivity===",valueData)
                             var value = this.str2abb(valueData)
                             this.ble.writeWithoutResponse(resId.id,res.characteristics[14].service,res.characteristics[14].characteristic,value).then((resdata:any)=>{
                               console.log("written inactivity",resdata)
                             })
                           }
                           else{
                             var value = this.str2abb('0000000')
                             this.ble.writeWithoutResponse(resId.id,res.characteristics[14].service,res.characteristics[14].characteristic,value).then((resdata:any)=>{
                               console.log("written inactivity else 1",resdata)
                             })
                           }
                         }
                         else{
                           var value = this.str2abb('0000000')
                           this.ble.writeWithoutResponse(resId.id,res.characteristics[14].service,res.characteristics[14].characteristic,value).then((resdata:any)=>{
                             console.log("written inactivity else 2",resdata)
                           })
                         }
                       }).catch(err=>{
                         console.log("err==",err)
                       })
                     }

                     else if(hexData == "here is 55555"){
                       var dataInactivityStatus = {
                         userId : this.loginData.userId
                       }
                       this.api.getRssi(dataInactivityStatus).then((reson:any)=>{
                         console.log("reson====",reson)
                         if(reson.status){
                           if(reson.success[0].inactivityStatus != null){
                             var valueData = '49' + reson.success[0].inactivityStatus
                             console.log("value inactivity status===",valueData)
                             var value = this.str2abb(valueData)
                             this.ble.writeWithoutResponse(resId.id,res.characteristics[14].service,res.characteristics[14].characteristic,value).then((resdata:any)=>{
                               console.log("written inactivity status",resdata)
                             })
                           }
                           else{
                             var value = this.str2abb('000')
                             this.ble.writeWithoutResponse(resId.id,res.characteristics[14].service,res.characteristics[14].characteristic,value).then((resdata:any)=>{
                               console.log("written inactivity status else 1",resdata)
                             })
                           }
                         }
                         else{
                           var value = this.str2abb('000')
                           this.ble.writeWithoutResponse(resId.id,res.characteristics[14].service,res.characteristics[14].characteristic,value).then((resdata:any)=>{
                             console.log("written inactivity enable else 2",resdata)
                           })
                         }
                       }).catch(err=>{
                         console.log("err==",err)
                       })
                     }
                     else if(hexData == "00444444440000"){
                       var dataBuffer = {
                         userId : this.loginData.userId
                       }
                       this.api.getRssi(dataBuffer).then((reson:any)=>{
                         console.log("reson====",reson)
                         if(reson.status){
                           if(reson.success[0].buffer != null){
                            var buffer = '00'
                             if(reson.success[0].buffer.toString().length == 1){
                               buffer = '0' + reson.success[0].buffer
                             }
                             else if(reson.success[0].buffer.toString().length == 2){
                               buffer = reson.success[0].buffer
                             }

                             var valueData = '0048' + buffer + '000'
                             console.log("value buffer===",valueData)
                             var value = this.str2abb(valueData)
                             this.ble.writeWithoutResponse(resId.id,res.characteristics[14].service,res.characteristics[14].characteristic,value).then((resdata:any)=>{
                               console.log("written buffer",resdata)
                             })
                           }
                           else{
                             var value = this.str2abb('000000000')
                             this.ble.writeWithoutResponse(resId.id,res.characteristics[14].service,res.characteristics[14].characteristic,value).then((resdata:any)=>{
                               console.log("written buffer else 1",resdata)
                             })
                           }
                         }
                         else{
                           var value = this.str2abb('000000000')
                           this.ble.writeWithoutResponse(resId.id,res.characteristics[14].service,res.characteristics[14].characteristic,value).then((resdata:any)=>{
                             console.log("written buffer else 2",resdata)
                           })
                         }
                       }).catch(err=>{
                         console.log("err==",err)
                       })
                     }
                     else if(hexData == "00777777770000"){
                       this.ble.stopNotification(resId.id,res.characteristics[17].service,res.characteristics[17].characteristic).then(stopNot=>{
                         this.disconnect(resId.id).then((disres:any)=>{
                           resolve(true)
                         }).catch(err=>{
                           resolve(false)
                         })
                       })
                     }
                     else{
                       console.log("else  time",hexData)
                       var userId = this.loginData.userId.toString().length==1 ? '0'+this.loginData.userId : this.loginData.userId
                       this.dataFull = {
                         data: '0000000000'+ userId + hexData
                       }
                       var networkStatus = this.general.checkNetwork()
                       if(networkStatus!='none'){
                         console.log("if network present")
                         this.api.SendData(this.dataFull).then((apis:any)=>{
                           if(apis.status){
                             var a0
                             inc = inc + 1
                             if(inc.toString().length==1){
                               a0 = 'A00' + inc
                             }
                             else{
                               a0 = 'A0' + inc
                             }
                             console.log("ao====",a0)
                             this.write(resId.id,res,a0).then((resWritenot:any)=>{
                               console.log("second write for data===",resWritenot)
                             })
                           }
                           else{

                           }
                         }).catch(err=>{
                           this.general.dataBackUp.push(this.dataFull)
                           console.log("err==",err)
                         })
                       }
                       else{
                         this.general.dataBackUp.push(this.dataFull)
                         console.log("else network absent");
                       }
                     }
                   })
                 })

               }
             }
             else{
               this.disconnect(resId.id).then((disres:any)=>{
                 resolve(true)
               }).catch(err=>{
                 resolve(false)
               })
             }
         },
        err=>{
          console.log("cannot connect ble")
          resolve(false)
        })
       }
       else{
         resolve(false)
       }
     })
   })
}



 connectBleDeviceWriteTime(resId){
   console.log("camere connect ble write time")
   return new Promise((resolve,reject)=>{
     console.log("resId====",resId)
     var hexDataAdvertising = this.buf2hex(resId.advertising).toUpperCase()
     console.log("hexDataAdvertising1===",hexDataAdvertising)
     var split = hexDataAdvertising.split('0308')
     console.log("split1===",split)
     var findIdAdvertisement = this.hex2dec(split[1].substring(0,2))
     console.log("findIdAdvertisement1===",findIdAdvertisement)

     var data = {
       userId : this.loginData.userId,
       macId : resId.id,
       deviceId : findIdAdvertisement
     }

     this.api.validateMac(data).then((resValid:any)=>{
       if(resValid.status){
         this.ble.connect(resId.id).subscribe((res:any)=>{
           console.log("connected time device==",res)
           this.connectStatus = "Connected "+res.name+" device"
           this.changeDetectorRef.detectChanges();
           if(res.characteristics.length>0){
             console.log("char===",res.characteristics[14])
             if(res.characteristics[14].service == 'fff0' && res.characteristics[14].characteristic=='fff1'){
               console.log("char entered if===",res.characteristics[14])
               var value = this.str2abb(this.general.timeBle())

               this.ble.writeWithoutResponse(resId.id,res.characteristics[14].service,res.characteristics[14].characteristic,value).then((resdata:any)=>{
                 console.log("written time",resdata)
                 if(res.characteristics[17].service == 'fff0' && res.characteristics[17].characteristic=='fff4'){
                   this.ble.startNotification(resId.id,res.characteristics[17].service,res.characteristics[17].characteristic).subscribe((data:any)=>{
                     var hexData = this.buf2hex(data).toUpperCase()
                     console.log("started notified time",hexData)
                     if(hexData == "00111111110000"){
                       console.log("end notify time");
                       this.ble.stopNotification(resId.id,res.characteristics[17].service,res.characteristics[17].characteristic).then(stopNot=>{
                         this.disconnect(resId.id).then((disres:any)=>{
                           resolve(true)
                         }).catch(err=>{
                           resolve(false)
                         })
                       })
                     }
                   })
                 }
               })
             }
           }
           else{
             this.disconnect(resId.id).then((disres:any)=>{
               resolve(true)
             }).catch(err=>{
               resolve(false)
             })
           }
         },
        err=>{
          console.log("cannot connect ble time")
          resolve(false)
        })
       }
       else{
         resolve(false)
       }
     })

   })
}



write(id,res,data){
  return new Promise((resolve,reject)=>{
    // for(var i=0 ; i<res.characteristics.length ; i++){
    if(res.characteristics.length>0){
      console.log("char===",res.characteristics[14])
      if(res.characteristics[14].service == 'fff0' && res.characteristics[14].characteristic=='fff1'){
        console.log("char entered if===",res.characteristics[14])
        var value = this.str2abb(data)
        this.ble.writeWithoutResponse(id,res.characteristics[14].service,res.characteristics[14].characteristic,value).then((resdata:any)=>{
          console.log("written data",resdata)
          resolve(true)
        })
      }
    }
    else{
      this.disconnect(id).then((disres:any)=>{
        resolve(true)
      }).catch(err=>{
        resolve(false)
      })
    }
  })
}



disconnect(id){
  return new Promise((resolve,reject)=>{
    this.ble.disconnect(id).then((res:any)=>{
      this.connectStatus = "Disconnected"
      this.changeDetectorRef.detectChanges();
      console.log("disconnected",id)
      resolve(true)
    }).catch(err=>{resolve(false)})
  })
}

doRefresh(event) {
    console.log('Begin async operation');
    setTimeout(() => {
      console.log('Async operation has ended');
      this.startScan()
      event.target.complete();
    }, 1000);
}


buf2hex(buffer){
  return Array
        .from(new Uint8Array (buffer))
        .map(b => b.toString(16).padStart(2,"0"))
        .join("");
}


str2abb(str){
  var buf = new ArrayBuffer(str.length)
  var bufView = new Uint8Array(buf)
  for(var i=0 , strlen=str.length ; i<strlen ;i++){
    bufView[i] = str.charCodeAt(i)
  }
  return buf
}

hex2dec(str){
  return parseInt(str, 16)
}


logout(){
  this.login.logout()
}


}
