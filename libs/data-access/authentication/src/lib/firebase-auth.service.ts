import {
  FirebaseApp,
  FirebaseOptions,
  getApp,
  initializeApp,
} from 'firebase/app';
import {
  Auth,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';
import { Inject, Injectable } from '@angular/core';
import { catchError, from, of } from 'rxjs';

@Injectable()
export class FirebaseAuthService {
  private auth: Auth | null = null;

  constructor(
    @Inject('FIREBASE_CONFIG') private firebaseConfig: FirebaseOptions
  ) {}

  initApp() {
    try {
      return initializeApp(this.firebaseConfig);
    } catch (error) {
      console.warn('Failed to initialize Firebase');
      return null;
    }
  }

  initAuth(app: FirebaseApp | null = null) {
    if (!this.auth && app) {
      try {
        this.auth = getAuth(app);
      } catch (error) {
        console.warn('Failed to initialize Firebase Auth');
        this.auth = null;
      }
    }
  }

  signInWithEmailAndPassword(email: string, password: string) {
    if (!getAuth())
      return from(Promise.reject('Firebase Auth not initialized'));
    return from(signInWithEmailAndPassword(getAuth(), email, password)).pipe(
      catchError(error => {
        console.warn('Failed to sign in with email and password');
        return of(error);
      })
    );
  }

  signInWithGoogle() {
    if (!getAuth()) {
      this.initAuth(getApp());
    }
    return from(signInWithPopup(getAuth(), new GoogleAuthProvider()));
  }

  signOut() {
    if (!getAuth())
      return from(Promise.reject('Firebase Auth not initialized'));
    return from(signOut(getAuth()));
  }
}
