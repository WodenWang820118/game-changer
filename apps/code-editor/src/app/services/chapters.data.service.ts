import { HttpClient } from '@angular/common/http';
import { Chapter } from '../interfaces/chapter.interface';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Observable, catchError, of } from 'rxjs';
import { FirebaseService } from '@game/data-access/code-editor';
import { environment } from '../../environments/environment';

@Injectable()
export class ChaptersDataService extends DefaultDataService<Chapter> {
  private localUrl = 'http://localhost:3000/chapters';
  constructor(
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator,
    private firebaseService: FirebaseService
  ) {
    super('Chapter', http, httpUrlGenerator);
  }

  // override the default getAll() method
  override getAll(): Observable<Chapter[]> {
    if (environment.backendService === 'json-server') {
      return this.http.get<Chapter[]>(this.localUrl).pipe(
        catchError(() => {
          const errorMessage = ['Failed to get chapters from the JSON server'];
          const errorChapter: Chapter = {
            id: 0,
            title: 'Backend Error',
            content: errorMessage,
          };
          return of([errorChapter]);
        })
      );
    }
    if (environment.backendService === 'firebase') {
      return this.firebaseService.getAllChapters().pipe(
        catchError(() => {
          const errorMessage = ['Failed to get chapters from the Firebase'];
          const errorChapter: Chapter = {
            id: 0,
            title: 'Backend Error',
            content: errorMessage,
          };
          return of([errorChapter]);
        })
      );
    }

    const errorMessage = ['Failed to get chapters from the backend service'];
    const errorChapter: Chapter = {
      id: 0,
      title: 'Backend Error',
      content: errorMessage,
    };

    return of([errorChapter]);
  }
}
