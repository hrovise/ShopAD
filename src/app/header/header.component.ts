import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { Subscription } from "rxjs";

import { AuthService } from "../auth/auth.service";
import { Category } from "../posts/post.model";
import { PostService } from "../posts/post.service";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {
  default:string = 'Категорії';
  category: Category[];
   collapsed = false;
  categoryHeader = '';
 // @Output() categorySwitch = new EventEmitter<{category: string}>();
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
   private authListenerSubsAdmin: Subscription;
  isAdmin = false;
  quantityCartItems:any=0;

  constructor(private authService:AuthService, private postService: PostService){}

  ngOnInit(): void {
    this.postService.getCategories();
    this.postService.getCategoriesListener().subscribe(category => {
      this.category = category.categories;
    })
    this.isAdmin = this.authService.getAuthStatusAdmin();

    this.userIsAuthenticated = this.authService.getAuthStatus();

    this.authListenerSubsAdmin =this.authService.getAuthStatusAdminListener().subscribe(isAdmin=>{
      this.isAdmin = isAdmin // true

    })

    this.authListenerSubs= this.authService.getAuthStatusListener().subscribe(isAuthenticated=>{
        this.userIsAuthenticated = isAuthenticated // true
    })
    this.postService.quantityCart.subscribe(items => {



          this.quantityCartItems = items;



    })
     this.postService.getCartNumber().subscribe(res => this.quantityCartItems = res.number);
     this.postService.getCart().subscribe((data => {
       if (data) {
         this.quantityCartItems = data.posts.length;

       }
     }));

    this.postService.categorySwitch.subscribe(name => {
      this.default = name.category;
    }
    )
  }

  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }
  // categoryShowUp(event: Event) {
  //   // console.log(event)
  //   // console.log((<HTMLInputElement>event.target).value);
  //   let CategoryEmitted = (<HTMLInputElement>event.target).value;

  //   this.postService.categorySwitch.emit({ category: CategoryEmitted });

  // }
  categoryShowUp(category: string, chosen) {
    // console.log(event)
    // console.log((<HTMLInputElement>event.target).value);
    //let CategoryEmitted = (<HTMLInputElement>event.target).value;


    this.postService.categorySwitch.emit({ category: category });
    if (category == 'Категорії') {
      chosen.value = 'Категорії'

    }


  }
}
