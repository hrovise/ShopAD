import { Component, OnInit } from '@angular/core';
import { PostService } from '../posts/post.service';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.css']
})
export class ActivateComponent implements OnInit {
id;
  constructor(private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
     this.route.params.subscribe((params: Params) => {
        this.id = params['id'];
        console.log(this.id)
       this.authService.activate(this.id);
    });
  }

}
