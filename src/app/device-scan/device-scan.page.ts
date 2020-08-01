import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BLE } from '@ionic-native/ble';
import {Router} from '@angular/router'
import { LoginStatusService } from '../login-status.service';
import { ApiService } from '../api.service';
import { GeneralMethodsService } from '../general-methods.service';
import { Diagnostic } from '@ionic-native/diagnostic';

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
  scanStatus:any='Started'
  stopStatus:boolean=false
  setTimer:any
  bleSetting:any = 0
  locSetting:any = 0
  setTimerConnection:any
  connectTimmer:any=1
  constructor(private ble:BLE,
    private router:Router,
    private login:LoginStatusService,
    private api: ApiService,
    private general:GeneralMethodsService,
    private changeDetectorRef: ChangeDetectorRef,
    private diagnostic: Diagnostic
  ) {

  }


  ngOnInit() {
    this.setTimer = setTimeout(() => {
    },5000);
    this.setTimerConnection = setTimeout(() => {
    },5000);

    var status = this.login.LoginStatus()
    if(status){
      this.loginData = this.login.getLoginData()
      this.loginData = JSON.parse(this.loginData)
      this.stopStatus = false
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
    this.diagnostic.isBluetoothEnabled().then((resBle:any)=>{
      if(resBle){
        this.bleSetting = 0
        this.diagnostic.isLocationEnabled().then((resLoc:any)=>{
          if(resLoc){
            this.locSetting = 0
          }
          else{
            if(this.locSetting == 0){
              if(confirm("Turn ON location")){
                this.locSetting = 1
                  this.diagnostic.switchToLocationSettings()
                  console.log("back from location")
              }
            }

          }
        })
      }
      else{
        if(this.bleSetting == 0){
          if(confirm("Turn ON bluetooth")){
            this.bleSetting = 1
            this.diagnostic.switchToBluetoothSettings()
            console.log("back from bluetooth")
          }
          else{

          }
        }
      }
    })
    this.startScan()

  }


ionViewWillLeave() {
  this.stopStatus = true
  this.stopScan()
}


startScan(){

  this.devices=[]
    console.log("status  ===",this.stopStatus)
    if(!this.stopStatus){
      this.scanStatus ="Scan started"
      this.connectStatus = 'Disconnected'
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
  this.background()
  return
}


async connectDevice(){
  console.log("came connect 1",this.devices);

  if(this.devices.length>0){
    console.log("came connect 2",this.devices);
    for(let i=0 ; i<this.devices.length ; i++){
      console.log("came connect 3",this.devices[i]);
      if(this.devices[i].advertising.hasOwnProperty('kCBAdvDataServiceUUIDs')){
        console.log("came connect 4",this.devices[i].name);

        if((this.devices[i].advertising.kCBAdvDataServiceUUIDs[0].toString().indexOf("18F0")>-1) && !(this.devices[i].advertising.kCBAdvDataServiceUUIDs[1].toString().indexOf("0000")>-1)){
          console.log("came connect 5",this.devices[i]);

          clearTimeout(this.setTimer)

          this.setTimer =  setTimeout(()=>{
            this.disconnect(this.devices[i].id)
            this.background()
            console.log("came timer 1==",this.setTimer)
          },80000)

          await this.connectBleDevice(this.devices[i]).then((res:any)=>{
             console.log("return from connect")
          })
        }

        else if((this.devices[i].advertising.kCBAdvDataServiceUUIDs[0].toString().indexOf("16F0")>-1) && !(this.devices[i].advertising.kCBAdvDataServiceUUIDs[1].toString().indexOf("0000")>-1)){
          console.log("came connect 6",this.devices[i]);

          clearTimeout(this.setTimer)

          this.setTimer =  setTimeout(()=>{
            this.disconnect(this.devices[i].id)
            this.background()
            console.log("came timer 2==",this.setTimer)
          },80000)

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
     // (async () =>{
       console.log("resId====",resId)

       // var hexDataAdvertising = this.buf2hex(resId.advertising).toUpperCase()
       // console.log("hexDataAdvertising===",hexDataAdvertising)
       // var split = hexDataAdvertising.split('0408')
       // console.log("split===",split)
       // var findIdAdvertisement = this.hex2dec(split[1].substring(0,4))
       // console.log("findIdAdvertisement===",findIdAdvertisement)

       var findIdAdvertisement = this.hex2dec(resId.advertising.kCBAdvDataServiceUUIDs[1])
       console.log("findIdAdvertisement===",findIdAdvertisement)

       var data = {
         userId : this.loginData.userId,
         macId : resId.id,
         deviceId : findIdAdvertisement
       }
       this.setTimerConnection =  setTimeout(()=>{
         if(this.connectTimmer==1){
           this.disconnect(resId.id)
           this.background()
           console.log("came timer 2==",this.setTimer)
         }
       },6000)

      // await this.api.validateMac(data).then((resValid:any)=>{
      //   console.log("res  mac 1==",resValid)
      //    if(resValid.status){
           this.ble.connect(resId.id).subscribe((res:any)=>{
             console.log("connected device==",res)
             this.connectStatus = "Connected "+findIdAdvertisement+" device"
             this.changeDetectorRef.detectChanges();
               var inc = 0
               if(res.characteristics.length>0){
                 if(res.characteristics[12].service == 'FFF0' && res.characteristics[12].characteristic=='FFF4'){
                   console.log("char up if",res.characteristics[12]);

                   var value = this.str2abb('A0')
                   this.write(resId.id,res,'A000').then(resWrite=>{
                     console.log("start")
                     this.ble.startNotification(resId.id,res.characteristics[12].service,res.characteristics[12].characteristic).subscribe((data:any)=>{
                       var hexData = this.buf2hex(data).toUpperCase()
                       console.log("started notified",hexData)
                       this.connectTimmer = 0
                       var settingNetwork = this.general.checkNetwork()

                       if(hexData == "0000000000000000"){
                         var value = this.str2abb(this.general.timeBle())
                         this.ble.write(resId.id,res.characteristics[9].service,res.characteristics[9].characteristic,value).then((resdata:any)=>{
                           console.log("written time on data 000",resdata)
                         })
                       }

                       else if(hexData == "0011111111000000" && settingNetwork !='none'){
                         var dataRssi = {
                           userId : this.loginData.userId
                         }
                         this.api.getSetting(dataRssi).then((resRssi:any)=>{
                           console.log("resRssi====",resRssi)
                           if(resRssi.status){
                             if(resRssi.success[0].rssi != undefined && resRssi.success[0].rssi!=0 && resRssi.success[0].rssi!='' && resRssi.success[0].rssi != 'undefined'){

                               var valueData = '00' + '46' + resRssi.success[0].rssi + '00'
                               var value = this.str2abb(valueData)
                               this.ble.write(resId.id,res.characteristics[9].service,res.characteristics[9].characteristic,value).then((resdata:any)=>{
                                 console.log("written rssi",resdata)
                               })
                             }
                             else{
                               var value = this.str2abb('00000000')
                               this.ble.write(resId.id,res.characteristics[9].service,res.characteristics[9].characteristic,value).then((resdata:any)=>{
                                 console.log("written rssi else 1",resdata)
                               })
                             }
                           }
                           else{
                             var value = this.str2abb('00000000')
                             this.ble.write(resId.id,res.characteristics[9].service,res.characteristics[9].characteristic,value).then((resdata:any)=>{
                               console.log("written rssi else 2",resdata)
                             })
                           }
                         }).catch(err=>{
                           console.log("err==",err)
                         })
                       }

                       else if(hexData == '0022222222000000' && settingNetwork !='none'){
                         var dataOnOff = {
                           deviceId : findIdAdvertisement,
                           userId : this.loginData.userId
                         }
                         this.api.getOnOffTime(dataOnOff).then((reson:any)=>{
                           console.log("reson====",reson)
                           if(reson.status){
                             if(reson.success[0].fromTime != null && reson.success[0].toTime != null && reson.success[0].toTime != undefined  && reson.success[0].rssi != 'undefined'){
                               var from = reson.success[0].fromTime.split(':')
                               var to = reson.success[0].toTime.split(':')
                               var valueData = '00' + to[0].toString() + to[1].toString() + from[0].toString() + from[1].toString() + '00'
                               console.log("valueData===",valueData)
                               var value = this.str2abb(valueData)
                               this.ble.write(resId.id,res.characteristics[9].service,res.characteristics[9].characteristic,value).then((resdata:any)=>{
                                 console.log("written on off time",resdata)
                               })
                             }
                             else{
                               var value = this.str2abb('000000000000')
                               this.ble.write(resId.id,res.characteristics[9].service,res.characteristics[9].characteristic,value).then((resdata:any)=>{
                                 console.log("written on off time else 1",resdata)
                               })
                             }
                           }
                           else{
                             var value = this.str2abb('000000000000')
                             this.ble.write(resId.id,res.characteristics[9].service,res.characteristics[9].characteristic,value).then((resdata:any)=>{
                               console.log("written on off time else 2",resdata)
                             })
                           }
                         }).catch(err=>{
                           console.log("err==",err)
                         })
                       }

                       else if(hexData == "0033333333000000" && settingNetwork !='none'){
                         var dataTxPower = {
                           userId : this.loginData.userId
                         }
                         this.api.getSetting(dataTxPower).then((reson:any)=>{
                           console.log("reson====",reson)
                           if(reson.status){
                             if(reson.success[0].txPowerHex != null && reson.success[0].txPowerHex != undefined && reson.success[0].txPowerHex != 0 && reson.success[0].txPowerHex != 'undefined'){
                               var valueData = '0' + '45' + reson.success[0].txPowerHex //00 for 9999 and 0 for 255
                               console.log("valueData===",valueData)
                               var value = this.str2abb(valueData)
                               this.ble.write(resId.id,res.characteristics[9].service,res.characteristics[9].characteristic,value).then((resdata:any)=>{
                                 console.log("written tx power",resdata)
                               })
                             }
                             else{
                               var value = this.str2abb('00000')
                               this.ble.write(resId.id,res.characteristics[9].service,res.characteristics[9].characteristic,value).then((resdata:any)=>{
                                 console.log("written tx power else 1",resdata)
                               })
                             }
                           }
                           else{
                             var value = this.str2abb('00000')
                             this.ble.write(resId.id,res.characteristics[9].service,res.characteristics[9].characteristic,value).then((resdata:any)=>{
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
                         this.api.getSetting(dataInactivity).then((reson:any)=>{
                           console.log("reson====",reson)
                           if(reson.status){
                             if(reson.success[0].inactivity != 0 && reson.success[0].inactivity != undefined && reson.success[0].inactivity != 'undefined'){
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
                               this.ble.write(resId.id,res.characteristics[9].service,res.characteristics[9].characteristic,value).then((resdata:any)=>{
                                 console.log("written inactivity",resdata)
                               })
                             }
                             else{
                               var value = this.str2abb('0000000')
                               this.ble.write(resId.id,res.characteristics[9].service,res.characteristics[9].characteristic,value).then((resdata:any)=>{
                                 console.log("written inactivity else 1",resdata)
                               })
                             }
                           }
                           else{
                             var value = this.str2abb('0000000')
                             this.ble.write(resId.id,res.characteristics[9].service,res.characteristics[9].characteristic,value).then((resdata:any)=>{
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
                         this.api.getSetting(dataInactivityStatus).then((reson:any)=>{
                           console.log("reson====",reson)
                           if(reson.status){
                             if(reson.success[0].inactivityStatus != null && reson.success[0].inactivityStatus != undefined && reson.success[0].inactivityStatus != 'undefined'){
                               var valueData = '49' + reson.success[0].inactivityStatus
                               console.log("value inactivity status===",valueData)
                               var value = this.str2abb(valueData)
                               this.ble.write(resId.id,res.characteristics[9].service,res.characteristics[9].characteristic,value).then((resdata:any)=>{
                                 console.log("written inactivity status",resdata)
                               })
                             }
                             else{
                               var value = this.str2abb('000')
                               this.ble.write(resId.id,res.characteristics[9].service,res.characteristics[9].characteristic,value).then((resdata:any)=>{
                                 console.log("written inactivity status else 1",resdata)
                               })
                             }
                           }
                           else{
                             var value = this.str2abb('000')
                             this.ble.write(resId.id,res.characteristics[9].service,res.characteristics[9].characteristic,value).then((resdata:any)=>{
                               console.log("written inactivity enable else 2",resdata)
                             })
                           }
                         }).catch(err=>{
                           console.log("err==",err)
                         })
                       }
                       else if(hexData == "0044444444000000" && settingNetwork !='none'){
                         var dataBuffer = {
                           userId : this.loginData.userId
                         }
                         this.api.getSetting(dataBuffer).then((reson:any)=>{
                           console.log("reson====",reson)
                           if(reson.status){
                             if(reson.success[0].buffer != null && reson.success[0].buffer != undefined && reson.success[0].buffer != 'undefined'){
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
                               this.ble.write(resId.id,res.characteristics[9].service,res.characteristics[9].characteristic,value).then((resdata:any)=>{
                                 console.log("written buffer",resdata)
                               })
                             }
                             else{
                               var value = this.str2abb('000000000')
                               this.ble.write(resId.id,res.characteristics[9].service,res.characteristics[9].characteristic,value).then((resdata:any)=>{
                                 console.log("written buffer else 1",resdata)
                               })
                             }
                           }
                           else{
                             var value = this.str2abb('000000000')
                             this.ble.write(resId.id,res.characteristics[9].service,res.characteristics[9].characteristic,value).then((resdata:any)=>{
                               console.log("written buffer else 2",resdata)
                             })
                           }
                         }).catch(err=>{
                           console.log("err==",err)
                         })
                       }

                       else if(hexData == "0077777777000000" && settingNetwork !='none'){
                         var dataScanningInterval = {
                           userId : this.loginData.userId
                         }
                         this.api.getSetting(dataScanningInterval).then((reson:any)=>{
                           console.log("reson====",reson)
                           if(reson.status){
                             if(reson.success[0].scanningInterval != null && reson.success[0].scanningInterval != undefined && reson.success[0].scanningInterval != 'undefined'){
                                var scanInterval = '000'
                                if(reson.success[0].scanningInterval.toString().length == 1){
                                  scanInterval = '00' + reson.success[0].scanningInterval
                                }
                                else if(reson.success[0].scanningInterval.toString().length == 2){
                                  scanInterval = '0' + reson.success[0].scanningInterval
                                }
                                else if(reson.success[0].scanningInterval.toString().length == 3){
                                  scanInterval = reson.success[0].scanningInterval
                                }

                               var valueData = '00043' + scanInterval + '000'
                               console.log("value scanInterval ===",valueData)
                               var value = this.str2abb(valueData)
                               this.ble.write(resId.id,res.characteristics[9].service,res.characteristics[9].characteristic,value).then((resdata:any)=>{
                                 console.log("written scanInterval",resdata)
                               })
                             }
                             else{
                               var value = this.str2abb('00000000000')
                               this.ble.write(resId.id,res.characteristics[9].service,res.characteristics[9].characteristic,value).then((resdata:any)=>{
                                 console.log("written scanInterval else 1",resdata)
                               })
                             }
                           }
                           else{
                             var value = this.str2abb('00000000000')
                             this.ble.write(resId.id,res.characteristics[9].service,res.characteristics[9].characteristic,value).then((resdata:any)=>{
                               console.log("written scanInterval else 2",resdata)
                             })
                           }
                         }).catch(err=>{
                           console.log("err==",err)
                         })
                       }

                       else if(hexData == "0088888888000000" && settingNetwork !='none'){
                         var dataBuzzerConf = {
                           userId : this.loginData.userId
                         }
                         this.api.getSetting(dataBuzzerConf).then((reson:any)=>{
                           console.log("reson====",reson)
                           if(reson.status){
                             if(reson.success[0].buzzerConfig != null && reson.success[0].buzzerConfig != undefined && reson.success[0].buzzerConfig != 'undefined'){

                               var valueData = '0000044' + reson.success[0].buzzerConfig + '00000'
                               console.log("value buzzer conf===",valueData)
                               var value = this.str2abb(valueData)
                               this.ble.write(resId.id,res.characteristics[9].service,res.characteristics[9].characteristic,value).then((resdata:any)=>{
                                 console.log("written buzzer",resdata)
                               })
                             }
                             else{
                               var value = this.str2abb('0000000000000')
                               this.ble.write(resId.id,res.characteristics[9].service,res.characteristics[9].characteristic,value).then((resdata:any)=>{
                                 console.log("written buzzer else 1",resdata)
                               })
                             }
                           }
                           else{
                             var value = this.str2abb('0000000000000')
                             this.ble.write(resId.id,res.characteristics[9].service,res.characteristics[9].characteristic,value).then((resdata:any)=>{
                               console.log("written buzzer else 2",resdata)
                             })
                           }
                         }).catch(err=>{
                           console.log("err==",err)
                         })
                       }


                       else if(hexData == "0099999999000000" && settingNetwork !='none'){
                         var dataDurationThreshold = {
                           userId : this.loginData.userId
                         }
                         this.api.getSetting(dataDurationThreshold).then((reson:any)=>{
                           console.log("reson====",reson)
                           if(reson.status){
                             if(reson.success[0].durationThreshold != null && reson.success[0].durationThreshold != undefined && reson.success[0].durationThreshold != 'undefined'){
                               var durationThreshold = reson.success[0].durationThreshold == '0' ? '0' : (parseInt(reson.success[0].durationThreshold)/5).toString()

                               if(durationThreshold.toString().length == 1){
                                 durationThreshold = '00' + durationThreshold
                               }
                               else if(durationThreshold.toString().length == 2){
                                 durationThreshold = '0' + durationThreshold
                               }
                               else if(durationThreshold.toString().length == 3){
                                 durationThreshold = durationThreshold
                               }

                               var valueData = '0000051' + durationThreshold + '0000'
                               console.log("value durationThreshold===",valueData)
                               var value = this.str2abb(valueData)
                               this.ble.write(resId.id,res.characteristics[9].service,res.characteristics[9].characteristic,value).then((resdata:any)=>{
                                 console.log("written buzzer",resdata)
                               })
                             }
                             else{
                               var value = this.str2abb('00000000000000')
                               this.ble.write(resId.id,res.characteristics[9].service,res.characteristics[9].characteristic,value).then((resdata:any)=>{
                                 console.log("written durationThreshold else 1",resdata)
                               })
                             }
                           }
                           else{
                             var value = this.str2abb('00000000000000')
                             this.ble.write(resId.id,res.characteristics[9].service,res.characteristics[9].characteristic,value).then((resdata:any)=>{
                               console.log("written durationThreshold else 2",resdata)
                             })
                           }
                         }).catch(err=>{
                           console.log("err==",err)
                         })
                       }




                       else if(hexData == "00AAAAAAAA000000" && settingNetwork !='none'){
                         var databuzzerTime= {
                           userId : this.loginData.userId
                         }
                         this.api.getSetting(databuzzerTime).then((reson:any)=>{
                           console.log("reson====",reson)
                           if(reson.status){
                             if(reson.success[0].buzzerTime != null && reson.success[0].buzzerTime != undefined && reson.success[0].buzzerTime != 'undefined'){
                               var buzzerTime = reson.success[0].buzzerTime == '1' ? '121' : (parseInt(reson.success[0].buzzerTime)/5).toString()

                               if(reson.success[0].buzzerTime.toString().length == 1){
                                 buzzerTime = '00' + reson.success[0].buzzerTime
                               }
                               else if(reson.success[0].buzzerTime.toString().length == 2){
                                 buzzerTime = '0' + reson.success[0].buzzerTime
                               }
                               else if(reson.success[0].buzzerTime.toString().length == 3){
                                 buzzerTime = reson.success[0].buzzerTime
                               }

                               var valueData = '0052' + buzzerTime
                               console.log("value buzzerTime===",valueData)
                               var value = this.str2abb(valueData)
                               this.ble.write(resId.id,res.characteristics[9].service,res.characteristics[9].characteristic,value).then((resdata:any)=>{
                                 console.log("written buzzerTime",resdata)
                               })
                             }
                             else{
                               var value = this.str2abb('0000000')
                               this.ble.write(resId.id,res.characteristics[9].service,res.characteristics[9].characteristic,value).then((resdata:any)=>{
                                 console.log("written buzzerTime else 1",resdata)
                               })
                             }
                           }
                           else{
                             var value = this.str2abb('0000000')
                             this.ble.write(resId.id,res.characteristics[9].service,res.characteristics[9].characteristic,value).then((resdata:any)=>{
                               console.log("written buzzerTime else 2",resdata)
                             })
                           }
                         }).catch(err=>{
                           console.log("err==",err)
                         })
                       }


                       else if(hexData == "00BBBBBBBB000000" || (settingNetwork =='none' && hexData.indexOf('000000') !== -1)){
                         this.ble.stopNotification(resId.id,res.characteristics[12].service,res.characteristics[12].characteristic).then(stopNot=>{
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
                         var a0
                         inc = inc + 1
                         if(inc.toString().length==1){
                           a0 = 'A00' + inc
                         }
                         else{
                           a0 = 'A0' + inc
                         }
                         var networkStatus = this.general.checkNetwork()
                         if(networkStatus!='none'){
                           console.log("if network present")
                           this.api.SendData(this.dataFull).then((apis:any)=>{
                             if(apis.status){
                               console.log("ao if====",a0)
                               this.write(resId.id,res,a0).then((resWritenot:any)=>{
                                 console.log("second write for data===",resWritenot)
                               })
                             }
                             else{

                             }
                           }).catch(err=>{
                             console.log("err==",err)
                             console.log("ao catch====",a0)
                             this.general.dataBackUp('backUpdataSensegiz',this.dataFull)
                             this.write(resId.id,res,a0).then((resWritenot:any)=>{
                               console.log("second write for data===",resWritenot)
                             })
                           })
                         }
                         else{
                           console.log("ao else====",a0)
                           console.log("else network absent");
                           this.general.dataBackUp('backUpdataSensegiz',this.dataFull)
                           this.write(resId.id,res,a0).then((resWritenot:any)=>{
                             console.log("second write for data===",resWritenot)
                           })

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
       //   }
       //   else{
       //     console.log("res  mac1 not valid")
       //     resolve(false)
       //   }
       // })
     // })()
   })
}



 connectBleDeviceWriteTime(resId){
   console.log("camere connect ble write time")
   return new Promise((resolve,reject)=>{

     // (async () =>{


       console.log("resId====",resId)
       // var hexDataAdvertising = this.buf2hex(resId.advertising).toUpperCase()
       // console.log("hexDataAdvertising1===",hexDataAdvertising)
       // var split = hexDataAdvertising.split('0408')
       // console.log("split1===",split)
       // var findIdAdvertisement = this.hex2dec(split[1].substring(0,4))
       // console.log("findIdAdvertisement1===",findIdAdvertisement)

       var findIdAdvertisement = this.hex2dec(resId.advertising.kCBAdvDataServiceUUIDs[1])
       console.log("findIdAdvertisement===",findIdAdvertisement)


       var data = {
         userId : this.loginData.userId,
         macId : resId.id,
         deviceId : findIdAdvertisement
       }

       this.setTimerConnection =  setTimeout(()=>{
         if(this.connectTimmer==1){
           this.disconnect(resId.id)
           this.background()
           console.log("came timer 2==",this.setTimer)
         }
       },6000)

       // await this.api.validateMac(data).then((resValid:any)=>{
       //   console.log("res  mac 2==",resValid)
       //
       //   if(resValid.status){
           this.ble.connect(resId.id).subscribe((res:any)=>{
             console.log("connected time device==",res)
             this.connectStatus = "Connected "+findIdAdvertisement+" device"
             this.changeDetectorRef.detectChanges();
             if(res.characteristics.length>0){
               console.log("char===",res.characteristics[9])
               if(res.characteristics[9].service == 'FFF0' && res.characteristics[9].characteristic=='FFF1'){
                 console.log("char entered if===",res.characteristics[9])
                 var value = this.str2abb(this.general.timeBle())

                 this.ble.write(resId.id,res.characteristics[9].service,res.characteristics[9].characteristic,value).then((resdata:any)=>{
                   console.log("written time",resdata)
                   if(res.characteristics[12].service == 'FFF0' && res.characteristics[12].characteristic=='FFF4'){
                     this.ble.startNotification(resId.id,res.characteristics[12].service,res.characteristics[12].characteristic).subscribe((data:any)=>{
                       var hexData = this.buf2hex(data).toUpperCase()
                       console.log("started notified time",hexData)
                       this.connectTimmer = 0
                       if(hexData == "0011111111000000"){
                         console.log("end notify time");
                         this.ble.stopNotification(resId.id,res.characteristics[12].service,res.characteristics[12].characteristic).then(stopNot=>{
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
     //     }
     //     else{
     //       console.log("res  mac2 not valid")
     //       resolve(false)
     //     }
     //   })
     // })()


   })
}



write(id,res,data){
  return new Promise((resolve,reject)=>{
    // for(var i=0 ; i<res.characteristics.length ; i++){
    if(res.characteristics.length>0){
      console.log("char===",res.characteristics[9])
      if(res.characteristics[9].service == 'FFF0' && res.characteristics[9].characteristic=='FFF1'){
        console.log("char entered if===",res.characteristics[9])
        var value = this.str2abb(data)
        this.ble.write(id,res.characteristics[9].service,res.characteristics[9].characteristic,value).then((resdata:any)=>{
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
