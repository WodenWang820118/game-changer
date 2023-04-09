import { MatIconModule } from '@angular/material/icon';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { MatButtonModule } from '@angular/material/button';
import { Chapter } from '../../interfaces/chapter.interface';
import { ToggleAnswerDirective } from '../../directives/toggle-answer.directive';

@Component({
  selector: 'game-chapter',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MarkdownModule,
    MatButtonModule,
    ToggleAnswerDirective,
  ],
  template: `
    <div class="chapter">
      <markdown
        class="chapter__content"
        [data]="chapter?.content?.join('\\n')"></markdown>
      <div class="chapter__controls">
        <button class="chapter__controls__btn" gameToggleAnswer>Show me</button>
        <div class="chapter__controls__control">
          <div (click)="onSelectNextChapter()">Next</div>
          <mat-icon class="chapter__controls__arrow-forward"
            >arrow_forward</mat-icon
          >
        </div>
      </div>
      <!-- TODO: CRUD buttons and functionalities -->
      <div class="chapter__editor">
        <mat-icon class="chapter__editor__edit">edit</mat-icon>Edit this chapter
      </div>
    </div>
  `,
  styleUrls: ['../../../styles.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChapterComponent {
  @Input() chapter: Chapter | null = null;
  @Output() nextChapter = new EventEmitter<number>();

  onSelectNextChapter() {
    if (!this.chapter) return;
    this.nextChapter.emit(this.chapter.id + 1);
  }
}
