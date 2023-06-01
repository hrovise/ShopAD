import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card'
import {MatButtonModule} from '@angular/material/button';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxMaskModule } from 'ngx-mask';

import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { PostItemComponent } from './posts/post-list/post-item/post-item.component';
import { LoginComponent } from './auth/login/login.comonent';
import { SignupComponent } from './auth/signup/signup.comonent';
import { AuthInterceptor } from './auth/auth-interceptor';
import { CartComponent } from './posts/cart/cart.component';
import { SortingPipe } from './sorting.pipe';
import { OrderComponent } from './order/order.component';
import {  DropDownDirective } from './shared/app-drop-down.directive';
import { MatSelectModule } from '@angular/material/select';
import { DashboardForAdminComponent } from './dashboard-for-admin/dashboard-for-admin.component';
import { ItemDetailComponent } from './posts/post-list/post-item/item-detail/item-detail.component';
import { QuillModule } from 'ngx-quill';
import { PostAdminComponent } from './posts/post-admin/post-admin.component';
import { AddCategoryForPostComponent } from './posts/post-admin/add-category-for-post/add-category-for-post.component';
import { PostCreateComponent } from './posts/post-admin/post-create/post-create.component';
import { CommentsComponent } from './posts/post-list/post-item/item-detail/comments/comments.component';
import { RecaptchaModule } from 'ng-recaptcha';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog'
import { DialogComponent } from './dialog/dialog.component';
import { AboutComponent } from './about/about.component';
import { ContactsComponent } from './contacts/contacts.component';
import { DashboardUserComponent } from './dashboard-user/dashboard-user.component';
import { ActivateComponent } from './activate/activate.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { FooterComponent } from './footer/footer.component';
import { ConfirmdialogComponent } from './confirmdialog/confirmdialog.component';
import { StatusPipe } from './status.pipe';

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent,
    PostItemComponent,
    LoginComponent,
    SignupComponent,
    CartComponent,
    SortingPipe,
    OrderComponent,
    DropDownDirective,
    DashboardForAdminComponent,
    ItemDetailComponent,
    PostAdminComponent,
    AddCategoryForPostComponent,
    CommentsComponent,
    DialogComponent,
    AboutComponent,
    ContactsComponent,
    DashboardUserComponent,
    ActivateComponent,
    ResetPasswordComponent,
    NewPasswordComponent,
    FooterComponent,
    ConfirmdialogComponent,
    StatusPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    RecaptchaModule,
    MatDialogModule,


    HttpClientModule,
    MatSelectModule,
    QuillModule.forRoot(),
   NgxMaskModule.forRoot()


  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, { provide: MAT_DIALOG_DATA, useValue: {} }],
  bootstrap: [AppComponent]
})
export class AppModule { }
