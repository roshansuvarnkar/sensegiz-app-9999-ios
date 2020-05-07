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
    	})
    })

  }




}
