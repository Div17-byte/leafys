import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from '@angular/router';
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { MatInputModule} from "@angular/material/input";
import { MatCardModule} from "@angular/material/card";
import { MatButtonModule} from "@angular/material/button";
import { MatToolbarModule} from "@angular/material/toolbar";
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatExpansionModule} from "@angular/material/expansion";
import { MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { MatPaginatorModule } from "@angular/material/paginator";
import {MatIconModule} from '@angular/material/icon';
import { AppComponent } from "./app.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { HeaderComponent } from "./header/header.component";
import { AppRoutingModule } from "./app-routing.module";
import { PostListComponent } from "./posts/post-list/post-list.component";
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component'
import { AuthInterceptor } from "./auth/auth-interceptor";
import { HomeComponent } from './home/home.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FooterComponent } from './footer/footer.component';
import { AdminComponent } from './admin/admin.component';
import { TestComponent } from './test/test.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { MyUploadsComponent } from './posts/my-uploads/my-uploads.component';












@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    FooterComponent,
    AdminComponent,
    TestComponent,
    AdminLoginComponent,
    MyUploadsComponent,


  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatIconModule,
    HttpClientModule,
    Ng2SearchPipeModule




  ],
  providers: [{provide:HTTP_INTERCEPTORS,useClass:AuthInterceptor,multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule {}
