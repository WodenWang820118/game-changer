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
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Chapter } from '@game/data-access/code-editor-data';
import { ToggleAnswerDirective } from '../../directives/toggle-answer.directive';
import { EditorComponent } from '../editor/editor.component';
import { ChapterEntityService } from '../../services/chapter-entity.service';
import { first, tap, withLatestFrom } from 'rxjs';
import { EditorService } from '../../services/editor.service';
import { FormControl } from '@angular/forms';

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
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <div class="chapter">
      <markdown
        *ngIf="!editMode && !createMode"
        class="chapter__content"
        [data]="chapter?.content?.join('\\n')"></markdown>
      <!-- edit mode with editor -->
      <div *ngIf="editMode">
        <div
          class="chapter__form"
          style="display: flex; justify-content: space-between;">
          <mat-form-field appearance="fill">
            <mat-label>Enter chapter title</mat-label>
            <input
              matInput
              placeholder="introduction"
              [formControl]="title"
              required />
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Enter chapter order</mat-label>
            <input
              type="number"
              matInput
              placeholder="1"
              [formControl]="order" />
            <mat-hint>Empty will be added at end</mat-hint>
          </mat-form-field>
        </div>
        <game-editor
          [editorExtension]="'md'"
          [content]="chapter?.content?.join('\\n')!"></game-editor>
      </div>
      <div *ngIf="createMode">
        <div
          class="chapter__form"
          style="display: flex; justify-content: space-between;">
          <mat-form-field appearance="fill">
            <mat-label>Enter chapter title</mat-label>
            <input
              matInput
              placeholder="introduction"
              [formControl]="title"
              required />
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Enter chapter order</mat-label>
            <input
              type="number"
              matInput
              placeholder="1"
              [formControl]="order" />
            <mat-hint>Empty will be added at end</mat-hint>
          </mat-form-field>
        </div>
        <game-editor
          [editorExtension]="'md'"
          [content]="'Please add your content'"></game-editor>
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
      <div
        class="chapter__editor"
        *ngIf="!editMode && !createMode"
        (click)="onEditChapter()">
        <div class="chapter__editor__edit">
          <mat-icon class="chapter__editor__icon">edit</mat-icon>Edit this
          chapter
        </div>
        <div class="chapter__editor__edit" (click)="onCreateChapterMode()">
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
        <div class="chapter__editor__edit" (click)="onDeleteChapter()">
          <mat-icon class="chapter__editor__icon">delete</mat-icon>Delete
        </div>
      </div>
      <div *ngIf="createMode" class="chapter__editor">
        <div class="chapter__editor__edit" (click)="onCreateChapter()">
          <mat-icon class="chapter__editor__icon">save</mat-icon>Save
        </div>
        <div class="chapter__editor__edit" (click)="onCreateChapterMode()">
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
  @Output() deleteChapter = new EventEmitter<number>();
  editMode = false;
  createMode = false;
  title = new FormControl('');
  order = new FormControl();

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
    this.title.setValue(this.chapter.title);
    this.order.setValue(this.chapter.order);
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
              title: this.title.value || 'Untitled',
              order: this.order.value,
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

  onCreateChapterMode() {
    this.createMode = !this.createMode;
  }

  onCreateChapter() {
    this.editorService.mdContentSyncObservable
      .pipe(
        withLatestFrom(this.chapterEntityService.entities$),
        first(),
        tap(([content, chapters]) => {
          const newChapter: Chapter = {
            id: chapters.length + 1,
            title: this.title.value || 'Untitled',
            order: this.order.value ? this.order.value : chapters.length + 1,
            content: content.split('\n'),
          };
          // add the new chapter to the store
          this.chapterEntityService.add(newChapter);
          // switch edit mode to false
          this.createMode = false;
          // reset the form
          this.title = new FormControl('');
          this.order = new FormControl();
        })
      )
      .subscribe()
      .unsubscribe();
  }

  onDeleteChapter() {
    if (!this.chapter) return;
    // since it's necessary to change title as well
    // we pass the whole chapter to the upper-level component
    this.deleteChapter.emit(this.chapter.id);
    this.editMode = false;
  }
}
