import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardAdmin } from "./auth/admin.guard";
import { AuthGuard } from "./auth/auth.guard";
import { LoginComponent } from "./auth/login/login.comonent";
import { SignupComponent } from "./auth/signup/signup.comonent";
import { DashboardForAdminComponent } from "./dashboard-for-admin/dashboard-for-admin.component";
import { OrderComponent } from "./order/order.component";
import { CartComponent } from "./posts/cart/cart.component";
import { AddCategoryForPostComponent } from "./posts/post-admin/add-category-for-post/add-category-for-post.component";
import { PostAdminComponent } from "./posts/post-admin/post-admin.component";
import { PostCreateComponent } from "./posts/post-admin/post-create/post-create.component";
import { CommentsComponent } from "./posts/post-list/post-item/item-detail/comments/comments.component";

import { ItemDetailComponent } from "./posts/post-list/post-item/item-detail/item-detail.component";
import { PostListComponent } from "./posts/post-list/post-list.component";
import { AboutComponent } from "./about/about.component";
import { ContactsComponent } from "./contacts/contacts.component";
import { ActivateComponent } from "./activate/activate.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { NewPasswordComponent } from "./new-password/new-password.component";
import { DashboardUserComponent } from "./dashboard-user/dashboard-user.component";

const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'order', component: OrderComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent },
      { path: 'contacts', component: ContactsComponent },
  { path: 'cart/:postId', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'activate/:id', component: ActivateComponent },
  { path: 'reset', component: ResetPasswordComponent },
    { path: 'newpass/:id', component: NewPasswordComponent },

  { path: 'dashboard-admin', component: DashboardForAdminComponent, canActivate: [AuthGuardAdmin] },
   { path: 'dashboard-user', component: DashboardUserComponent },
  {
    path: 'create', component: PostAdminComponent, canActivate: [AuthGuardAdmin], children: [
      { path: 'new', component: PostCreateComponent },
       {path: 'category', component: AddCategoryForPostComponent}
   ] },
  {
    path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuardAdmin], children: [
    // { path: 'new', component: PostCreateComponent }
  ]},
  {path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent },
  {
    path: 'detail/:id', component: ItemDetailComponent, children: [
       { path: '', component: CommentsComponent },
    ]}

]
@NgModule({
imports: [
  RouterModule.forRoot(routes)
],
exports: [RouterModule],
providers: [AuthGuard, AuthGuardAdmin]
})
export class AppRoutingModule {

}
