import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  host:String=environment.apiHost
  constructor(private http:HttpClient) { }

  send(data){
  	const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    var url = this.host + '/login'

    return new Promise((resolve,reject)=>{
    	this.http.post(url,data,httpOptions).subscribe(res=>{
    		resolve(res)
    	},err=>{
        reject(err)
      })
    })

  }





  getUserAssigned(data){
  	const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    var url = this.host + '/appAdminAssignView'

    return new Promise((resolve,reject)=>{
    	this.http.post(url,data,httpOptions).subscribe(res=>{
    		resolve(res)
    	},err=>{
        reject(err)
      })
    })

  }




  assignUser(data){
  	const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    var url = this.host + '/appAssignUser'

    return new Promise((resolve,reject)=>{
    	this.http.post(url,data,httpOptions).subscribe(res=>{
    		resolve(res)
    	},err=>{
        reject(err)
      })
    })

  }




  deviceLogout(data){
  	const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    var url = this.host + '/appDeviceLogout'

    return new Promise((resolve,reject)=>{
    	this.http.post(url,data,httpOptions).subscribe(res=>{
    		resolve(res)
    	},err=>{
        reject(err)
      })
    })

  }



   SendData(data){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    var url = this.host + '/dataCollection'

    return new Promise((resolve,reject)=>{
      this.http.post(url,data,httpOptions).subscribe(res=>{
        resolve(res)
      },err=>{
        reject(err)
      })
    })

  }

   getOnOffTime(data){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    var url = this.host + '/appOnOffTime'

    return new Promise((resolve,reject)=>{
      this.http.post(url,data,httpOptions).subscribe(res=>{
        resolve(res)
      },err=>{
        reject(err)
      })
    })
  }


   getRssi(data){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    var url = this.host + '/appGetRssi'

    return new Promise((resolve,reject)=>{
      this.http.post(url,data,httpOptions).subscribe(res=>{
        resolve(res)
      },err=>{
        reject(err)
      })
    })
  }


   addBleMac(data){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    var url = this.host + '/appBleUpdate'

    return new Promise((resolve,reject)=>{
      this.http.post(url,data,httpOptions).subscribe(res=>{
        resolve(res)
      },err=>{
        reject(err)
      })
    })
  }


   validateMac(data){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    var url = this.host + '/appBleValidate'

    return new Promise((resolve,reject)=>{
      this.http.post(url,data,httpOptions).subscribe(res=>{
        resolve(res)
      },err=>{
        reject(err)
      })
    })
  }




}
