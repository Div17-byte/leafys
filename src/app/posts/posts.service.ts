import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { Post } from "./post.model";
import { User} from "../admin/user.model"
import { Admin } from "../admin/admin.model"
import swal from 'sweetalert';

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private users: User[] = [];
  private usrp: Post[] = [];
  private postsUpdated = new Subject<{ posts:Post[]; postCount: number}>();
  private allPostsUpdated = new Subject<Post[]>();
  private allUserUpdated = new Subject<User[]>();
  private UserPosts = new Subject<Post[]>();
  private reqUrl = "http://localhost:3001/";

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage:number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any, maxPosts: number }>(this.reqUrl+"api/posts"+ queryParams)
      .pipe(
        map(postData => {
          return {posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              imageName:post.imageName,
              creator:post.creator,
              creatorName:post.creatorName,
            };
          }),
          maxPosts: postData.maxPosts};
        })
      )
      .subscribe(transformedPostData => {
        console.log(transformedPostData);
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts:[...this.posts],
          postCount:transformedPostData.maxPosts});
      });
  }

  getUserPosts(id:string){
    this.http.get<{usrpost:Post[]}>(this.reqUrl+"userUploads/"+ id).subscribe((data)=>{
      if(data){
        this.usrp = data.usrpost;
        this.UserPosts.next([...this.usrp])
      }
      else
      {
        swal('Internal Server error',{icon:'error'});
      }

    })
  }

  getUserName(id:string){
   return this.http.get(this.reqUrl+"api/user/uname/"+id)
  }

  getUserPostsListener() {
    return this.UserPosts.asObservable();
  }
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
  getAllPostUpdatListenet(){
    return this.allPostsUpdated.asObservable();
  }
  getAllUserUpdateListner(){
    return this.allUserUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string,imageName:string,creator:string,creatorName:string  }>(
      this.reqUrl+"api/posts/" + id
    );
  }
/////////////////////////////////////for Admin
  getAllPosts(){

    this.http.get<{msg:Post[]}>(this.reqUrl+"admin_get")
    .subscribe((postData)=>{
      this.posts = postData.msg
      this.allPostsUpdated.next([...this.posts])
    })
  }
  getAllUser(){
    this.http.get<{res:User[]}>(this.reqUrl+"admin_get_users").subscribe((userData)=>{
      this.users = userData.res
      this.allUserUpdated.next([...this.users]);
    })
  }
  banUser(id:string){

   return this.http.get<{doc:User[]}>(this.reqUrl+"admin_ban/"+id)
  }


  UnbanUser(id:string){

    this.http.get(this.reqUrl+"admin_Unban/"+id).subscribe((res)=>{
      if(res){
        console.log(res);

      }
    })
   }
   deleteUser(id:string){
    return this.http.delete(this.reqUrl+"admin_DeleteUser/"+id)
   }
   adminDeletePost(id:string){
     console.log(id);

      return this.http.delete(this.reqUrl+"admin_DeletePost/"+id)
   }


   adminLogin(username:string,password:string){
     const adminData:Admin ={admin_name:username,admin_pass:password}
     this.http.post(this.reqUrl+"admin_login",adminData)
     .subscribe(response =>{
       if(response){
         console.log(response['doc']['admin_email']);
         let admin_email = response['doc']['admin_email'];

         localStorage.setItem('Admin_email',admin_email)
        swal('Login Authorized',{icon:'success'});
       this.router.navigate(['/admin']);

       }

     },error=>{
       swal('Invalid Credentials',{icon:'error'});
     })

   }




   ////////////////////// Admin end

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http
      .post<{ message: string; post: Post }>(
        this.reqUrl+"api/posts",
        postData
      )
      .subscribe(responseData => {
       this.router.navigate(["/list"]);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        _id: id,
        title: title,
        content: content,
        imagePath: image,
        imageName: null,
        creator:null,
        creatorName:null
      };
    }
    this.http
      .put(this.reqUrl+"api/posts/" + id, postData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
   return this.http
      .delete(this.reqUrl+"api/posts/" + postId);

  }
}
