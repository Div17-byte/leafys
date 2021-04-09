import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import swal from 'sweetalert';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  isLoading = false;
  private authStatusSub: Subscription
  constructor(public authService:AuthService,private router:Router) { }


  ngOnInit(): void {
    if(localStorage.getItem("token")){
      this.router.navigate(['/'])
    }


    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus=>{
        this.isLoading = false

      }
    );
  }

  onSignup(form:NgForm){

    if(form.invalid){
      return
    }
    this.isLoading= true
    this.authService.createUser(form.value.email,form.value.password,form.value.username,false)

    // swal("Successfully registred", {
    //   icon: "success",
    // });
    // this.router.navigate(['/login']);
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();

  }




}
