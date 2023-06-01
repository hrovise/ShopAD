import { EventEmitter, Injectable } from "@angular/core";
import { Post,Category} from "./post.model";
import {Subject, Observable, map, tap} from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { stringify } from "querystring";
import { Router } from "@angular/router";
import { CartComponent } from "./cart/cart.component";
import { Cart } from './cart/cart.component';
 const LINKLOCAL= "http://localhost:3000";
 const LINKLOCAL2="https://shopb-production.up.railway.app"

interface Order{

 }
@Injectable({ providedIn: 'root' })
export class PostService {

  private categories: Category[]=[];
  private categoriesUpdated = new Subject<{ categories: Category[] }>();
  private changeOrderStatusEmitter = new Subject <{process: string}>();
  private posts: Post[] = [];
  private orders: any;
  private comments: [] = [];
  private cartUpdateLength = new Subject<{number:number}>();
  private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();
  private ordersUpdated = new Subject<{orders:any, ordersCount:number }>();
  private commentsUpdated = new Subject<{ comments:[] }>();
  categorySwitch = new EventEmitter<{ category: string }>();
  quantityCart = new EventEmitter<{ item: number }>();


constructor(private http: HttpClient, private router: Router) {

}
  getPosts(postsPerPage: number, currentPage: number){
    const qureyParams = `?pagesize=${postsPerPage}&&page=${currentPage}`;
    this.http.get<{message:string, posts:any, maxPosts: number}>(`${LINKLOCAL}/api/posts`+ qureyParams)
      .pipe(map((postData) => {

        return { posts: postData.posts.map(post=>{
          return {
            category: post.category,
            title: post.title,
            price: post.price,
            content: post.content,
            contentLarge: post.contentLarge,
            quantity: post.quantity,
            id: post._id,
            imagePath: post.imagePath
          }
        }), maxPosts: postData.maxPosts}
    }))

      .subscribe((transformedPostData) => {
      // console.log(transformedPostData.posts.quantity)
      this.posts=transformedPostData.posts;
      this.postsUpdated.next({posts: [...this.posts], postCount: transformedPostData.maxPosts});
    });
  }

  getCartNumber() {
    return this.cartUpdateLength.asObservable();
  }
  getPost(id:String){

    return this.http.get<{
      _id: string,
      category: string, title: string,
      price: number, content: string,
      contentLarge: string,
      quantity: number[],
      imagePath: string
    }>(`${LINKLOCAL}/api/posts/` + id);
    // return {...this.posts.find(p=> p.id===id)}
  }

