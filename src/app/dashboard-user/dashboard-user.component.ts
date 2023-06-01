import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup } from '@angular/forms';
import { PostService } from '../posts/post.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard-user',
  templateUrl: './dashboard-user.component.html',
  styleUrls: ['./dashboard-user.component.css']
})
export class DashboardUserComponent implements OnInit {

  form: FormGroup;
  user = {

    email: '',
    name:'',
    nameCompany: '',
    contacts:0
     };
 login: string;
  password: string;
  email: string;
  name: string;
  nameCompany: string;
  contacts: number;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
   // this.postService.autoAuthUser();
   // this.onSave();
    this.authService.autoAuthUser();

    this.authService.getUserData();
    this.authService.getUpdatedUser().subscribe(res => {
      this.user = res;

       this.form.setValue({
        // login: res.login,
        // name: res.name,
        email: res.email,
        name:res.name,
        nameCompany: res.nameCompany,
         contacts: res.contacts
         })

    })

    // this.onSave().subscribe(res => {
    //   console.log(this.user)
    //   this.user = {
    //     email: res.email,
    //      name:res.name,
    //      nameCompany: res.nameCompany,
    //      contacts: res.contacts
    //     //  login: res.login,
    //     //  name : res.name
    //   }

    //   this.form.setValue({
    //     // login: res.login,
    //     // name: res.name,
    //     email: res.email,
    //     name:res.name,
    //     nameCompany: res.nameCompany,
    //     contacts: res.contacts

    //    })


    // });;


    // setTimeout(() => {
    //   console.log('s', this.user);

    // },2000)


    this.form = new FormGroup({
      // login: new FormControl(null),

      email: new FormControl(null),
       name: new FormControl(null),
       nameCompany: new FormControl(null),
       contacts: new FormControl(null)
      // category: new FormControl(null, { validators: [Validators.required]
      // }),
      // title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]
      // }),
      //  price: new FormControl(null, {validators: [Validators.required, Validators.pattern("^[0-9]*$")]
      // }),
      // content:  new FormControl(null, {validators: [Validators.required, Validators.minLength(5)]
      // }),
      // contentLarge: new FormControl(null, {validators: [Validators.required, Validators.minLength(5)]
      // }),
      // image: new FormControl(null, {validators:[Validators.required], asyncValidators:[mimeType]})
    })


  }

  //мы из токена берем айдишку или логин. Отправляем запрос на сервер и получаем данные. И размещаем их в поля. Затем мы можем эти поля изменять или добавлять новые
  //и отправляем на сервер(типа изменение емейла, имени и пароля.) Пока только три поля. Пароль нужно ввести старый и дважды повторить новый, ддля все остального
  //только единожды повтор пароля
  // onSave() {
  //   this.postService.getUserData().subscribe(res => {
  //     this.user = {
  //       email: res.email,
  //       login: res.login,
  //       name : res.name
  //     }

  //     this.form.setValue({
  //       login: res.login,
  //       name: res.name,
  //       email: res.email

  //      })


  //   });


  // }
  //  onUpdateUser(){
  //       this.postService.updateUserData(this.form.value.email, this.user.login, this.form.value.name);
  //   }
// onSave() {
// return  this.authService.getUserData()


//   }
  onUpdateUser() {

     this.authService.updateUserData(this.form.value.name, this.form.value.nameCompany, this.form.value.contacts);

    //  this.onSave().subscribe(res => {

    //   this.user = {
    //     email: res.email,
    //      name:res.name,
    //      nameCompany: res.nameCompany,
    //      contacts: res.contacts
    //     //  login: res.login,
    //     //  name : res.name
    //   }

    //   this.form.setValue({
    //     // login: res.login,
    //     // name: res.name,
    //     email: res.email,
    //     name:res.name,
    //     nameCompany: res.nameCompany,
    //     contacts: res.contacts

    //    })


    // });;


    }
}


