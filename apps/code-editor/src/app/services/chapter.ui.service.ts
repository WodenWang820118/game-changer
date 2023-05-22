import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Chapter } from '@game/data-access/code-editor-data';

export enum EditorMode {
  DEFAULT = 'default',
  EDIT = 'edit',
  CREATE = 'create',
}

@Injectable()
export class ChapterUiService {
  private mode = new BehaviorSubject(EditorMode.DEFAULT);
  mode$ = this.mode.asObservable();
  private currentChapter = new BehaviorSubject<Chapter>({
    id: 1,
    title: '',
    order: 0,
    content: [''],
    code: {
      html: '',
      css: '',
      js: '',
    },
  });
  currentChapter$ = this.currentChapter.asObservable();

  updateMode(currentMode: EditorMode) {
    // console.warn('update the mode to: ', currentMode);
    this.mode.next(currentMode);
  }

  updateCurrentChapter(chapter: Chapter) {
    this.currentChapter.next(chapter);
    console.warn('update the current chapter to: ', chapter);
  }
}
