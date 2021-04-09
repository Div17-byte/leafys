import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';
import { Post } from "../post.model";
import swal from 'sweetalert';
import { AuthService } from "src/app/auth/auth.service";
import { PostsService } from "../posts.service";





declare function myImage():any ;

@Component({
  selector: "app-my-uploads",
  templateUrl: "./my-uploads.component.html",
  styleUrls: ["./my-uploads.component.css"]
})
export class MyUploadsComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" }
  // ];

  posts: Post[] = [];
  isLoading = false;
  userIsAuthenticated = false;
  userId:string;
  username:string;
  filterString:string;

  private userPostsSub: Subscription;
  private authStatusSub:Subscription

  constructor(public postsService: PostsService,private authService:AuthService) {}





  ngOnInit() {
    myImage();
    this.isLoading = true;
    this.userId = this.authService.getuserId();
    console.log(this.userId);
    this.getUserName();
    this.postsService.getUserPosts(this.userId);
    this.userPostsSub = this.postsService
      .getUserPostsListener()
      .subscribe((postData) => {
        this.isLoading = false;
        this.posts = postData;
      });
      this.userIsAuthenticated = this.authService.getIsAuth();
     this.authStatusSub= this.authService
     .getAuthStatusListener()
     .subscribe(isAuthenticated=>{
        this.userIsAuthenticated= isAuthenticated;
        this.userId = this.authService.getuserId();
     });


  }


  getUserName(){
    this.postsService.getUserName(this.userId).subscribe(u=>{
      if(u){
        this.username=u['uname'];
      }
      else this.username='User'
    })

  }



  onDelete(postId: string) {
    swal({
      title: "Are you sure !",
      icon: "error",
      buttons: [true,true],
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        this.postsService.deletePost(postId).subscribe(() => {
          this.postsService.getUserPosts(this.userId);
        });
        swal("Poof! Your post has been deleted!", {
          icon: "success",
        });
      }
    });


  }

  ngOnDestroy() {
    this.userPostsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
