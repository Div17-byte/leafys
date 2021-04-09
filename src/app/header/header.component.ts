import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import swal from 'sweetalert';
import { Router } from "@angular/router";
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs:Subscription;
  constructor(private authService:AuthService,public _router:Router){}

  ngOnInit(){
    this.userIsAuthenticated = this.authService.getIsAuth();
   this.authListenerSubs=this.authService
   .getAuthStatusListener()
   .subscribe(isAuthenticated =>{
    this.userIsAuthenticated= isAuthenticated;
     });
  }


onLogout(){



  swal({
    title: "Are you sure!",
    icon: "info",
    buttons: [true,true],
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
      this.authService.logout();
    }
  });
}
  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
  }
}
