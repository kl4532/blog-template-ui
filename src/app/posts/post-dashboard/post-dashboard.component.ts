import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from '../../core/auth.service';
import {PostService} from '../post.service';
import {Observable} from 'rxjs';
import { AngularFireStorage } from 'angularfire2/storage';
import {finalize} from 'rxjs/operators';
import { NgxDropzoneModule } from 'ngx-dropzone';
import {HttpClient} from '@angular/common/http';
import {Post} from '../post';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

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

  modeTitle: string = 'Create post';
  @Input() editMode: boolean = false;
  @Input() post: Post;
  @Output() editFinished: EventEmitter<boolean> = new EventEmitter<boolean>();
  newImagesUrl: string[] = [];


  files: File[] = [];

  constructor(private authService: AuthService,
              private postService: PostService,
              private storage: AngularFireStorage,
              private http: HttpClient,
              private route: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if (this.editMode) {
        console.log('post', this.post);
        this.modeTitle = 'Edit post';
        this.fetchPostData();
    };
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
    this.postService.create(data);
    this.title = '';
    this.content = '';
    this.files = [];
    this.imagesUrl = [];

    this.snackBar.open('Post created', 'Ok', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
    setTimeout(() => this.router.navigate(['/blog']),1000);
  }

  fetchPostData() {
    this.title = this.post.title;
    this.content = this.post.content;
    this.imagesUrl = this.post.imagesUrl;
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
    this.files.push(...event.addedFiles);
    for (let i = 0; i < this.files.length; i++) {
      this.uploadImage(this.files[i], i + this.imagesUrl.length);
    }
    if (this.editMode) {this.files = []; }
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
    this.imagesUrl.splice(this.imagesUrl.indexOf(event), 1);
  }

  updatePost() {
    const formData = {
      title: this.title,
      content: this.content,
      imagesUrl: this.imagesUrl,
    };
    const id = this.route.snapshot.paramMap.get('id');
    this.postService.update(id, formData);

    this.snackBar.open('Post updated', 'Ok', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
    setTimeout(() => this.editFinished.emit(true),1000);
  }

}
