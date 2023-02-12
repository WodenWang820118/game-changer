import { Injectable } from '@angular/core';
import { EditorView } from 'codemirror';
import { htmlEditorExtensions, cssEditorExtensions } from './editor-extensions';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EditorService {
  htmlEditorBehaviorSubject: BehaviorSubject<EditorView> =
    new BehaviorSubject<EditorView>(new EditorView());
  htmlEditor$ = this.htmlEditorBehaviorSubject.asObservable();
  htmlSubject = new BehaviorSubject(`<div class="red">Hello World</div>`);
  html$ = this.htmlSubject.asObservable();

  cssEditorBehaviorSubject: BehaviorSubject<EditorView> =
    new BehaviorSubject<EditorView>(new EditorView());
  cssEditor$ = this.cssEditorBehaviorSubject.asObservable();
  cssSubject = new BehaviorSubject('.red { color: red; }');
  css$ = this.cssSubject.asObservable();

  jsEditorBehaviorSubject: BehaviorSubject<EditorView> =
    new BehaviorSubject<EditorView>(new EditorView());
  jsEditor$ = this.jsEditorBehaviorSubject.asObservable();
  jsSubject = new BehaviorSubject(`console.log('Hello World');`);
  js$ = this.jsSubject.asObservable();

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
    this.htmlEditorBehaviorSubject.next(editorView);
  }

  setHtml(html: string) {
    this.htmlSubject.next(html);
  }

  initCssEditorView(selector: string) {
    const editorView = new EditorView({
      extensions: cssEditorExtensions,
      parent: document.querySelector(selector) as HTMLElement,
    });

    editorView.dispatch({
      changes: {
        from: 0,
        insert: this.cssSubject.getValue(),
        to: editorView.state.doc.length,
      },
    });

    this.cssEditorBehaviorSubject.next(editorView);
  }

  setCss(css: string) {
    this.cssSubject.next(css);
  }

  initJsEditorView(selector: string) {
    const editor = new EditorView({
      extensions: cssEditorExtensions,
      parent: document.querySelector(selector) as HTMLElement,
    });

    this.jsEditorBehaviorSubject.next(editor);
  }

  selectEditor(editorId: string) {
    const htmlEditor = document.querySelector('#cm-html-editor') as HTMLElement;
    const cssEditor = document.querySelector('#cm-css-editor') as HTMLElement;
    const jsEditor = document.querySelector('#cm-js-editor') as HTMLElement;
    switch (editorId) {
      case 'html-editor':
        htmlEditor.style.display = 'block';
        cssEditor.style.display = 'none';
        jsEditor.style.display = 'none';
        break;
      case 'css-editor':
        htmlEditor.style.display = 'none';
        cssEditor.style.display = 'block';
        jsEditor.style.display = 'none';
        break;
      case 'js-editor':
        htmlEditor.style.display = 'none';
        cssEditor.style.display = 'none';
        jsEditor.style.display = 'block';
        break;
      default:
        htmlEditor.style.display = 'block';
        cssEditor.style.display = 'none';
        jsEditor.style.display = 'none';
        break;
    }
  }
}
