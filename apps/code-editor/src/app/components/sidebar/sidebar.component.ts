import { MatIconModule } from '@angular/material/icon';
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChapterSelectComponent } from '../chapter-select/chapter-select.component';

@Component({
  selector: 'game-sidebar-nav',
  standalone: true,
  imports: [CommonModule, MatIconModule, ChapterSelectComponent],
  template: `
    <a><mat-icon>arrow_back</mat-icon></a>
    <div class="sidebar__nav__select" (click)="onClickChapter()">
      <div><mat-icon>menu</mat-icon></div>
      <div><strong>Introduction</strong>&nbsp;/&nbsp;Basics</div>
      <game-chapter-select></game-chapter-select>
    </div>
    <a><mat-icon>arrow_forward</mat-icon></a>
  `,
  styleUrls: ['../../../styles.scss'],
})
export class SidebarNavComponent {
  @ViewChild(ChapterSelectComponent) chapterSelect!: ChapterSelectComponent;

  onClickChapter(): void {
    console.log('onClickChapter()');
    this.chapterSelect.select.open();
  }
}
