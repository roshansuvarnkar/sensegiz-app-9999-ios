import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  localHost :any = localStorage.getItem('sensegizapi')
  host:String= this.localHost == undefined  ? 'http://sd1-api.sensegiz.com:3000' : this.localHost =='undefined:3000' ? 'http://sd1-api.sensegiz.com:3000' : this.localHost ==null ? 'http://sd1-api.sensegiz.com:3000' :this.localHost

  constructor(private http:HttpClient) { }

  getUrlHost(){
    this.localHost = localStorage.getItem('sensegizapi')
    this.host = this.localHost == undefined  ? 'http://sd1-api.sensegiz.com:3000' : this.localHost =='undefined:3000' ? 'http://sd1-api.sensegiz.com:3000' : this.localHost ==null ? 'http://sd1-api.sensegiz.com:3000' :this.localHost
    return this.host
  }

  send(data){
    console.log("this.localHost==",this.localHost)
    console.log("this.host==",this.host)
  	const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    var url = this.getUrlHost() + '/login'

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
    var url = this.getUrlHost() + '/appAdminAssignView'

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
    var url = this.getUrlHost() + '/appAssignUser'

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
    var url = this.getUrlHost() + '/appDeviceLogout'

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
    var url = this.getUrlHost() + '/dataCollection'

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
    var url = this.getUrlHost() + '/appOnOffTime'

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
    var url = this.getUrlHost() + '/appGetRssi'

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
    var url = this.getUrlHost() + '/appBleUpdate'

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
    var url = this.getUrlHost() + '/appBleValidate'

    return new Promise((resolve,reject)=>{
      this.http.post(url,data,httpOptions).subscribe(res=>{
        resolve(res)
      },err=>{
        reject(err)
      })
    })
  }


   getServers(data){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    var url = 'http://sd1-api.sensegiz.com:3000/appGetServers'

    return new Promise((resolve,reject)=>{
      this.http.post(url,data,httpOptions).subscribe(res=>{
        resolve(res)
      },err=>{
        reject(err)
      })
    })
  }




}
