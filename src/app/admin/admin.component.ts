import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../posts/post.model';
import { PostsService } from '../posts/posts.service';
import { User } from './user.model';
import swal from 'sweetalert'
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  post:Post[] = [];
  users:User[] = [];
  private allposts:Subscription;
  private allUser:Subscription;
  private banchk:Subscription;
  totalUsers;
  totalPosts;
  filterUser:string;
  filterImage:string;

  constructor(public postsService:PostsService,private router:Router) { }

  ngOnInit(): void {

    if(!localStorage.getItem('Admin_email')){
      this.router.navigate(['/admin_login'])
    }

    this.getallUser();
    this.getAllPosts();

  }
  adminLogout(){
    localStorage.removeItem('Admin_email');
    swal('You have been Logged Out',{
      icon:'warning'
    })
    this.router.navigate(['/admin_login']);
  }
  getAllPosts(){
    this.postsService.getAllPosts()
    this.allposts = this.postsService.getAllPostUpdatListenet().subscribe((posts:Post[])=>{
      this.post = posts;
      this.totalPosts=this.post.length;
      console.log(this.post);

    })
  }
  getallUser(){
    this.postsService.getAllUser()
    this.allUser = this.postsService.getAllUserUpdateListner().subscribe((users:User[])=>{
      this.users = users;
      this.totalUsers = users.length;
      // console.log(this.users);
    })
  }

  banUser(id:string){
    swal({
      title: "Are you sure you want to ban this user!",
      icon: "info",
      buttons: [true,true],
      dangerMode: true,
    })
    .then((willBan) => {
      if (willBan) {
        this.postsService.banUser(id).subscribe(status=>{
         if(!status){ swal('Server Error',{icon:'error'})}
         else{
          swal('User has been banned',{icon:'success'});}

        })
      }
    });
    // this.postsService.banUser(id)

  }
  UnbanUser(id:string){
    swal({
      title: "Are you sure!",
      icon: "info",
      buttons: [true,true],
      dangerMode: true,
    })
    .then((willUbBan) => {
      if (willUbBan) {
        this.postsService.UnbanUser(id)
        swal('User has been Unbaned',{icon:'success'})
      }
    });

  }

  DeleteUser(id:string){


    this.postsService.deleteUser(id).subscribe(result=>{
      if(!result){ swal('Deletion Error',{icon:'error'})}
      else {
        swal({
          title: "Are you sure!",
          icon: "info",
          buttons: [true,true],
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            swal('User has been deleted',{icon:'success'})
            this.getallUser()
          }
        });
    }
    })
  }
  DeletePost(id:string){
    this.postsService.adminDeletePost(id).subscribe(result=>{
      if(!result){ swal('Deletion Error',{icon:'error'})}
      else {
        swal({
          title: "Are you sure!",
          icon: "info",
          buttons: [true,true],
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            swal('User has been deleted',{icon:'success'})
            this.getAllPosts();
          }
        });
    }
    })
  }
  ngOnDestroy(){
    this.allposts.unsubscribe();

  }

}
