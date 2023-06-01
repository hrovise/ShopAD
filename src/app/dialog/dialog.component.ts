import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PostService } from '../posts/post.service';
import { ConfirmdialogComponent } from '../confirmdialog/confirmdialog.component';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  text = '';
  title = '';

  constructor(private dialog:MatDialog,private postService: PostService) { }

  ngOnInit(): void {
  }

  onSend() {
    if (this.text != '') {

      this.postService.SendConsult(this.text, this.title);



  let dialogRef=    this.dialog.open(ConfirmdialogComponent, {
       width: "200px",
       height:"140px"
  })

   }
  }


}
