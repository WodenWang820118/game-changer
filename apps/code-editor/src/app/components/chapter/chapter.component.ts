import { MatIconModule } from '@angular/material/icon';
import {
  ChangeDetectorRef,
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
import { EMPTY, switchMap, take, tap, withLatestFrom } from 'rxjs';
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
    <div class="chapter" [ngSwitch]="mode">
      <markdown
        *ngSwitchCase="'default'"
        class="chapter__content"
        [data]="chapter?.content?.join('\\n')"></markdown>
      <ng-container *ngSwitchCase="'edit'">
        <ng-container *ngTemplateOutlet="formRef"></ng-container>
        <game-editor
          [editorExtension]="'md'"
          [content]="chapter?.content?.join('\\n')!"></game-editor>
      </ng-container>
      <ng-container *ngSwitchCase="'create'">
        <ng-container *ngTemplateOutlet="formRef"></ng-container>
        <game-editor
          [editorExtension]="'md'"
          [content]="'please add content'"></game-editor>
      </ng-container>
      <ng-container
        *ngTemplateOutlet="
          editorControls;
          context: { mode: mode }
        "></ng-container>
      <!-- reuse the chaptor editor controls -->
      <ng-template #editorControls let-mode="mode">
        <ng-container *ngIf="mode === 'default'">
          <div class="chapter__controls">
            <button class="chapter__controls__btn" gameToggleAnswer>
              Show me
            </button>
            <div class="chapter__controls__control">
              <div (click)="onSelectNextChapter()">Next</div>
              <mat-icon class="chapter__controls__arrow-forward"
                >arrow_forward</mat-icon
              >
            </div>
          </div>
          <div class="chapter__editor" (click)="updateMode('edit')">
            <div class="chapter__editor__edit">
              <mat-icon class="chapter__editor__icon">edit</mat-icon>Edit this
              chapter
            </div>
            <div class="chapter__editor__edit" (click)="updateMode('create')">
              <mat-icon class="chapter__editor__icon">library_add</mat-icon
              >Create
            </div>
          </div>
        </ng-container>
        <div
          class="chapter__editor"
          [style.display]="mode === 'default' ? 'none' : ''">
          <div
            class="chapter__editor__edit"
            (click)="
              updateMode('default');
              mode === 'edit' ? onSaveChapter() : onCreateChapter()
            ">
            <mat-icon class="chapter__editor__icon">save</mat-icon>Save
          </div>
          <div class="chapter__editor__edit" (click)="updateMode('default')">
            <mat-icon class="chapter__editor__icon">backspace</mat-icon>Back
          </div>
          <div
            *ngIf="mode === 'edit'"
            class="chapter__editor__edit"
            (click)="onDeleteChapter()">
            <mat-icon class="chapter__editor__icon">delete</mat-icon>Delete
          </div>
        </div>
      </ng-template>
      <!-- reuse the form for the editor mode and the create mode -->
      <ng-template #formRef>
        <div class="chapter__form">
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
      </ng-template>
    </div>
  `,
  styleUrls: ['../../../styles.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChapterComponent {
  @Input() chapter: Chapter | null = null;
  @Output() nextChapter = new EventEmitter<number>();
  @Output() deleteChapter = new EventEmitter<number>();
  title = new FormControl('');
  order = new FormControl();
  mode: 'edit' | 'create' | 'default' = 'default';

  constructor(
    private chapterEntityService: ChapterEntityService,
    private editorService: EditorService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  updateMode(currentMode: 'edit' | 'create' | 'default') {
    console.warn('update the mode to: ', currentMode);
    this.mode = currentMode;
    if (currentMode === 'edit') {
      this.title.setValue(this.chapter?.title || '');
      this.order.setValue(this.chapter?.order || '');
    } else if (currentMode === 'create') {
      this.title.setValue('');
      this.order.setValue('');
    }

    this.changeDetectorRef.detectChanges();
  }

  onSelectNextChapter() {
    if (!this.chapter) return;
    this.nextChapter.emit(this.chapter.id + 1);
  }

  onSaveChapter() {
    this.editorService.mdContentSyncObservable
      .pipe(
        switchMap(content => {
          if (!this.chapter) return EMPTY;
          const chapterToUpdate: Partial<Chapter> = {
            id: this.chapter.id,
            title: this.title.value || 'Untitled',
            order: this.order.value,
            content: content.split('\n'),
          };

          // update the mode
          this.updateMode('default');
          // update the current chapter
          this.chapter = chapterToUpdate as Chapter;
          // update the chapter in the store
          this.chapterEntityService.update(chapterToUpdate);
          return EMPTY;
        })
      )
      .subscribe()
      .unsubscribe();
  }

  onCreateChapter() {
    this.editorService.mdContentSyncObservable
      .pipe(
        withLatestFrom(this.chapterEntityService.entities$),
        take(1),
        tap(([content, chapters]) => {
          const newChapter: Chapter = {
            id: chapters.length + 1,
            title: this.title.value || 'Untitled',
            order: this.order.value ? this.order.value : chapters.length + 1,
            content: content.split('\n'),
          };
          // add the new chapter to the store
          this.chapterEntityService.add(newChapter);
          // update the mode
          this.updateMode('default');
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
    this.updateMode('default');
  }
}
