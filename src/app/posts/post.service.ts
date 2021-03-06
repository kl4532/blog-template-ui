import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from 'angularfire2/firestore';
import { Post } from './post';
import {map} from 'rxjs/operators';
import {AngularFireStorage} from 'angularfire2/storage';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  postCollection: AngularFirestoreCollection<Post>;
  postDoc: AngularFirestoreDocument<Post>;

  constructor(private afs: AngularFirestore,
              private storage: AngularFireStorage) {
    this.postCollection = this.afs.collection('posts', ref =>
    ref.orderBy('published', 'desc'));
  }

  getPosts() {
    return this.postCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Post;
        const id = a.payload.doc.id;
        return { id, ...data};
      });
    }));
  }

  getPostData(id: string) {
    this.postDoc = this.afs.doc<Post>(`posts/${id}`);
    return this.postDoc.valueChanges();
  }

  create(data: Post) {
    this.postCollection.add(data);
  }

  delete(id: string) {
    // remove imgs from datastorage
     this.getPostData(id).subscribe(post => {
        post.imagesName.forEach(img => {
            const pic = this.storage.ref('').child('posts/' + img);
            pic.delete();
        });
        console.log('done');
     });
     return this.postCollection.doc(id).delete();
  }

  update(id: string, formData) {
    return this.postCollection.doc(id).update(formData);
  }
}
