import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PostService} from '../post.service';
import {Post} from '../post';
import {AuthService} from '../../core/auth.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent, ConfirmDialogModel} from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {
  post: Post;
  editing: boolean = false;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private postService: PostService,
              public auth: AuthService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getPost();
  }

  getPost() {
    const id = this.route.snapshot.paramMap.get('id');
    return this.postService.getPostData(id).subscribe(data => this.post = data);
  }

  delete() {
    const id = this.route.snapshot.paramMap.get('id');
    this.postService.delete(id);
    this.router.navigate(['/blog']);
  }
  openDialog() {
    const dialogData = new ConfirmDialogModel('Delete post', 'Are you sure you want to delete?');
    const dialogRef = this.dialog.open(ConfirmDialogComponent  , {data: dialogData});

    dialogRef.afterClosed().subscribe(dialogResult => {
      if( dialogResult) {
        this.delete();
      }
    });
  }


}
