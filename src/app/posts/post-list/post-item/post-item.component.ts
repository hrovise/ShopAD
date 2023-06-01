import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../../post.model';
import { PostService } from '../../post.service';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})
export class PostItemComponent implements OnInit, OnDestroy{


  @Input() postItem : Post;
  @Input() postsPerPage: number;
  @Input() currentPage: number;
  authStatusSub: Subscription;
  userIsAuthenticated=false;
  isAdmin = false;
  stateOfQuantity = '25';
  defaultvalue = 25;
   bought = false;
 // quantity = [25, 200, 1000];

  constructor(private postService:PostService, private authService: AuthService) { }

  ngOnInit(): void {
  this.isAdmin = this.authService.getAdmin();
    //getUser and set isAdmin = true;
    this.userIsAuthenticated = this.authService.getAuthStatus();
    this.authStatusSub=this.authService.getAuthStatusListener().subscribe(isAuthenticated=>{
      this.userIsAuthenticated =isAuthenticated;
    });
  }

  onDelete(id:string){

    this.postService.deletePost(id).subscribe(()=>{
      this.postService.getPosts(this.postsPerPage, this.currentPage)
    });
  }

  onAdd(id: string) {
    const quantity = this.stateOfQuantity

    this.postService.addToCart(id, quantity);
     this.bought = true;
    setTimeout(() => {
      this.bought = false;
    }, 2000)
  }
  Onevent(event) {

    this.stateOfQuantity = event;
    // console.log((<HTMLInputElement>event.target).value)
  }
  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
