import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})

export class NewPasswordComponent implements OnInit {

  id;
  success: boolean;
  notchanged= false;
  constructor(private route: ActivatedRoute,private authService: AuthService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];

    }  )
  }

  newPassword(form) {
    if(form.value.password.length>2){
    const hash = this.id;

    this.authService.newPassword(form.value.password, hash).subscribe({
      next: (data) => {

       if (data.message) {
        this.success = true;
        // form.value.reset();
         this.notchanged = true;
      }
    },
    error: (error) => {
      console.log(error);
       this.success = false;
    }
    });

  } else {
    this.success=false
  }
  }
}


