import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../core/auth.service';
import {PostService} from '../post.service';
import {Observable} from 'rxjs';
import { AngularFireStorage } from 'angularfire2/storage';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-post-dashboard',
  templateUrl: './post-dashboard.component.html',
  styleUrls: ['./post-dashboard.component.scss']
})
export class PostDashboardComponent implements OnInit {

  title: string;
  image: string = null;
  content: string;

  buttonText: string = 'Create Post';
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;

  constructor(private authService: AuthService,
              private postService: PostService,
              private storage: AngularFireStorage) { }

  ngOnInit(): void {
  }

  createPost() {
    const data = {
      author: this.authService.authState.displayName || this.authService.authState.email,
      authorId: this.authService.currentUserId,
      content: this.content,
      image: this.image,
      published: new Date(),
      title: this.title
    };
    this.postService.create(data);
    this.title = '';
    this.content = '';

    this.buttonText = 'Post Created';
    setTimeout((() => this.buttonText = 'Create post'), 2000);
  }

  uploadImage(event) {
    const file = event.target.files[0];
    const path = `posts/${file.name}`;
    if (file.type.split('/')[0] !== 'image') {
      alert('Only text');
    } else {
      const task = this.storage.upload(path, file);
      const ref = this.storage.ref(path);
      this.uploadPercent = task.percentageChanges();
      console.log('Image uploaded');
      task.snapshotChanges().pipe(
        finalize(() => {
          this.downloadURL = ref.getDownloadURL();
          this.downloadURL.subscribe(url => this.image = url);
        })
      ).subscribe();
    }
  }

}
