import { ElementRef, Injectable } from '@angular/core';
import { EditorView } from 'codemirror';
import {
  htmlEditorExtensions,
  cssEditorExtensions,
  jsEditorExtensions,
} from './editor-extensions';
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

  initHtmlEditorView(elementRef: ElementRef) {
    // 1) Create an EditorView
    const editorView = new EditorView({
      extensions: htmlEditorExtensions,
      parent: elementRef.nativeElement,
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

  initCssEditorView(elementRef: ElementRef) {
    const editorView = new EditorView({
      extensions: cssEditorExtensions,
      parent: elementRef.nativeElement,
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

  initJsEditorView(elementRef: ElementRef) {
    const editorView = new EditorView({
      extensions: jsEditorExtensions,
      parent: elementRef.nativeElement,
    });

    editorView.dispatch({
      changes: {
        from: 0,
        insert: this.jsSubject.getValue(),
        to: editorView.state.doc.length,
      },
    });

    this.jsEditorBehaviorSubject.next(editorView);
  }

  setJs(js: string) {
    this.jsSubject.next(js);
  }

  initEditorView(extension: string, elementRef: ElementRef) {
    switch (extension) {
      case 'html':
        this.initHtmlEditorView(elementRef);
        break;
      case 'css':
        this.initCssEditorView(elementRef);
        break;
      case 'js':
        this.initJsEditorView(elementRef);
        break;
      default:
        break;
    }
  }
}
