import { Observable, map, switchMap, take } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChaptersService } from '../../services/chapters.service';
import { Chapter } from '../../interfaces/chapter.interface';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ChapterComponent } from '../chapter/chapter.component';
import { MatSelect, MatSelectModule } from '@angular/material/select';

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
          <div><strong>Introduction</strong>&nbsp;/&nbsp;Basics</div>
          <mat-form-field appearance="fill" class="sidebar__chapter-select">
            <mat-label>Chapter</mat-label>
            <mat-select #select>
              <mat-option
                *ngFor="let chapter of chapters$ | async"
                [value]="chapter.title"
                #chapterOption
                (click)="onSelectChapter(chapter.id)"
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
          [chapter]="chapter$ | async"></game-chapter>
      </ng-scrollbar>
    </div>
  `,
  styleUrls: ['../../../styles.scss'],
})
export class SidebarNavComponent implements OnInit {
  @ViewChild('select') select!: MatSelect;
  chapters$: Observable<Chapter[]> = new Observable();
  chapter$: Observable<Chapter> = this.chapterService.chapter$;

  constructor(public chapterService: ChaptersService) {}

  ngOnInit(): void {
    this.reloadIntroduction();
    this.chapters$ = this.chapterService
      .getChapters()
      .pipe(map(chapters => chapters));
  }

  onClickChapter(): void {
    this.select.open();
  }

  previousChapter(): void {
    this.chapter$ = this.chapter$.pipe(
      take(1),
      switchMap(chapter => this.chapterService.getPreviousChapter(chapter.id))
    );
  }

  nextChapter(): void {
    this.chapter$ = this.chapter$.pipe(
      take(1),
      switchMap(chapter => this.chapterService.getNextChapter(chapter.id))
    );
  }

  reloadIntroduction() {
    this.chapter$ = this.chapter$.pipe(
      take(1),
      switchMap(() => this.chapterService.findChapterById(1))
    );
  }

  onSelectChapter(chapterId: number) {
    this.chapter$ = this.chapterService.findChapterById(chapterId);
  }
}
