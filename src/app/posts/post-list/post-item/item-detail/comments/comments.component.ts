import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { PostService } from 'src/app/posts/post.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  form: FormGroup;
  id;
  userIsAuthenticated = false;
  private authListenerSubsAdmin: Subscription;
  isAdmin = false;
 @Input('cometa') comments = [];
  commentsSubscription: Subscription;
  constructor(private postService: PostService, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.getAuthStatusAdmin();
     this.authListenerSubsAdmin =this.authService.getAuthStatusAdminListener().subscribe(isAdmin=>{
      this.isAdmin = isAdmin // true

    })
     this.userIsAuthenticated = this.authService.getAuthStatus();

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];

    })
    this.postService.showComment(this.id)
  //     .subscribe(result => {
  //    this.comments = result;
  //  });

   this.postService.getCommentUpdateListener().subscribe(result => {

     this.comments = result.comments;
    }

  );
  }



 onSave(event){





    // this.postService.addСomment(
    //   this.form.value.title
    // )

   this.postService.addComment(event.value, this.id);
   event.value = '';
  //  this.postService.showComment(this.id)
  //    .subscribe(result => {
  //    console.log('we are in add')
  //    this.comments = result;
  //  });
   this.commentsSubscription= this.postService.getCommentUpdateListener().subscribe(result => {

     this.comments = result.comments;
    }

  );
 }
  onDelete(id) {
    let idPost = this.id;
  this.postService.deleteComment(id, idPost);
  }

  ngOnDestroy() {
    this.authListenerSubsAdmin.unsubscribe();
  }
}
