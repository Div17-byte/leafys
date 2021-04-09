import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import swal from 'sweetalert'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {

  isLoading;
  private authStatusSub: Subscription;
  private banstatus:Subscription;
  public isBanned:boolean;
   email:string;

  constructor(public authService:AuthService,private router:Router) { }

 async ngOnInit() {
    if(localStorage.getItem("token")){
      this.router.navigate(['/'])
    }

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus=>{
        this.isLoading = false;
      }
    )

  }


 async onLogin(form:NgForm){
  if(form.invalid){
    return;
  }
  //this.isLoading= true;
  this.email=form.value.email;
 await this.authService.checkBan(this.email).then((data)=> this.isBanned = data['isBanned'])
    console.log(this.isBanned);
    
    if(this.isBanned){
      swal("You have been banned by the Admin",{icon:'error'})
      this.isLoading=false;
      form.resetForm();
      return;
     }else {
       this.authService.login(form.value.email,form.value.password,form.value.username,false);
       this.isLoading = false;
      }
}


// focusOut(){

//   this.authService.checkBan(this.email).subscribe(res=>{
//     if(res)
//     this.isBanned = res['isBanned'];
//     else this.isBanned=false;
//     console.log(this.isBanned);

//   })

// }






ngOnDestroy(){
  this.authStatusSub.unsubscribe();
}
}
