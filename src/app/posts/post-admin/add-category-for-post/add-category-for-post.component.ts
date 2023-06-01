import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, NgForm , Validators} from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { map, Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { Post, Category } from "../../post.model";
import { PostService } from "../../post.service";
import { mimeType } from "../mime-type.validator";
@Component({
  selector: 'app-add-category-for-post',
  templateUrl: './add-category-for-post.component.html',
  styleUrls: ['./add-category-for-post.component.css']
})
export class AddCategoryForPostComponent implements OnInit {

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
  addedCategory = false;
  categorytext=''
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

    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
        if(paramMap.has("postId")){
            this.mode="edit";

            this.postId = paramMap.get("postId");

            this.isLoading = true;
           this.postService.getPost(this.postId).subscribe(postData =>{
            this.isLoading = false;
            console.log(postData)
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




    //  console.log(file);

 removeCategory(selected_category) {
    let categoryName = selected_category.value
    console.log(selected_category.value)
    this.postService.deleteCategory(categoryName).subscribe(data =>
     console.log(data))
  //  setTimeout(() => {
  //        this.postService.getCategories();
  //     },3000)



  }
  addCategory(category_title) {
  console.log(category_title)
    this.postService.addCategory(category_title);
    this.addedCategory = true;
    setTimeout(() => {
      this.addedCategory = false;
      this.categorytext = '';
    },2000)
  }
  onSelect(event) {
    console.log(event);
    let categoryName = event.value
    // console.log((<HTMLInputElement>event.target).value);
    // let categoryName = (<HTMLInputElement>event.target).value;
    // console.log('category', categoryName)
    this.categoryEvent.emit(categoryName);
  }
}
