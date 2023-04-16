import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore/lite';
import { Inject, Injectable } from '@angular/core';
import { Observable, from, map, of, tap } from 'rxjs';
import { Chapter } from './interfaces/chapter.interface';

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
      map(chaptersSnapshot => {
        // return chaptersSnapshot.docs.map(doc => doc.data()) as Chapter[]
        return chaptersSnapshot.docs.map(doc => {
          const chapter = doc.data() as Chapter;
          console.warn('chapter', chapter);
          console.warn('chapter.id', chapter.id);
          return chapter;
        });
      })
    );
  }

  updateChapter(
    id: number | string,
    chapter: Partial<Chapter>
  ): Observable<Chapter> {
    if (!this.db)
      return of({
        id: 0,
        title: 'Backend Error',
        content: ['Failed to update the chapter in the Firebase'],
      });
    // the document id is the same as the chapter id
    const chapterDoc = doc(this.db, 'chapters', String(id));
    console.warn('chapter', chapter);
    console.warn('chapterDoc', chapterDoc);
    return from(updateDoc(chapterDoc, chapter)).pipe(
      map(() => chapter as Chapter)
    );
  }

  addChapter(chapter: Chapter): Observable<Chapter> {
    return of(chapter);
  }
}
