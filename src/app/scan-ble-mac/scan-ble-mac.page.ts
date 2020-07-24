import { Component, OnInit } from '@angular/core';
import { BLE } from '@ionic-native/ble';
import {Router} from '@angular/router'
import { LoginStatusService } from '../login-status.service';
import { ApiService } from '../api.service';
import { GeneralMethodsService } from '../general-methods.service';
import { Diagnostic } from '@ionic-native/diagnostic';

@Component({
  selector: 'app-scan-ble-mac',
  templateUrl: './scan-ble-mac.page.html',
  styleUrls: ['./scan-ble-mac.page.scss'],
})
export class ScanBleMacPage implements OnInit {
  devices:any=[]
  status:boolean=false

  constructor(
    private ble:BLE,
    private router:Router,
    private login:LoginStatusService,
    private api: ApiService,
    private general:GeneralMethodsService,
    private diagnostic: Diagnostic
  ) { }

  ngOnInit() {
    this.scan()

    // this.diagnostic.isBluetoothEnabled().then((resBle:any)=>{
    //   if(resBle){
    //     this.diagnostic.isLocationEnabled().then((resLoc:any)=>{
    //       if(resLoc){
    //       }
    //       else{
    //         if(confirm("Turn ON location")){
    //             this.diagnostic.switchToLocationSettings()
    //             console.log("back from location")
    //         }
    //       }
    //     })
    //   }
    //   else{
    //     if(confirm("Turn ON bluetooth")){
    //         this.diagnostic.switchToBluetoothSettings()
    //         console.log("back from bluetooth")
    //     }
    //     else{
    //
    //     }
    //   }
    // })
  }

  scan() {
    this.devices = [];
    this.ble.scan([], 5).subscribe(
      device => this.showDevice(device),
      error => this.scanError(error)
    );
  }

  showDevice(device){
    this.status=true
    this.devices.push(device)
    console.log("devices===",this.devices)
  }


  scanError(error){
    console.log("device error",error)
    this.status=false
  }

  clickDevice(a){
    this.router.navigate(['/add-ble-mac'], { queryParams: { record: JSON.stringify(a) } })
  }


  doRefresh(event) {
    this.scan()
    
      console.log('Begin async operation');
      setTimeout(() => {
        console.log('Async operation has ended');
        this.diagnostic.isBluetoothEnabled().then((resBle:any)=>{
          if(resBle){
            this.diagnostic.isLocationEnabled().then((resLoc:any)=>{
              if(resLoc){
              }
              else{
                if(confirm("Turn ON location")){
                    this.diagnostic.switchToLocationSettings()
                    console.log("back from location")
                }
              }
            })
          }
          else{
            if(confirm("Turn ON bluetooth")){
                this.diagnostic.switchToBluetoothSettings()
                console.log("back from bluetooth")
            }
            else{

            }
          }
        })
        event.target.complete();
      }, 1000);
  }

}
