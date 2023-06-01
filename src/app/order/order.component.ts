import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthService } from '../auth/auth.service';
import { PostService } from '../posts/post.service';
import { PageEvent } from '@angular/material/paginator';


enum Process {
  ORDERED = 'ordered',
  INPROCESS = 'process',
  FINISHED = 'finished',
  DENIED = 'denied'

  }
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

   totalPosts = 15;
  ordersPerPage = 5;
  currentPage=1;
  pageSizeOptions = [5,10,15];
  posts: any;
  users: any;
  isAdmin = false;
  data: any;
  process = '';
  code = '';
  processStatus = ['process', 'finished', 'denied', 'All'];
  doubleProcessStatus = ['В процесі', 'Виконані', 'Відхилені', 'Всі']
  statusProcess = '';
  selected="Всі"

  private authListenerSubs: Subscription;
  private authListenerSubsAdmin: Subscription;
  constructor(public postService: PostService, private authService: AuthService) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.getAuthStatusAdmin();



    this.authListenerSubsAdmin = this.authService.getAuthStatusAdminListener().subscribe(isAdmin => {
      this.isAdmin = isAdmin // true

    })
    this.postService.getOrder(this.ordersPerPage, this.currentPage);

    this.postService.getOrderUpdateListener().subscribe((data => {

         this.posts = data.orders;
      this.data = data.orders.date;
      this.users = data.orders.users;
      this.code = data.orders.code;
      this.totalPosts=data.ordersCount
     }))

  }

  onProcess(id) {
    this.postService.changeOrderStatus(id, Process.INPROCESS,{ordersPerPage : 10, currentPage:1})
  }
  onComplete(id) {
    this.postService.changeOrderStatus(id, Process.FINISHED, {ordersPerPage : 10, currentPage:1})
  }
  onDeny(id) {
    this.postService.changeOrderStatus(id, Process.DENIED, {ordersPerPage : 10, currentPage:1})

  }
    onChangedPage(pageData: PageEvent){
    //this.isLoading = true;
    this.currentPage = pageData.pageIndex +1;
    this.ordersPerPage = pageData.pageSize;
    this.postService.getOrder(this.ordersPerPage, this.currentPage);
    }
  setCategory(status) {
    switch (status) {
      case this.doubleProcessStatus[0]: this.statusProcess = this.processStatus[0]; break;
      case this.doubleProcessStatus[1]: this.statusProcess =this.processStatus[1]; break;
      case this.doubleProcessStatus[2]: this.statusProcess = this.processStatus[2]; break;
      case this.doubleProcessStatus[3]: this.statusProcess = this.processStatus[3]; break;

    }
    console.log(this.statusProcess);
  }
}
