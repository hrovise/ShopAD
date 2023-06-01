import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import * as intlTelInput from "intl-tel-input";


@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent {
  isLoading = false;
  captcha = '';
  success: boolean;
  UserExist = false;
  userRegistred = false;
  constructor(public authService: AuthService,  private router: Router, private activatedRoute: ActivatedRoute){}

    onSignup(form: NgForm) {
      if(form.invalid){
        return;
      }
      this.isLoading = true;

      if (this.success)
        this.authService.createUser(form.value.email, form.value.name, form.value.nameCompany, form.value.city, form.value.contacts, form.value.password)
          .subscribe(response => {
            let message = "User is exist";
            if (response.message == message) {
              this.UserExist = true;
             this.isLoading = false;
              setTimeout(() => {
                this.UserExist=false
              }, 2000)
          //     this.router.navigate(['/signup'])
          // .then(() => {
          //   window.location.reload();
          // });
            } else {
              this.userRegistred = true;
              setTimeout(() => {
                this.router.navigate(['/login'])
                  .then(() => {
                    this.userRegistred = false;
                window.location.reload();
          });
              }, 3000);
          //      this.router.navigate(['/login'])
          // .then(() => {
          //   window.location.reload();
          // });
            }
          })

      else {
        console.log(this.success)
       // form.reset();
        this.isLoading = false;
        this.router.navigate(["/signup"], {relativeTo:this.activatedRoute});
      }

     // this.authService.createUser(form.value.email, form.value.password)
  }

    resolved(captchaResponse: string) {
    this.captcha = captchaResponse;
    console.log("captcha" + this.captcha);
    this.success = true;
  }
}
