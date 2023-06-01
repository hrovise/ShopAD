import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { ActivatedRoute, Router } from "@angular/router";


@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  isLoading = false;
  captcha = '';
  success: true;
  isLoged: any;
  FailedLogin: boolean;

  constructor(public authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute){}

  ngOnInit() {
    this.authService.getFailedLogin().subscribe(res => {
      this.FailedLogin = res;
     this.isLoading = false;
      console.log('login', res)
      setTimeout(() => {
        this.FailedLogin = true;
      }, 2000);
    })
  }
    onLogin(form: NgForm) {
      if(form.invalid){
        return;
      }
      this.isLoading = true;
      // if (this.success)
      this.authService.login(form.value.email, form.value.password)

      // else {
      //   console.log(this.success)
      //  // form.reset();
      //   this.isLoading = false;
      //   this.router.navigate(["/login"], {relativeTo:this.activatedRoute});
      // }

  }

  resolved(captchaResponse: string) {
    this.captcha = captchaResponse;
    console.log("captcha" + this.captcha);
    this.success = true;
  }

  onReset() {
    this.router.navigate(['../reset']);
  }
}
