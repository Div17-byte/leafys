import { Component, OnInit, OnDestroy } from "@angular/core";
import { PostsService } from "../posts.service";
import { Subscription } from 'rxjs';
import { Post } from "../post.model";
import { PageEvent } from "@angular/material/paginator";
import swal from 'sweetalert';
import { AuthService } from "src/app/auth/auth.service";
import { HttpClient } from "@angular/common/http";
import { DownloadService } from "../download.service";
import * as fileSaver from 'file-saver';
import {LazyImgDirective} from './lazy.directive';



declare function myImage():any ;

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" }
  // ];

  posts: Post[] = [];
  isLoading = false;
  totalPosts = 30;
  postsPerPage= 30;
  currentPage =1;
  pageSizeOptions = [1,2,5,10];
  userIsAuthenticated = false;
  userId:string;
  filterString:string;

  private postsSub: Subscription;
  private authStatusSub:Subscription

  constructor(public postsService: PostsService,private authService:AuthService,private downloadSer:DownloadService) {}




returnBlob(res):Blob{
  console.log('file downloaded');
  return new Blob([res], {type:'image/jpeg'});

}

download(imageName){
  this.downloadSer.downloadFile(imageName).subscribe(res =>{
if(res){
  fileSaver.saveAs(this.returnBlob(res),imageName);
}
  })
}



  ngOnInit() {
    myImage();
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage,this.currentPage);
    this.userId = this.authService.getuserId();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount:number}) => {
        this.isLoading = false;
         this.totalPosts= postData.postCount;
         console.log(postData.postCount);

        this.posts = postData.posts;
      });
      this.userIsAuthenticated = this.authService.getIsAuth();
     this.authStatusSub= this.authService
     .getAuthStatusListener()
     .subscribe(isAuthenticated=>{
        this.userIsAuthenticated= isAuthenticated;
        this.userId = this.authService.getuserId();
     });


  }




onChangedPage(pageData:PageEvent){

  this.isLoading = true;
  this.currentPage = pageData.pageIndex + 1;
  this.postsPerPage = pageData.pageSize;


  this.postsService.getPosts(this.postsPerPage,this.currentPage);

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
          this.postsService.getPosts(this.postsPerPage, this.currentPage);
        });
        swal("Poof! Your post has been deleted!", {
          icon: "success",
        });
      }
    });


  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
