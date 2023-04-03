import { Chapter } from './../../../../../apps/code-editor/src/app/interfaces/chapter.interface';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { Inject, Injectable } from '@angular/core';
import { Observable, from, map, of } from 'rxjs';

@Injectable()
export class FirebaseService {
  // Initialize Firebase
  private app;
  private db;
  private analytics;

  constructor(@Inject('FIREBASE_CONFIG') private firebaseConfig: any) {
    try {
      this.app = initializeApp(this.firebaseConfig);
      this.db = getFirestore(this.app);
      this.analytics = getAnalytics(this.app);
    } catch (error) {
      console.warn('Failed to initialize Firebase');
    }
  }

  getAllChapters(): Observable<Chapter[]> {
    if (!this.db) return of([]);

    const chaptersCol = collection(this.db, 'chapters');
    return from(getDocs(chaptersCol)).pipe(
      map(
        chaptersSnapshot =>
          chaptersSnapshot.docs.map(doc => doc.data()) as Chapter[]
      )
    );
  }
}
