import { BehaviorSubject, Subject, shareReplay, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chapter } from '../interfaces/chapter.interface';

@Injectable({
  providedIn: 'root',
})
export class ChaptersService {
  private url = 'http://localhost:3000/chapters';
  private chapterSubject = new BehaviorSubject<Chapter>({
    id: 0,
    title: '',
    content: [],
  });
  chapter$ = this.chapterSubject.asObservable();

  constructor(private http: HttpClient) {}

  getChapters() {
    return this.http.get<Chapter[]>(this.url).pipe(shareReplay());
  }

  findChapterById(id: number) {
    return this.http.get<Chapter>(`${this.url}/${id}`).pipe(shareReplay());
  }

  getNextChapter(chapterId: number) {
    return this.findChapterById(chapterId + 1).pipe(shareReplay());
  }

  getPreviousChapter(chapterId: number) {
    return this.findChapterById(chapterId - 1).pipe(shareReplay());
  }
}
