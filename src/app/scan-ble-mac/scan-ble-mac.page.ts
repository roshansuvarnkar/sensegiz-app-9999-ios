import { Component, OnInit } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import {Router} from '@angular/router'
import { LoginStatusService } from '../login-status.service';
import { ApiService } from '../api.service';
import { GeneralMethodsService } from '../general-methods.service';
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
  ) { }

  ngOnInit() {
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
      console.log('Begin async operation');
      setTimeout(() => {
        console.log('Async operation has ended');
        this.scan()
        event.target.complete();
      }, 1000);
  }

}
