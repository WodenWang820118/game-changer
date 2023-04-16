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
import { Chapter } from '@game/data-access/code-editor-data';
import { ToggleAnswerDirective } from '../../directives/toggle-answer.directive';
import { EditorComponent } from '../editor/editor.component';
import { ChapterEntityService } from '../../services/chapter-entity.service';
import { tap } from 'rxjs';
import { EditorService } from '../../services/editor.service';

@Component({
  selector: 'game-chapter',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MarkdownModule,
    MatButtonModule,
    ToggleAnswerDirective,
    EditorComponent,
  ],
  template: `
    <div class="chapter">
      <markdown
        *ngIf="!editMode"
        class="chapter__content"
        [data]="chapter?.content?.join('\\n')"></markdown>
      <!-- edit mode with editor -->
      <div *ngIf="editMode">
        <game-editor
          [editorExtension]="'md'"
          [content]="chapter?.content?.join('\\n')!"></game-editor>
      </div>
      <div class="chapter__controls" *ngIf="!editMode">
        <button class="chapter__controls__btn" gameToggleAnswer>Show me</button>
        <div class="chapter__controls__control">
          <div (click)="onSelectNextChapter()">Next</div>
          <mat-icon class="chapter__controls__arrow-forward"
            >arrow_forward</mat-icon
          >
        </div>
      </div>
      <!-- TODO: CRUD buttons and functionalities -->
      <div class="chapter__editor" *ngIf="!editMode" (click)="onEditChapter()">
        <div class="chapter__editor__edit">
          <mat-icon class="chapter__editor__icon">edit</mat-icon>Edit this
          chapter
        </div>
        <div class="chapter__editor__edit" (click)="onCreateChapter()">
          <mat-icon class="chapter__editor__icon">library_add</mat-icon>Create
        </div>
      </div>
      <div *ngIf="editMode" class="chapter__editor">
        <div class="chapter__editor__edit" (click)="onSaveChapter()">
          <mat-icon class="chapter__editor__icon">save</mat-icon>Save
        </div>

        <div class="chapter__editor__edit" (click)="onEditChapter()">
          <mat-icon class="chapter__editor__icon">backspace</mat-icon>Back
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../../../styles.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChapterComponent {
  @Input() chapter: Chapter | null = null;
  @Output() nextChapter = new EventEmitter<number>();
  editMode = false;

  constructor(
    private chapterEntityService: ChapterEntityService,
    private editorService: EditorService
  ) {}

  onSelectNextChapter() {
    if (!this.chapter) return;
    this.nextChapter.emit(this.chapter.id + 1);
  }

  onEditChapter() {
    if (!this.chapter) return;
    this.editMode = !this.editMode;
  }

  onSaveChapter() {
    this.editorService.mdContentSyncObservable
      .pipe(content => {
        return content.pipe(
          tap(content => {
            if (!this.chapter) return;
            console.warn('content', content);
            console.warn('update content', content.split('\n'));
            const chapterToUpdate: Partial<Chapter> = {
              id: this.chapter.id,
              title: this.chapter.title,
              order: this.chapter.order,
              content: content.split('\n'),
            };
            // switch edit mode to false
            this.editMode = false;
            // update the current chapter
            this.chapter = chapterToUpdate as Chapter;
            // update the chapter in the store
            this.chapterEntityService.update(chapterToUpdate);
          })
        );
      })
      .subscribe()
      .unsubscribe();
  }

  onCreateChapter() {
    // TODO: implementation
  }
}
