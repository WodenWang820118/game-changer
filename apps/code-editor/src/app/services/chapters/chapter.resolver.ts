import { Observable } from 'rxjs';
import { Resolve } from '@angular/router';
import { ChapterEntityService } from './chapter-entity.service';
import { Injectable } from '@angular/core';
import { filter, first, tap } from 'rxjs/operators';

@Injectable()
export class ChapterResolver implements Resolve<boolean> {
  constructor(private chaptersService: ChapterEntityService) {}

  resolve(): Observable<boolean> {
    return this.chaptersService.loaded$.pipe(
      tap(loaded => {
        if (!loaded) {
          this.chaptersService.getAll();
        }
      }),
      filter(loaded => !!loaded),
      first()
    );
  }
}
