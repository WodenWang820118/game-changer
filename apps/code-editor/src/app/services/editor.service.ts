import { ElementRef, Injectable } from '@angular/core';
import { EditorView } from 'codemirror';
import {
  htmlLightEditorExtensions,
  cssLightEditorExtensions,
  jsLightEditorExtensions,
  mdLightEditorExtensions,
} from './editor-extensions';
import { BehaviorSubject, map } from 'rxjs';

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
  jsSubject = new BehaviorSubject(`console.log("hi")`);
  js$ = this.jsSubject.asObservable();

  mdEditorBehaviorSubject: BehaviorSubject<EditorView> =
    new BehaviorSubject<EditorView>(new EditorView());
  mdEditor$ = this.mdEditorBehaviorSubject.asObservable();
  mdSubject = new BehaviorSubject(`# Hello World`);
  md$ = this.mdSubject.asObservable();
  mdContentSync = new BehaviorSubject('');
  mdContentSyncObservable = this.mdContentSync.asObservable();

  initHtmlEditorView(elementRef: ElementRef, html?: string) {
    // 1) Create an EditorView
    const editorView = new EditorView({
      extensions: htmlLightEditorExtensions,
      parent: elementRef.nativeElement,
    });

    // 2) Dispatch the initial value
    editorView.dispatch({
      changes: {
        from: 0,
        insert: html ? html : this.htmlSubject.getValue(),
        to: editorView.state.doc.length,
      },
    });

    // 3) Emit the EditorView to the subject
    this.htmlEditorBehaviorSubject.next(editorView);
  }

  setHtml(html: string) {
    this.htmlSubject.next(html);
  }

  initCssEditorView(elementRef: ElementRef, css?: string) {
    const editorView = new EditorView({
      extensions: cssLightEditorExtensions,
      parent: elementRef.nativeElement,
    });

    editorView.dispatch({
      changes: {
        from: 0,
        insert: css ? css : this.cssSubject.getValue(),
        to: editorView.state.doc.length,
      },
    });

    this.cssEditorBehaviorSubject.next(editorView);
  }

  setCss(css: string) {
    this.cssSubject.next(css);
  }

  initJsEditorView(elementRef: ElementRef, js?: string) {
    const editorView = new EditorView({
      extensions: jsLightEditorExtensions,
      parent: elementRef.nativeElement,
    });

    editorView.dispatch({
      changes: {
        from: 0,
        insert: js ? js : this.jsSubject.getValue(),
        to: editorView.state.doc.length,
      },
    });

    this.jsEditorBehaviorSubject.next(editorView);
  }

  setJs(js: string) {
    this.jsSubject.next(js);
  }

  initMdEditorView(elementRef: ElementRef, md?: string) {
    const mdContentSync = new BehaviorSubject('');
    const editorView = new EditorView({
      extensions: [
        ...mdLightEditorExtensions,
        EditorView.theme({
          '.cm-content': {
            display: 'block',
            textAlign: 'justify',
            background: 'white',
            color: 'black',
            padding: '1em',
            borderRadius: '3px',
          },
          '.cm-gutters': { display: 'none' },
        }),
        EditorView.lineWrapping,
        EditorView.updateListener.of(function (e) {
          // TODO: how to sync the content of the editor with the content of the subject?
          mdContentSync.next(e.state.doc.toString());
          // mdContentSync = e.state.doc.toString();
        }),
      ],
      parent: elementRef.nativeElement,
    });

    editorView.dispatch({
      changes: {
        from: 0,
        insert: md ? md : this.mdSubject.getValue(),
        to: editorView.state.doc.length,
      },
    });

    mdContentSync
      .pipe(
        map(md => {
          this.mdContentSync.next(md);
        })
      )
      .subscribe();

    this.mdEditorBehaviorSubject.next(editorView);
  }

  initEditorView(extension: string, elementRef: ElementRef, content?: string) {
    switch (extension) {
      case 'html':
        this.initHtmlEditorView(elementRef, content);
        break;
      case 'css':
        this.initCssEditorView(elementRef, content);
        break;
      case 'js':
        this.initJsEditorView(elementRef, content);
        break;
      case 'md':
        this.initMdEditorView(elementRef, content);
        break;
      default:
        break;
    }
  }
}
