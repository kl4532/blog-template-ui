import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {PostService} from '../post.service';
import {Post} from '../post';
import {AuthService} from '../../core/auth.service';
import {ConfirmDialogComponent, ConfirmDialogModel} from '../../shared/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  posts: Observable<Post[]>;
  constructor(
    private postService: PostService,
    public auth: AuthService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.posts =  this.postService.getPosts();
    console.log(this);
  }

  delete(id: string) {
    this.postService.delete(id);
  }

  openDialog(id) {
    const dialogData = new ConfirmDialogModel('Delete post', 'Are you sure you want to delete?');
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {data: dialogData});

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.delete(id);
      }
    });
  }

}
