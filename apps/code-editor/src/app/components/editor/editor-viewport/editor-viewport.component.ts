import {
  ChapterUiService,
  EditorMode,
} from '../../../services/chapter.ui.service';
import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { EditorComponent } from '../editor.component';
import {
  EditorExtension,
  EditorService,
} from '../../../services/editor/editor.service';
import { first, tap } from 'rxjs';

@Component({
  selector: 'game-editor-viewport',
  standalone: true,
  imports: [CommonModule, MatTabsModule, EditorComponent],
  template: `<mat-tab-group
    mat-stretch-tabs="false"
    mat-align-tabs="start"
    animationDuration="0ms">
    <mat-tab label="{{ htmlEditor }}" id="{{ htmlEditor }}">
      <game-editor [editorExtension]="htmlEditor"></game-editor>
    </mat-tab>
    <mat-tab label="{{ cssEditor }}" id="{{ cssEditor }}">
      <game-editor [editorExtension]="cssEditor"></game-editor>
    </mat-tab>
    <mat-tab label="{{ jsEditor }}" id="{{ jsEditor }}">
      <game-editor [editorExtension]="jsEditor"></game-editor>
    </mat-tab>
  </mat-tab-group>`,
  styles: [],
})
export class EditorViewportComponent implements AfterViewInit {
  editorMode$ = this.chapterUiService.mode$;
  editorMode = EditorMode;
  htmlEditor: EditorExtension = 'html';
  cssEditor: EditorExtension = 'css';
  jsEditor: EditorExtension = 'js';

  constructor(
    private editorService: EditorService,
    private chapterUiService: ChapterUiService
  ) {}

  ngAfterViewInit() {
    this.chapterUiService.currentChapter$
      .pipe(
        tap(chapter => {
          if (chapter === undefined) return;
          if (chapter.order > 0) {
            console.warn('The current chapter is: ', chapter);
            this.editorService.setContent(this.htmlEditor, chapter.code.html);
            this.editorService.setContent(this.cssEditor, chapter.code.css);
            this.editorService.setContent(this.jsEditor, chapter.code.js);
          }
        })
      )
      .subscribe();
  }
}
