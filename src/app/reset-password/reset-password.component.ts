import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) { }
  email = '';
  success: boolean;
  successCaptcha: boolean;
  captcha = '';
  ngOnInit(): void {

  }

  onReset(form) {
    if (this.successCaptcha) {
      this.authService.resetPassword(form.value.email).subscribe({
        next: (data) => {
          console.log("Response");
          if (data.message) {

            this.success = true;
            this.email = '';



          } else
            this.success = false;
        },
        error: (error) => {
          console.log(error);
          this.success = false;
        }
      });
    }  else {

       // form.reset();

        this.router.navigate(["../reset"], {relativeTo:this.activatedRoute});
      }
  }

  resolved(captchaResponse: string) {
    this.captcha = captchaResponse;

    this.successCaptcha = true;
  }
}
