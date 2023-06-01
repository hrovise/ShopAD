import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard-for-admin',
  templateUrl: './dashboard-for-admin.component.html',
  styleUrls: ['./dashboard-for-admin.component.css']
})
export class DashboardForAdminComponent implements OnInit {
  user: any;
  isLoading = false;
  ROLE_ADMIN = "ADMIN";
  subscription = new Subscription();
  statusUser = 'дійсний';
  displayMessage=''
  constructor(public authService: AuthService){}

  ngOnInit(): void {
    this.authService.userRoleUpdate.subscribe(data => {

      this.user.role = data;

   })
  }

  GrantRole(user: any) {
    this.authService.grantRole(user);
  }
  denyRole(user: any) {
    this.authService.denyRole(user);
  }
    onSearch(form: NgForm) {
      if(form.invalid){
        return;
      }
      this.isLoading=true;
      this.authService.findUser(form.value.nameUser).subscribe(response => {
        this.user = response.user
        if( this.statusUser=response.user.status)
        this.statusUser=response.user.status
      });
    }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
   block(user: any) {
     this.authService.blockUser(user).subscribe(res => {
       this.statusUser = 'blocked'
       this.displayMessage=res.message
       setTimeout(() => {
         this.displayMessage=''
       },2000)

    });
   }
  unblock(user: any) {
     this.authService.unBlockUser(user).subscribe(res => {
       this.statusUser = 'unblocked'

        this.displayMessage=res.message
       setTimeout(() => {
         this.displayMessage=''
       },2000)
    });
  }
}

