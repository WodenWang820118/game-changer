import { HttpClient } from '@angular/common/http';
import { Chapter } from '../interfaces/chapter.interface';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Observable } from 'rxjs';

@Injectable()
export class ChaptersDataService extends DefaultDataService<Chapter> {
  private url = 'http://localhost:3000/chapters';
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Chapter', http, httpUrlGenerator);
  }

  // override the default getAll() method
  override getAll(): Observable<Chapter[]> {
    return this.http.get<Chapter[]>(this.url);
  }
}
