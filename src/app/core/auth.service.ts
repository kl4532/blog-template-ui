import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {map} from 'rxjs/operators';
import {Post} from '../posts/post';
import {AngularFirestore,   AngularFirestoreCollection,
  AngularFirestoreDocument} from 'angularfire2/firestore';
import {Admin} from './admin';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  adminsCollection: AngularFirestoreCollection<Admin>;
  authState: any = null;

  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.afAuth.authState.subscribe(data => this.authState = data);
    this.adminsCollection = this.afs.collection('admins', ref => ref);
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  get currentUserEmail(): string {
    return this.authenticated ? this.authState.email : null;
  }

  getAdmins() {
    return this.adminsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Admin;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  isAdmin() {
    return this.getAdmins().pipe(map(admins => {
      const res = admins.find( admin => admin['email'] === this.currentUserEmail);
      return res === undefined ? false : true;
    }));
  }

  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : null;
  }

  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}
