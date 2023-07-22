import { Observable } from 'rxjs';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { ChapterEntityService } from './chapter-entity.service';
import { Injectable } from '@angular/core';
import { filter, first, tap } from 'rxjs/operators';

@Injectable()
export class ChapterResolver implements Resolve<boolean> {
  constructor(private chapterEntityService: ChapterEntityService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.chapterEntityService.loaded$.pipe(
      tap(loaded => {
        if (!loaded) {
          this.chapterEntityService.getAll();
        }
      }),
      filter(loaded => !!loaded),
      first()
    );
  }
}
