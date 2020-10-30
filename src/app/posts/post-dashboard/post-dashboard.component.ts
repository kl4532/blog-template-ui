import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../core/auth.service';
import {PostService} from '../post.service';
import {Observable} from 'rxjs';
import { AngularFireStorage } from 'angularfire2/storage';
import {finalize} from 'rxjs/operators';
import { NgxDropzoneModule } from 'ngx-dropzone';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-post-dashboard',
  templateUrl: './post-dashboard.component.html',
  styleUrls: ['./post-dashboard.component.scss']
})
export class PostDashboardComponent implements OnInit {

  title: string;
  imagesUrl: string[] = [];
  content: string;

  buttonText: string = 'Create Post';
  uploadPercent: Observable<number>;
  uploadFinished: boolean = true;
  downloadURL: Observable<string>;

  files: File[] = [];

  constructor(private authService: AuthService,
              private postService: PostService,
              private storage: AngularFireStorage,
              private http: HttpClient) { }

  ngOnInit(): void {
  }

  createPost() {
    const data = {
      author: this.authService.authState.displayName || this.authService.authState.email,
      authorId: this.authService.currentUserId,
      content: this.content,
      imagesUrl: this.imagesUrl,
      published: new Date(),
      title: this.title
    };
    console.log('data', data);

    this.postService.create(data);
    this.title = '';
    this.content = '';


    this.buttonText = 'Post Created';
    setTimeout((() => this.buttonText = 'Create post'), 2000);

  }

  // Upload each image just after adding

  uploadImage(file: File, index: number) {

    const path = `posts/${file.name}`;
    const task = this.storage.upload(path, file);
    const ref = this.storage.ref(path);
    this.uploadPercent = task.percentageChanges();
    task.percentageChanges().subscribe(res => res === 100 ? this.uploadFinished = true : this.uploadFinished = false);
    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = ref.getDownloadURL();
        this.downloadURL.subscribe(url => {
          this.imagesUrl[index] = url;
        });
      })
    ).subscribe();
  }

  onAddPhoto(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
    for (let i = 0; i < this.files.length; i++) {
      this.uploadImage(this.files[i], i);
    }
  }

  onRemove(event) {
      this.files.splice(this.files.indexOf(event), 1);
      this.imagesUrl.splice(this.imagesUrl.indexOf(event), 1);
  }

}
