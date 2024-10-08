import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import swal from 'sweetalert'


@Injectable({ providedIn: "root"})
export class AuthService {
  private isAuthenticated = false;
   private token :string;
   private tokenTimer: any;
   private userId:string;
   private isBan:boolean;
   private authStatusListener= new Subject<boolean>();
   private banStatusListener= new Subject<boolean>();
   private reqUrl = "http://localhost:3001/";

  constructor(private http: HttpClient,private router:Router){}
  getToken(){
    return this.token;
  }
  getIsAuth(){
    return this.isAuthenticated;
  }
  getuserId(){
    return this.userId;
  }
  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }
  getbanStatusListener(){
    return this.banStatusListener.asObservable();
  }

  createUser(email: string, password: string, username: string, banStatus: boolean){
    const authData:AuthData = {email: email, password: password, username:username, banStatus:banStatus}
    this.http.post(this.reqUrl+"api/user/signup",authData).subscribe(()=>{
      this.router.navigate(["/login"]);
    }, error=>{
      this.authStatusListener.next(false);
      swal('User Already exists',{icon:'info'})
    })

  }
  login(email:string, password:string,username:string, banStatus:boolean){
    const authData:AuthData = {email: email, password: password, username:username, banStatus:banStatus}
    this.http.post<{token:string,expiresIn:number, userId:string}>(this.reqUrl+"api/user/login",authData)
    .subscribe(response =>{
       const token = response.token;
       this.token = token;
       if(token){
         const expiresInDuratioin = response.expiresIn;
         this.setAuthTimer(expiresInDuratioin);
         this.isAuthenticated = true;
         this.userId = response.userId;
         this.authStatusListener.next(true);
         const now =  new Date();
         const expirationDate = new Date(now.getTime()+expiresInDuratioin*1000);
         console.log(expirationDate);
         this.saveAuthData(token, expirationDate,this.userId);
         this.router.navigate(['/list']);
       }

    },error=>{
      this.authStatusListener.next(false)
      swal('Invalid Credentials',{icon:'error'});

    });
  }
  autoAuthUser(){
    const authInformation = this.getAuthData();
    if(!authInformation){return;}
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();


    if(expiresIn>0){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn/1000)
      this.authStatusListener.next(true);

    }

  }
  checkBan(email:string){

   const data = this.http.get(this.reqUrl+"api/user/Check_ban_status/"+email).toPromise();
   return data;

  }
  logout(){
    this.token = null;
    this.isAuthenticated=false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
    window.location.reload();
  }

  private setAuthTimer(duration:number){
    console.log("Setting timer: "+duration);

    this.tokenTimer= setTimeout(() => {
      this.logout();
    }, duration*1000);
  }
  private saveAuthData(token:string,expirationDate:Date,userId:string){
    localStorage.setItem('token',token);
    localStorage.setItem('expiration',expirationDate.toISOString());
    localStorage.setItem("userId",userId);
  }
  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData(){
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId")
    if(!token || !expirationDate){
      return;
    }
    return{
      token:token,
      expirationDate:new Date(expirationDate),
      userId:userId
    }
  }
}
