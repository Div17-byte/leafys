import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts/posts.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  constructor(private postSerive:PostsService) { }

  ngOnInit(): void {
  }

  onLogin(form:NgForm){
    if(form.invalid)
    { return }
    this.postSerive.adminLogin(form.value.username,form.value.password)

  }

}
