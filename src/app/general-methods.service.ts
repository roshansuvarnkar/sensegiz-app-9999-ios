import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GeneralMethodsService {

  constructor(private toastctrl:ToastController) { }


  async toast(msg){

  	const toast = await this.toastctrl.create({
      message: msg,
      position: 'bottom',
    });
  		toast.present();

  		setTimeout(function(){ toast.dismiss() }, 3000);
  }

}
