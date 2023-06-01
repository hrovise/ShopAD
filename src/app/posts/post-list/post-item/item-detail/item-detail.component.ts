import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { DialogComponent } from 'src/app/dialog/dialog.component';

import { Post } from 'src/app/posts/post.model';
import { PostService } from 'src/app/posts/post.service';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {

  formModal: any;
  takencomment=[];
  id;
  post: Post;
  commentsSubscription: Subscription;
  userIsAuthenticated = false;
  isSend = false;
  constructor(private authService: AuthService, public dialog:MatDialog, private postService: PostService, private route:ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

//     this.dialogreference.EventSend.subscribe(res => {
//       this.isSend = res;
//       setTimeout(() => {
//         this.isSend=false
//       },2000)
// })
 this.userIsAuthenticated = this.authService.getAuthStatus();
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];

      this.postService.getPost(this.id).subscribe(post => {
        this.post = ({
          id: post._id,
          category: post.category,
          title: post.title,
          price: post.price,
          content: post.content,
          contentLarge: post.contentLarge,
          quantity: post.quantity,
          imagePath: post.imagePath
        } )
      })
  //      this.postService.showComment(this.id).subscribe(result => {
  //    this.takencomment = result;
  //  });
  //     this.commentsSubscription= this.postService.getCommentUpdateListener().subscribe(result => {
  //     console.log(result);
  //       this.takencomment = result.comments;
  //       console.log(this.takencomment);
  //   }

  //     );
      });

  }
   openDialog(post){
  let dialogRef=    this.dialog.open(DialogComponent, {
       width: "745px",
       height:"400px"
  })
     dialogRef.componentInstance.title = this.post.title;
   }



}


