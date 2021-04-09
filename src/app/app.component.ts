import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import {fadeAnimation} from './animations';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations:[
fadeAnimation
  ]
})
export class AppComponent implements OnInit {
  constructor(private authService:AuthService){}
  ngOnInit(){
    this.authService.autoAuthUser();
   }
   prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

}
