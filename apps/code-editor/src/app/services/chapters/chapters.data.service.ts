import { HttpClient } from '@angular/common/http';
import { Chapter } from '@game/data-access/code-editor-data';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Update } from '@ngrx/entity';
import { FirebaseService } from '@game/data-access/code-editor-data';

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
            order: 0,
            content: errorMessage,
            code: {
              html: '',
              css: '',
              js: '',
            },
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
            order: 0,
            content: errorMessage,
            code: {
              html: '',
              css: '',
              js: '',
            },
          };
          return of([errorChapter]);
        })
      );
    }

    const errorMessage = ['Failed to get chapters from the backend service'];
    const errorChapter: Chapter = {
      id: 0,
      title: 'Backend Error',
      order: 0,
      content: errorMessage,
      code: {
        html: '',
        css: '',
        js: '',
      },
    };

    return of([errorChapter]);
  }

  override update(update: Update<Chapter>): Observable<Chapter> {
    if (environment.backendService === 'json-server') {
      return this.http.put<Chapter>(
        `${this.localUrl}/${update.id}`,
        update.changes
      );
    }
    if (environment.backendService === 'firebase') {
      return this.firebaseService.updateChapter(update.id, update.changes);
    }
    return of({
      id: 0,
      title: 'Backend Error',
      order: 0,
      content: ['Failed to update the chapter in the backend service'],
      code: {
        html: '',
        css: '',
        js: '',
      },
    });
  }

  override add(chapter: Chapter): Observable<Chapter> {
    if (environment.backendService === 'json-server') {
      return this.http.post<Chapter>(this.localUrl, chapter);
    }
    if (environment.backendService === 'firebase') {
      return this.firebaseService.addChapter(chapter);
    }
    return of({
      id: 0,
      title: 'Backend Error',
      order: 0,
      content: ['Failed to add the chapter in the backend service'],
      code: {
        html: '',
        css: '',
        js: '',
      },
    });
  }

  override delete(key: string | number): Observable<string | number> {
    if (environment.backendService === 'json-server') {
      return this.http.delete(`${this.localUrl}/${key}`).pipe(map(() => key));
    }
    if (environment.backendService === 'firebase') {
      return this.firebaseService.deleteChapter(key);
    }
    return of(0);
  }
}
