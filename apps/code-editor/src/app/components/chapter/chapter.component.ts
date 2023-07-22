import { MatIconModule } from '@angular/material/icon';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Chapter } from '@game/data-access/code-editor-data';
import { EditorComponent } from '../editor/editor.component';
import { ChapterEntityService } from '../../services/chapters/chapter-entity.service';
import { EMPTY, combineLatest, switchMap, take } from 'rxjs';
import { EditorService } from '../../services/editor/editor.service';
import { FormControl } from '@angular/forms';
import {
  ChapterUiService,
  EditorMode,
} from '../../services/chapter.ui.service';
import { EditorView } from 'codemirror';

@Component({
  selector: 'game-chapter',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MarkdownModule,
    MatButtonModule,
    EditorComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <div class="chapter" [ngSwitch]="editorMode$ | async">
      <markdown
        *ngSwitchCase="editorMode.DEFAULT"
        class="chapter__content"
        [data]="chapter?.content?.join('\\n')"></markdown>
      <ng-container *ngSwitchCase="editorMode.EDIT">
        <ng-container *ngTemplateOutlet="formRef"></ng-container>
        <game-editor
          [editorExtension]="'md'"
          [content]="chapter?.content?.join('\\n')!"></game-editor>
      </ng-container>
      <ng-container *ngSwitchCase="editorMode.CREATE">
        <ng-container *ngTemplateOutlet="formRef"></ng-container>
        <game-editor
          [editorExtension]="'md'"
          [content]="'please add content'"></game-editor>
      </ng-container>
      <ng-container
        *ngTemplateOutlet="
          editorControls;
          context: { mode: editorMode$ | async }
        "></ng-container>
      <!-- reuse the chaptor editor controls -->
      <ng-template #editorControls>
        <ng-container *ngIf="(editorMode$ | async) === editorMode.DEFAULT">
          <div class="chapter__controls">
            <button
              class="chapter__controls__btn"
              (click)="switchAnswer()"
              #answerSwitch>
              Show me
            </button>
            <div class="chapter__controls__control">
              <div (click)="onSelectNextChapter()">Next</div>
              <mat-icon class="chapter__controls__arrow-forward"
                >arrow_forward</mat-icon
              >
            </div>
          </div>
          <div class="chapter__editor" (click)="updateMode(editorMode.EDIT)">
            <div class="chapter__editor__edit">
              <mat-icon class="chapter__editor__icon">edit</mat-icon>Edit this
              chapter
            </div>
            <div
              class="chapter__editor__edit"
              (click)="updateMode(editorMode.CREATE)">
              <mat-icon class="chapter__editor__icon">library_add</mat-icon
              >Create
            </div>
          </div>
        </ng-container>
        <div
          class="chapter__editor"
          [style.display]="
            (editorMode$ | async) === editorMode.DEFAULT ? 'none' : ''
          ">
          <div
            class="chapter__editor__edit"
            (click)="onSaveOrUpateChapter(); updateMode(editorMode.DEFAULT)">
            <mat-icon class="chapter__editor__icon">save</mat-icon>Save
          </div>
          <div
            class="chapter__editor__edit"
            (click)="updateMode(editorMode.DEFAULT)">
            <mat-icon class="chapter__editor__icon">backspace</mat-icon>Back
          </div>
          <div
            *ngIf="(editorMode$ | async) === editorMode.EDIT"
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
export class ChapterComponent implements AfterViewInit {
  @Input() chapter: Chapter | null = null;
  @Output() nextChapter = new EventEmitter<Chapter>();
  @Output() deleteChapter = new EventEmitter<Chapter>();
  @ViewChild('answerSwitch') answerSwitch: ElementRef | undefined;
  editorMode: typeof EditorMode = EditorMode;
  editorMode$ = this.chapterUiService.mode$;
  title = new FormControl('');
  order = new FormControl();
  switchMode: 'edit' | 'answer' = 'edit';

  constructor(
    private chapterEntityService: ChapterEntityService,
    private editorService: EditorService,
    protected chapterUiService: ChapterUiService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.updateMode(this.editorMode.DEFAULT);
  }

  updateMode(currentMode: EditorMode) {
    // console.warn('update the mode to: ', currentMode);
    this.chapterUiService.updateMode(currentMode);
    if (currentMode === this.editorMode.EDIT) {
      this.title.setValue(this.chapter?.title || '');
      this.order.setValue(this.chapter?.order || '');
    } else if (currentMode === this.editorMode.CREATE) {
      this.title.setValue('');
      this.order.setValue('');
    }

    this.changeDetectorRef.detectChanges();
  }

  onSelectNextChapter() {
    if (!this.chapter) return;
    // 1) emit the next chapter
    this.nextChapter.emit(this.chapter);
    // 2) update the current chapter
    this.chapterUiService.updateCurrentChapter(this.chapter);
  }

  onSaveOrUpateChapter() {
    this.editorMode$
      .pipe(
        take(1),
        switchMap((mode: EditorMode) => {
          if (mode === this.editorMode.EDIT) {
            this.onSaveChapter();
          } else if (mode === this.editorMode.CREATE) {
            this.onCreateChapter();
          }
          return EMPTY;
        })
      )
      .subscribe()
      .unsubscribe();
  }

  onSaveChapter() {
    combineLatest([
      this.editorService.mdContentSyncObservable,
      this.editorService.editor$.html,
      this.editorService.editor$.css,
      this.editorService.editor$.js,
    ])
      .pipe(
        switchMap(
          ([content, htmlEditor, cssEditor, jsEditor]: [
            string,
            EditorView,
            EditorView,
            EditorView
          ]) => {
            if (!this.chapter) return EMPTY;
            const chapterToUpdate: Partial<Chapter> = {
              id: this.chapter.id,
              title: this.title.value || 'Untitled',
              order: this.order.value,
              content: content.split('\n'),
              code: {
                html: htmlEditor.state.doc.toString(),
                css: cssEditor.state.doc.toString(),
                js: jsEditor.state.doc.toString(),
              },
            };

            // update the mode
            this.updateMode(this.editorMode.DEFAULT);
            // update the current chapter
            this.chapter = chapterToUpdate as Chapter;
            // update the chapter in the store and the current chapter
            this.chapterEntityService.update(chapterToUpdate);
            this.chapterUiService.updateCurrentChapter(this.chapter);
            return EMPTY;
          }
        )
      )
      .subscribe()
      .unsubscribe();
  }

  onCreateChapter() {
    combineLatest([
      this.editorService.mdContentSyncObservable,
      this.chapterEntityService.entities$,
      this.editorService.editor$.html,
      this.editorService.editor$.css,
      this.editorService.editor$.js,
    ])
      .pipe(
        switchMap(
          ([content, chapters, htmlEditor, cssEditor, jsEditor]: [
            string,
            Chapter[],
            EditorView,
            EditorView,
            EditorView
          ]) => {
            const newChapter: Chapter = {
              id: chapters.length + 1,
              title: this.title.value || 'Untitled',
              order: this.order.value ? this.order.value : chapters.length + 1,
              content: content.split('\n'),
              code: {
                html: htmlEditor.state.doc.toString(),
                css: cssEditor.state.doc.toString(),
                js: jsEditor.state.doc.toString(),
              },
            };
            // add the new chapter to the store
            this.chapterEntityService.add(newChapter);
            this.chapterUiService.updateCurrentChapter(newChapter);
            // update the mode
            this.updateMode(this.editorMode.DEFAULT);
            // reset the form
            this.title = new FormControl('');
            this.order = new FormControl();
            return EMPTY;
          }
        )
      )
      .subscribe()
      .unsubscribe();
  }

  onDeleteChapter() {
    if (!this.chapter) return;
    // since it's necessary to change title as well
    // we pass the whole chapter to the upper-level component
    this.deleteChapter.emit(this.chapter);
    this.updateMode(this.editorMode.DEFAULT);
    const defaultChapter: Chapter = {
      id: 0,
      title: 'Default',
      order: 0,
      content: ['Default'],
      code: {
        html: '',
        css: '',
        js: '',
      },
    };
    this.chapterUiService.updateCurrentChapter(defaultChapter);
  }

  switchAnswer() {
    if (!this.chapter) return;
    if (this.switchMode === 'edit') {
      this.switchMode = 'answer';
      this.showAnswer();
    } else {
      this.switchMode = 'edit';
      this.showEditor();
    }
  }

  showAnswer() {
    const btn = this.answerSwitch?.nativeElement;
    if (!btn) return;
    btn.innerHTML = 'Reset';
    const htmlContent = this.chapter?.answer?.html as string;
    const cssContent = this.chapter?.answer?.css as string;
    const jsContent = this.chapter?.answer?.js as string;
    this.editorService.setContent('html', htmlContent);
    this.editorService.setContent('css', cssContent);
    this.editorService.setContent('js', jsContent);
  }

  showEditor() {
    const btn = this.answerSwitch?.nativeElement;
    if (!btn) return;
    btn.innerHTML = 'Show me';
    const htmlContent = this.chapter?.code?.html as string;
    const cssContent = this.chapter?.code?.css as string;
    const jsContent = this.chapter?.code?.js as string;
    this.editorService.setContent('html', htmlContent);
    this.editorService.setContent('css', cssContent);
    this.editorService.setContent('js', jsContent);
  }
}