  getOrderUpdateListener() {
    return this.ordersUpdated.asObservable();
  }
  getStatusOrderListener() {
    return this.changeOrderStatusEmitter.asObservable();
  }
  getCategoriesListener() {
    return this.categoriesUpdated.asObservable();
  }
  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }
  getCommentUpdateListener(){
    return this.commentsUpdated.asObservable();
  }
  addPost(category: string, title: string, price: number, content: string, contentLarge: string,  image: File){
    const postData = new FormData();
    const quant = [25, 200, 1000]
    const quantity = quant.toString();


    const priceAppend = price.toString();
    postData.append("category", category);
    postData.append("title", title);
    postData.append("price", priceAppend);
    postData.append("content", content);
    postData.append("contentLarge", contentLarge);
    postData.append("quantity", quantity);
    postData.append("image", image, title);

    // const post:Post = {id: null,title: title, content: content};
    this.http.post<{message: string, post: Post}>(`${LINKLOCAL}/api/posts`, postData)
    .subscribe((responseData )=>{
      // const post: Post = {id: responseData.post.id, title: title, content: content, imagePath: responseData.post.imagePath};
      // const id = responseData.post.id;
      // post.id = id;
      // this.posts.push(post);
      // this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    })

  }

  updatePost(id: string, category:string, title: string, price: number, content: string, contentLarge: string,  image: File | string){
    let postData: Post | FormData;
    const quant = [25, 200, 1000];
   const quantity = [25, 200, 1000].toString();
    const priceAppend = price.toString();
    if( typeof(image) === 'object'){
      postData = new FormData();
      postData.append("id", id);
       postData.append("category", category);
      postData.append("title", title);
       postData.append("price",priceAppend);
      postData.append("content", content);
      postData.append("contentLarge", contentLarge);
        postData.append("quantity", quantity)
      postData.append("image", image, title);
    }
    else{
      postData = {id: id, category: category, title: title, price: price, content: content, contentLarge: contentLarge, quantity: quant, imagePath: image};
    }

    this.http.put(`${LINKLOCAL}/api/posts/`+ id, postData)
    .subscribe((response)=>{
      // const updatedPosts = [...this.posts];
      // const oldPostIndex = updatedPosts.findIndex(p=> p.id ===id);
      // const post: Post ={id: id, title: title, content: content, imagePath: ""}
      // updatedPosts[oldPostIndex]= post;
      // this.posts = updatedPosts;
      // this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    })
  }


  deletePost(postId:string){
  return  this.http.delete(`${LINKLOCAL}/api/posts/`+ postId)
    // .subscribe(()=>{
    //   const updatedPosts = this.posts.filter(post=>post.id !==postId);//обновление постов, где айди не совпадает с удаленным
    //   this.posts = updatedPosts;
    //   this.postsUpdated.next([...this.posts])
    //   console.log('Deleted')
    // })
  }

 async addToCart(postId: string, quantity: string) {
   let dummy = "str";

   const object ={quantity: quantity}
   this.http.post(`${LINKLOCAL}/api/shop/cart/`+ postId, object)
     .subscribe((responseData) => {

      // const post: Post = {id: responseData.post.id, title: title, content: content, imagePath: responseData.post.imagePath};
      // const id = responseData.post.id;
      // post.id = id;
      // this.posts.push(post);
      // this.postsUpdated.next([...this.posts]);
      // this.router.navigate(["/cart"]);
       this.getCart().subscribe();
    })
  }
    onDeleteCartItem(id: string) {
 return  this.http.delete(`${LINKLOCAL}/api/shop/`+ id);


  }
  getCart() {

    return this.http.get<{ posts: any }>(`${LINKLOCAL}/api/shop/cart`)
      .pipe(map((cart) => {
        // console.log(cart)

        return {
          posts: cart.posts.map(last => {

            return {
              category: last.postId.category,
              title: last.postId.title,
              price: last.postId.price,
              id: last._id,
              quantity: last.quantity,
              imagePath: last.imagePath

            }
          })
        }
      }
      )) .pipe(tap((posts) => {
        this.quantityCart.emit(posts.posts.length)

      }));

  }

  // getAdmit() {
  //   return this.http.post<{ admin: boolean }>('http://localhost:3000/api/shop/cart')
  // }
 createOrder(code) {

   const body = {
     code: code,
    date: new Date()
   }

    // const post:Post = {id: null,title: title, content: content};
    this.http.post(`${LINKLOCAL}/api/shop/order`, body)
      .subscribe((response) => {
        // const post: Post = {id: responseData.post.id, title: title, content: content, imagePath: responseData.post.imagePath};
        // const id = responseData.post.id;
        // post.id = id;
        // this.posts.push(post);
        // this.postsUpdated.next([...this.posts]);
        //this.router.navigate(["/"]);
        this.cartUpdateLength.next({ number:0});
        this.router.navigate(['/order']);

      })
  }

  getOrder(postsPerPage:number, currentPage:number) {

const queryParams = `?pagesize=${postsPerPage}&&page=${currentPage}`;

    // const post:Post = {id: null,title: title, content: content};
 return this.http.get<{orders: any, users: any, date: any, process:any, id:any, maxOrders:number }>(`${LINKLOCAL}/api/shop/orders` + queryParams)
    .pipe(map((response) => {

      // const post: Post = {id: responseData.post.id, title: title, content: content, imagePath: responseData.post.imagePath};
      // const id = responseData.post.id;
      // post.id = id;
      // this.posts.push(post);
      // this.postsUpdated.next([...this.posts]);
      //this.router.navigate(["/"]);

      return {
        orders: response.orders.map(i => {

          return {
            date: i.date,
            orders: i.posts,
            users: i.user,
            process: i.process,
            id: i._id,
            code: i.code
          }

        }), maxOrders: response.maxOrders

      }
    }))
   .subscribe((transformedPostData) => {
      // console.log(transformedPostData.posts.quantity)
      this.orders=transformedPostData.orders;
      this.ordersUpdated.next({orders: [...this.orders], ordersCount:transformedPostData.maxOrders});
    });;
  }
  deleteCategory(event) {
    const obj = { category: event };


    return this.http.post(`${LINKLOCAL}/api/posts/category`, obj)
      .pipe(tap(()=>{
        this.getCategories();
    }))


  }
  getCategories() {
    return this.http.get<{ category: any }>(`${LINKLOCAL}/api/posts/categories`)
      .pipe(map(response => {


        return {
          category: response.category.map(category => {

            return {
              value: category.category,
              title: category.category
            }
        }) }
        // for (const cat of response.category) {
        //   console.log('response',cat.category)
        //   category.push({
        //     value: cat.category,
        //     title: cat.category
        //   })
        //   return category;
        // }



      }))
      .subscribe(transformed => {

        this.categories=transformed.category;
      this.categoriesUpdated.next({categories:[...transformed.category]});

    })
  }
  addCategory(categoryName) {
    let body = {category: categoryName}
     this.http.post(`${LINKLOCAL}/api/posts/categoryC`, body)
    .subscribe(()=>{
      // const post: Post = {id: responseData.post.id, title: title, content: content, imagePath: responseData.post.imagePath};
      // const id = responseData.post.id;
      // post.id = id;
      // this.posts.push(post);
      // this.postsUpdated.next([...this.posts]);
      this.getCategories();
    })
  }

  addComment(content, id) {
    const body = {
      content: content,
      id: id,
    date: new Date()};
    this.http.post(`${LINKLOCAL}/api/posts/comment`, body)
      .subscribe(result => {
        this.showComment(id)
  //         .subscribe(result => {
  //    console.log('we are in add')
  //    this.comments = result;
  //  });;
         this.router.navigate(['/detail/', id]);


    })
  }

   showComment( id) {
    const body = {

       id: id
     };

   this.http.get < { comments: []}>(`${LINKLOCAL}/api/posts/comments/${id}`)
      .pipe((map(result => {


        return result.comments;
      })))
    .subscribe(transformed => {

        this.comments = transformed;

        this.commentsUpdated.next({ comments: [...transformed] });
    });

  }

  SendConsult(text,title) {
    const obj = { text: text, title: title };
    this.http.post(`${LINKLOCAL}/api/posts/send`, obj).subscribe(res => { if (res) console.log("succcess") })
  }

  async changeOrderStatus(id, process, pages ) {
   let perPage = pages.ordersPerPage;
  let  currentPage = pages.currentPage;
    const obj = {
      id: id,
      process: process
    }
    // this.changeOrderStatusEmitter.next({ process: process });
    // console.log(process);

    this.http.post(`${LINKLOCAL}/api/shop/orderstatus`, obj).subscribe(() => {
      this.getOrder(perPage, currentPage);

    }
    )
  }

  deleteComment(id, idPost) {
    const obj = {
      id:id
    }
    this.http.post(`${LINKLOCAL}/api/posts/commentdelete`, obj).subscribe(res => {

      this.showComment(idPost)
    })
  }
}

