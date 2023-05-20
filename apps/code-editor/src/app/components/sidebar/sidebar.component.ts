import {
  Observable,
  map,
  first,
  tap,
  of,
  combineLatest,
  withLatestFrom,
} from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chapter } from '@game/data-access/code-editor-data';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ChapterComponent } from '../chapter/chapter.component';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { ChapterEntityService } from '../../services/chapters/chapter-entity.service';
import { ChapterUiService } from '../../services/chapter.ui.service';

@Component({
  selector: 'game-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    NgScrollbarModule,
    ChapterComponent,
    MatSelectModule,
  ],
  template: `
    <div class="sidebar">
      <div class="sidebar__nav">
        <a><mat-icon (click)="previousChapter()">arrow_back</mat-icon></a>
        <div class="sidebar__nav__select" (click)="onClickChapter()">
          <div><mat-icon>menu</mat-icon></div>
          <div>
            <strong>{{ (chapter$ | async)?.title }}</strong>
          </div>
          <mat-form-field appearance="fill" class="sidebar__chapter-select">
            <mat-label>Chapter</mat-label>
            <mat-select #select>
              <mat-option
                *ngFor="let chapter of chapters$ | async"
                [value]="chapter.title"
                #chapterOption
                (click)="onSelectChapter(chapter)"
                >{{ chapter.title }}</mat-option
              >
            </mat-select>
          </mat-form-field>
        </div>
        <a><mat-icon (click)="nextChapter()">arrow_forward</mat-icon></a>
      </div>
      <ng-scrollbar [viewClass]="'sidebar__markup'" class="scrollbar">
        <game-chapter
          scrollViewport
          (nextChapter)="nextChapter()"
          (deleteChapter)="deleteChapter($event)"
          [chapter]="chapter$ | async"></game-chapter>
      </ng-scrollbar>
    </div>
  `,
  styleUrls: ['../../../styles.scss'],
})
export class SidebarNavComponent implements OnInit {
  @ViewChild('select') select!: MatSelect;
  chapters$: Observable<Chapter[]> = new Observable();
  chapter$: Observable<Chapter> = new Observable();

  constructor(
    private chapterEntityService: ChapterEntityService,
    private chapterUiService: ChapterUiService
  ) {}

  ngOnInit(): void {
    this.chapters$ = this.chapterEntityService.entities$.pipe(
      map(chapters => chapters)
    );
    this.reloadIntroduction();
  }

  onClickChapter(): void {
    this.select.open();
  }

  // TODO: could be called a lot of times, need to fix it
  previousChapter(): void {
    this.chapter$ = combineLatest([
      this.chapter$,
      this.chapterEntityService.entities$,
    ]).pipe(
      first(),
      map(([currentChapter, chapters]) => {
        const index = chapters.findIndex(
          chapter => chapter.order === currentChapter.order
        );
        const chapter = index > 0 ? chapters[index - 1] : chapters[0];
        this.chapterUiService.updateCurrentChapter(chapter);
        return chapter;
      })
    );
  }

  // TODO: could be called a lot of times, need to fix it
  nextChapter(): void {
    this.chapter$ = combineLatest([
      this.chapter$,
      this.chapterEntityService.entities$,
    ]).pipe(
      first(),
      map(([currentChapter, chapters]) => {
        const index = chapters.findIndex(
          chapter => chapter.order === currentChapter.order
        );
        const chapter =
          index < chapters.length - 1 ? chapters[index + 1] : chapters[0];
        this.chapterUiService.updateCurrentChapter(chapter);
        return chapter;
      })
    );
  }

  reloadIntroduction() {
    this.chapter$ = this.chapterEntityService.entities$.pipe(
      map(chapters => chapters.find(chapter => chapter.id === 1) || chapters[0])
    );
  }

  onSelectChapter(currentChapter: Chapter) {
    this.chapter$ = this.chapterEntityService.entities$.pipe(
      map(
        chapters =>
          chapters.find(chapter => chapter.order === currentChapter.order) ||
          chapters[0]
      )
    );
  }

  deleteChapter(chapter: Chapter) {
    this.chapterEntityService
      .delete(chapter.id)
      .pipe(
        withLatestFrom(this.chapterEntityService.entities$),
        first(),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        tap(([_, chapters]) => {
          console.warn(chapters);
          this.chapter$ = of(
            chapters.find(chapter => chapter.order === chapter.order - 1) ||
              chapters[0]
          );
        })
      )
      .subscribe()
      .unsubscribe();
  }
}
