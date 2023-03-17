import { MatIconModule } from '@angular/material/icon';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { Chapter } from '../../interfaces/chapter.interface';

@Component({
  selector: 'game-chapter',
  standalone: true,
  imports: [CommonModule, MatIconModule, MarkdownModule],
  template: `
    <div class="chapter">
      <markdown
        class="chapter__content"
        [data]="chapter?.content?.join('\\n')"></markdown>
      <div class="chapter__control">
        <p>Next</p>
        <p><mat-icon class="chapter__icon">arrow_forward</mat-icon></p>
      </div>
    </div>
  `,
  styleUrls: ['../../../styles.scss'],
})
export class ChapterComponent {
  @Input() chapter: Chapter | null = null;
}
