import { Component } from '@angular/core';
import { GeneralMethodsService } from '../general-methods.service';
import { LoginStatusService } from '../login-status.service';
import {Router} from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
  private generalServices:GeneralMethodsService,
  private login:LoginStatusService,
  private router:Router) {
  }

}
