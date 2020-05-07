import { Component, OnInit } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';


@Component({
  selector: 'app-device-scan',
  templateUrl: './device-scan.page.html',
  styleUrls: ['./device-scan.page.scss'],
})
export class DeviceScanPage implements OnInit {

status:boolean=false
devices:any=[]

  constructor(private ble:BLE) { }

  ngOnInit() {
    this.scan()
  }

  scan(){
    this.devices=[]
    this.ble.scan([],5).subscribe(
      device=>this.showDevice(device),
      error=>this.scanError(error)
    )
  }

showDevice(device){
  console.log("devices===",device)
  this.status=true
  this.devices.push(device)
}


scanError(error){
  console.log("device error",error)
  this.status=false
}

doRefresh(event) {
    console.log('Begin async operation');
    this.scan()

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
}


}
