import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';


import { Post } from '../post.model';
import { PostService } from '../post.service';

export interface Cart {
  id: string,
  quantity: number
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

@Injectable({providedIn: 'root'})
export class CartComponent implements OnInit {

  code = '';
  posts: [] = [];
  overAllPrice = 0;
  cart:any;
  subscription = new Subscription();
  constructor(private http: HttpClient, public route: ActivatedRoute, private router: Router, public postService: PostService) { }

  ngOnInit(): void {
    let postId;
     this.postService.getCart().subscribe((data => {
       this.cart = data;
       this.posts = this.cart.posts;

       for (let i = 0; i < this.cart.posts.length; i++){
         this.overAllPrice += this.cart.posts[i].quantity * this.cart.posts[i].price;

       }


     }));


  }

  onDelete(id: string) {

    this.postService.onDeleteCartItem(id).subscribe(res => {
      this.overAllPrice = 0;
      this.postService.getCart().subscribe(cart => {
        this.cart = cart;
        this.posts = this.cart.posts;
         for (let i = 0; i < this.cart.posts.length; i++){
         this.overAllPrice += this.cart.posts[i].quantity * this.cart.posts[i].price;

       }
       });



    });
  }
  putOrder(form) {
    if(form.invalid){
        return;
    }

    this.postService.createOrder(form.value);

  }

}
