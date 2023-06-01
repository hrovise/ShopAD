


import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, NgForm , Validators} from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { map, Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { Post, Category } from "../post.model";
import { PostService } from "../post.service";
import { mimeType } from "./mime-type.validator";

@Component({
  selector: 'app-post-admin',
  templateUrl: './post-admin.component.html',
  styleUrls: ['./post-admin.component.css']
})

export class PostAdminComponent implements OnInit {
  photo = '';
  newPost = "No content";
  enteredTitle="";
  enteredContent="";
  private mode = "create";
  private postId: string;
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  isAdmin: boolean
  category: Category[];
  subscription = new Subscription();
  // category = [{ value: 'PS', title: 'супер' }, { value: 'SL', title: 'пласт' }]

  categoryEvent = new EventEmitter<string>();

  constructor(public authService:AuthService, public postService:PostService, public route: ActivatedRoute){

  }

  ngOnInit(): void {

    this.postService.getCategories()
    this.subscription = this.postService.getCategoriesListener().subscribe((data: {categories: Category[]}) => {


      this.category = data.categories;


    })

    this.isAdmin = this.authService.getAdmin();
    this.form = new FormGroup({
      category: new FormControl(null, { validators: [Validators.required]
      }),
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]
      }),
       price: new FormControl(null, {validators: [Validators.required, Validators.pattern("^[0-9]*$")]
      }),
      content:  new FormControl(null, {validators: [Validators.required, Validators.minLength(5)]
      }),
      contentLarge: new FormControl(null, {validators: [Validators.required, Validators.minLength(5)]
      }),
      image: new FormControl(null, {validators:[Validators.required], asyncValidators:[mimeType]})
    })
    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
        if(paramMap.has("postId")){
            this.mode="edit";

            this.postId = paramMap.get("postId");

            this.isLoading = true;
           this.postService.getPost(this.postId).subscribe(postData =>{
            this.isLoading = false;

             this.post = {
               id: postData._id,
              category: postData.category,
               title: postData.title,
               price: postData.price,
               content: postData.content,
               contentLarge: postData.contentLarge,
               quantity: postData.quantity,
               imagePath: postData.imagePath}

             this.form.setValue({
                  category:this.post.category,
               title: this.post.title,
                price: this.post.price,
               content: this.post.content,
               contentLarge: postData.contentLarge,
                  quantity: postData.quantity,
                image: this.post.imagePath
              });

            });


        }
        else {
          this.mode = 'create';
          this.postId =null;
        }
    }
    );
  }

  onSave(){

    if(!this.form.valid) return;
    this.isLoading=true;

  if(this.mode ==='create'){


    this.postService.addPost(this.form.value.category,
      this.form.value.title,
      this.form.value.price,
      this.form.value.content,
      this.form.value.contentLarge,
      this.form.value.image);

  } else {

    this.postService.updatePost(this.postId,
      this.form.value.category,
      this.form.value.title,
      this.form.value.price,
      this.form.value.content,
      this.form.value.contentLarge,
      this.form.value.image);


}
this.form.reset();
  }

 onImagePicked(event:Event){
    const file = (event.target as HTMLInputElement).files[0];//aray файлов, но берем только первый, который выбрал юзер
     this.form.patchValue({image: file});
     this.form.get('image').updateValueAndValidity();
     const reader = new FileReader();

   reader.readAsDataURL(file);
   reader.onload= ()=> {
    this.imagePreview = reader.result as string;
   // console.log(this.imagePreview);
   };


    //  console.log(file);
    //  console.log(this.form);
  }
 removeCategory(selected_category) {
    let categoryName = selected_category.value

    this.postService.deleteCategory(categoryName).subscribe()
  //  setTimeout(() => {
  //        this.postService.getCategories();
  //     },3000)



  }
  addCategory(category_title) {

    this.postService.addCategory(category_title);
  }
  onSelect(event) {

    let categoryName = event.value

    this.categoryEvent.emit(categoryName);
  }
}
