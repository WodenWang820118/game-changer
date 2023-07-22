import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
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
  private CHAPTERS_COLLECTION = 'chapters';

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

    const chaptersCol = collection(this.db, this.CHAPTERS_COLLECTION);
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
        order: 0,
        content: ['Failed to update the chapter in the Firebase'],
        code: {
          html: '',
          css: '',
          js: '',
        },
      });
    // the document id is the same as the chapter id
    const chapterDoc = doc(this.db, this.CHAPTERS_COLLECTION, String(id));
    console.warn('chapter', chapter);
    console.warn('chapterDoc', chapterDoc);
    return from(updateDoc(chapterDoc, chapter)).pipe(
      map(() => chapter as Chapter)
    );
  }

  addChapter(chapter: Chapter): Observable<Chapter> {
    if (!this.db)
      return of({
        id: 0,
        title: 'Backend Error',
        order: 0,
        content: ['Failed to add the chapter in the Firebase'],
        code: {
          html: '',
          css: '',
          js: '',
        },
      });

    return from(
      setDoc(
        doc(this.db, this.CHAPTERS_COLLECTION, String(chapter.id)),
        chapter
      )
    ).pipe(map(() => chapter));
  }

  deleteChapter(id: number | string): Observable<string | number> {
    if (!this.db) return of(0);

    return of(
      deleteDoc(doc(this.db, this.CHAPTERS_COLLECTION, String(id)))
    ).pipe(map(() => id));
  }
}
