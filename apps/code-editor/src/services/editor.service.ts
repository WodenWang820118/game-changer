import { Injectable } from '@angular/core';
import { EditorView } from 'codemirror';
import { htmlEditorExtensions, cssEditorExtensions } from './editor-extensions';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EditorService {
  htmlEditorBehaviorSubject: BehaviorSubject<EditorView>;
  htmlEditorView$: Observable<EditorView>;
  htmlSubject = new BehaviorSubject(`<div>Hello World</div>`);
  html$ = this.htmlSubject.asObservable();

  cssEidtorBehaviorSubject: BehaviorSubject<EditorView>;
  cssEditorView$: Observable<EditorView>;
  cssSubject = new BehaviorSubject(`body {
    background-color: red;
  }
  `);
  css$ = this.cssSubject.asObservable();

  jsEditorBehaviorSubject: BehaviorSubject<EditorView>;
  jsEditorView$: Observable<EditorView>;
  jsSubject = new BehaviorSubject(`console.log('Hello World');`);
  js$ = this.jsSubject.asObservable();

  constructor() {
    this.htmlEditorBehaviorSubject = new BehaviorSubject<EditorView>(
      new EditorView()
    );
    this.htmlEditorView$ = this.htmlEditorBehaviorSubject.asObservable();

    this.cssEidtorBehaviorSubject = new BehaviorSubject<EditorView>(
      new EditorView()
    );
    this.cssEditorView$ = this.cssEidtorBehaviorSubject.asObservable();

    this.jsEditorBehaviorSubject = new BehaviorSubject<EditorView>(
      new EditorView()
    );
    this.jsEditorView$ = this.jsEditorBehaviorSubject.asObservable();
  }

  initHtmlEditorView(selector: string) {
    // 1) Create an EditorView
    const editorView = new EditorView({
      extensions: htmlEditorExtensions,
      parent: document.querySelector(selector) as HTMLElement,
    });

    // 2) Dispatch the initial value
    editorView.dispatch({
      changes: {
        from: 0,
        insert: this.htmlSubject.getValue(),
        to: editorView.state.doc.length,
      },
    });

    // 3) Emit the EditorView to the subject
    this.setHtmlEditor(editorView);
  }

  setHtmlEditor(editor: EditorView) {
    this.htmlEditorBehaviorSubject.next(editor);
  }

  setHtml(html: string) {
    this.htmlSubject.next(html);
  }

  initCssEditor(selector: string) {
    const editor = new EditorView({
      extensions: cssEditorExtensions,
      parent: document.querySelector(selector) as HTMLElement,
    });

    this.setHtmlEditor(editor);
  }

  setCssEditor(editor: EditorView) {
    this.cssEidtorBehaviorSubject.next(editor);
  }

  initJsEditor(selector: string) {
    const editor = new EditorView({
      extensions: cssEditorExtensions,
      parent: document.querySelector(selector) as HTMLElement,
    });

    this.setHtmlEditor(editor);
  }

  setJsEditor(editor: EditorView) {
    this.jsEditorBehaviorSubject.next(editor);
  }
}
