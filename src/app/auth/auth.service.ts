import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { map, of, Subject } from "rxjs";
import { AuthData, Role } from "./auth.data.model";


 const LINKLOCAL= "http://localhost:3000";
const LINKLOCAL2 = "https://shopb-production.up.railway.app"

@Injectable({ providedIn: "root"

})
export class AuthService {


  userRoleUpdate = new Subject<string>();
  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: NodeJS.Timer;
   private isAdmin= false;
  private authStatusAdminListener = new Subject<boolean>();
  private FailedLogin = new Subject<boolean>();
  private updatedUser = new Subject<AuthData>();

  constructor(private http:HttpClient, private router: Router){

  }


  getUpdatedUser() {
    return this.updatedUser.asObservable();
  }
  getFailedLogin() {
    return this.FailedLogin.asObservable();
  }
  getToken() {
    return this.token;
  }

  getAuthStatus(){
    return this.isAuthenticated;
  }

   getAuthStatusAdmin(){
    return this.isAdmin;
  }
  getAuthStatusAdminListener() {
      return this.authStatusAdminListener.asObservable();
   }
  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, name:string, nameCompany:string, city:string, contacts: number, password: string) {
    const authData: AuthData = {role: Role.user,email: email, name:name, nameCompany:nameCompany, city:city, contacts: contacts, password: password}
   return this.http.post < {message:string}>(`${LINKLOCAL}/api/user/signup`, authData)
    // .subscribe(response =>{
    //   let message = "User is exist";
    //   if(response.message==message)

    //  //this.login(email, password);
    //  this.router.navigate(['/']);
    // }
    // )
  }

  login(email:string, password: string){
    const object = {role: Role.user,email: email, password: password}
  return  this.http.post<{  token: string, expiresIn:number, role: string, message: string}>(`${LINKLOCAL}/api/user/login`, object)
    .subscribe(response => {

      const token = response.token;
      this.token = token;

      if (token) {
        const expiresInDuration = response.expiresIn;

        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated = true;



        if (response.role === Role.admin) {
          this.isAdmin = true;
          this.authStatusAdminListener.next(true);
        }
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);

        this.saveAuthData(token, expirationDate, this.isAdmin);
        this.router.navigate(['/']);


      }
      if(response.message=="Failed") {

        this.FailedLogin.next(false);

        // this.router.navigate(['/login', {failed: true}])
        //   .then(() => {
        //     window.location.reload();
        //   });
      }



    })
  }

 async autoAuthUser() {

    const authInformation = this.getAuthData();


    if(!authInformation){
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.getRole();

      this.setAuthTimer(expiresIn / 1000);
      if (this.isAdmin === true) {
        this.authStatusAdminListener.next(true);
        this.isAdmin = true;
      }
      this.authStatusListener.next(true);
    }
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.isAdmin = false;
     this.authStatusAdminListener.next(false);
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer (duration:number){

    this.tokenTimer=  setTimeout(()=>{
      this.logout();
    }, duration*1000)
  }
  //  private saveAuthData(token: string, expirationDate: Date) {

  //   localStorage.setItem('token', token);
  //   localStorage.setItem('expiration', expirationDate.toISOString());
  // }

  private saveAuthData(token: string, expirationDate: Date, isAdmin: boolean) {
    // if (this.isAdmin === true) {
    //   localStorage.setItem('user', isAdmin.toString())
    // }
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    // localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");

  }
  public getAdmin() {
    if (this.isAdmin== true)
      return true;

  }
   private getRole() {
    const body = {};
   return this.http.post<{ role: string }>(`${LINKLOCAL}/api/user/role`, body)
      .subscribe(result => {

        if (result.role == 'ADMIN') {
          this.isAdmin = true;

          this.authStatusAdminListener.next(true);
          return;
        }
        return;
    })
  }
  private getAuthData() {
  const token = localStorage.getItem("token");
       const expirationDate = localStorage.getItem("expiration");


    if(!token || !expirationDate)
    {return;}
    //const user = localStorage.getItem("user"); //boolean


      return {

      token:token,
      expirationDate: new Date(expirationDate)
    }
  }
findUser(email: string) {
    const object = {email:email}
  return  this.http.post<{ user: any }>(`${LINKLOCAL}/api/user/dashboard`, object)

  }


  grantRole(user: any) {

    this.http.post<{ role: string }>(`${LINKLOCAL}/api/user/dashboard-search`, user)
      .subscribe(response => {

         this.userRoleUpdate.next(response.role);

      })
  }

denyRole(user: any) {

    this.http.post<{ role: string }>(`${LINKLOCAL}/api/user/dashboard-search-user`, user)
      .subscribe(response => {

        this.userRoleUpdate.next(response.role);
      });
  }
  blockUser(user: any) {
    const obj = {
     email : user.email
    }

   return this.http.post<{ message: string }>(`${LINKLOCAL}/api/user/block`,obj);


  }
  unBlockUser(user: any) {
    const obj = {
     email : user.email
    }

   return this.http.post<{ message: string }>(`${LINKLOCAL}/api/user/unblock`,obj);


  }
    activate(id) {

      this.http.get(`${LINKLOCAL}/api/user/activate/user/${id}`).subscribe();
   }

  resetPassword(email) {
    const object = {email:email}
    return this.http.post < { message: any }>(`${LINKLOCAL}/api/user/reset`, object);
  }
  newPassword(password, hash) {
    const object = {password: password, hash: hash}
   return this.http.post<{message: any}>(`${LINKLOCAL}/api/user/resetpassword`, object);
  }
   getUserData() {

  return  this.http.get<{user:AuthData}>(`${LINKLOCAL}/api/user/getuser/`).subscribe(res=> {
    {

      this.updatedUser.next(res.user);
      return res.user;
      }
  })
  }
   updateUserData(name, nameCompany, contacts) {

    const user = {
      name:name,
      nameCompany: nameCompany,
      contacts: contacts
     }

     this.http.post(`${LINKLOCAL}/api/user/updateuser`, user).subscribe(res => {


       this.getUserData();
     });
  }
}
