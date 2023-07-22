import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  arrayUnion,
} from 'firebase/firestore/lite';
import { User, getAuth } from 'firebase/auth';
import { Injectable } from '@angular/core';
import { from, of, switchMap } from 'rxjs';
import { Chapter } from '@game/data-access/code-editor-data';

@Injectable()
export class FirebaseUserService {
  getUser() {
    if (!getAuth()) return of(null);
    if (!getAuth().currentUser) return of(null);
    return of(getAuth().currentUser);
  }

  checkUserExists(user: User) {
    const db = getFirestore();
    return from(getDoc(doc(db, 'users', user.uid))).pipe(
      switchMap(docSnapshot => (docSnapshot.exists() ? of(true) : of(false)))
    );
  }

  createUser(user: User) {
    const db = getFirestore();
    return from(
      setDoc(doc(db, 'users', user.uid), {
        name: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
        emailVerified: user.emailVerified,
        uid: user.uid,
        courses: [],
      })
    );
  }
}
