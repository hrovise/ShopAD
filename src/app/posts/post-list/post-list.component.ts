import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { Post } from "../post.model";
import { PostService } from "../post.service";


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{

  // posts = [
  //   // {title: 'First Post', content: 'This is first post content'},
  //   // {title: 'Second Post', content: 'This is second post content'},
  //   // {title: 'Third Post', content: 'This is third post content'}
  // ]
  category: string;
  posts: Post[] =[];
  subscription = new Subscription();
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 6;
  currentPage=1;
  pageSizeOptions = [1,2,4,5];
  isAdmin = false;
  indexlength;

  userIsAuthenticated=false;

  private authStatusSub: Subscription;

  constructor(public postService: PostService, private authService:AuthService ) {

  }
  ngOnInit() {
  this.isAdmin = this.authService.getAdmin();
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.isLoading = true;
    this.subscription = this.postService.getPostUpdateListener().subscribe({
      next: (postData: { posts: Post[], postCount: number }) => {
         this.isLoading = false;
        this.totalPosts = postData.postCount
        this.posts = postData.posts;
        console.log(this.posts.length)
        this.indexlength = this.posts.length;

         for (let k = 0; k < this.indexlength; k++) {


          for (let i = 0; i < this.posts[k].content.length; i++) {

            this.posts[k].content = this.posts[k].content.substring(0, 250);
          }

        }

      },
      complete: () => {

          console.log("WTF")
        for (let k = 0; k < this.indexlength; k++) {


          for (let i = 0; i < this.posts[k].content.length; i++) {
            console.log(this.posts)
            this.posts[k].content = this.posts[k].content.substring(0, 50);
          }

        }
      }, error:()=>{console.log("?")}
    });
    this.authStatusSub=this.authService.getAuthStatusListener().subscribe(isAuthenticated=>{
      this.userIsAuthenticated =isAuthenticated;
    });
    this.postService.categorySwitch.subscribe(data => {
      console.log(data.category)
      this.category = data.category;
   })
   this.postService.quantityCart.subscribe(items => {
      if (items.item!=undefined) {

        console.log("quantity", items.item);
      }
    })
  }

  ngOnDestroy(){

    this.subscription.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex +1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }
  onDelete(id:string){
    this.postService.deletePost(id).subscribe(()=>{
      this.postService.getPosts(this.postsPerPage, this.currentPage)
    });
  }
  ChangeCategory(event) {
    console.log('?');
    console.log(event)
    this.category = event.category;
  }
}
