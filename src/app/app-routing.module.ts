import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PostListComponent } from "./posts/post-list/post-list.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { AuthGuard } from "./auth/auth-guard";
import { HomeComponent } from "./home/home.component";
import { AdminComponent } from "./admin/admin.component";
import { TestComponent } from "./test/test.component";
import { AdminLoginComponent } from "./admin-login/admin-login.component";
import { MyUploadsComponent } from "./posts/my-uploads/my-uploads.component";


const routes: Routes = [
  { path: '', component: PostListComponent,canActivate:[AuthGuard]},
  { path: 'home', component: HomeComponent},
  { path: 'test',component:TestComponent},
  { path: 'admin', component:AdminComponent},
  { path: 'admin_login', component:AdminLoginComponent},
  { path: 'list', component: PostListComponent,canActivate:[AuthGuard] },
  { path: 'myuploads', component: MyUploadsComponent,canActivate:[AuthGuard] },
  { path: 'create', component: PostCreateComponent,canActivate:[AuthGuard] },
  { path: 'edit/:postId', component: PostCreateComponent,canActivate:[AuthGuard] },
  { path: 'login', component:LoginComponent },
  { path: 'signup', component:SignupComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
