import { ElementRef, Injectable } from '@angular/core';
import { EditorView } from 'codemirror';
import {
  htmlLightEditorExtensions,
  cssLightEditorExtensions,
  jsLightEditorExtensions,
  mdLightEditorExtensions,
} from './editor-extensions';
import { BehaviorSubject, map } from 'rxjs';

export type EditorExtension = 'html' | 'css' | 'js' | 'md';
type ExtensionArray = any[];

@Injectable({
  providedIn: 'root',
})
export class EditorService {
  editorExtensions: Record<EditorExtension, ExtensionArray> = {
    html: htmlLightEditorExtensions,
    css: cssLightEditorExtensions,
    js: jsLightEditorExtensions,
    md: mdLightEditorExtensions,
  };

  editorSubjects = {
    html: new BehaviorSubject<EditorView>(new EditorView()),
    css: new BehaviorSubject<EditorView>(new EditorView()),
    js: new BehaviorSubject<EditorView>(new EditorView()),
    md: new BehaviorSubject<EditorView>(new EditorView()),
  };

  contentSubjects = {
    html: new BehaviorSubject(`<div class="red">Hello World</div>`),
    css: new BehaviorSubject('.red { color: red; }'),
    js: new BehaviorSubject(`console.log("hi")`),
    md: new BehaviorSubject(`# Hello World`),
  };

  editor$ = {
    html: this.editorSubjects.html.asObservable(),
    css: this.editorSubjects.css.asObservable(),
    js: this.editorSubjects.js.asObservable(),
    md: this.editorSubjects.md.asObservable(),
  };

  content$ = {
    html: this.contentSubjects.html.asObservable(),
    css: this.contentSubjects.css.asObservable(),
    js: this.contentSubjects.js.asObservable(),
    md: this.contentSubjects.md.asObservable(),
  };

  mdContentSync = new BehaviorSubject('');
  mdContentSyncObservable = this.mdContentSync.asObservable();

  initEditorView(
    extension: EditorExtension,
    elementRef: ElementRef,
    content?: string
  ) {
    let editorView = null;
    if (extension === 'md') {
      const mdContentSync = new BehaviorSubject('');
      editorView = new EditorView({
        extensions: [
          ...this.editorExtensions[extension],
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
            mdContentSync.next(e.state.doc.toString());
          }),
        ],
        parent: elementRef.nativeElement,
      });

      mdContentSync
        .pipe(
          map(md => {
            this.mdContentSync.next(md);
          })
        )
        .subscribe();
    } else {
      editorView = new EditorView({
        extensions: this.editorExtensions[extension],
        parent: elementRef.nativeElement,
      });
    }

    editorView.dispatch({
      changes: {
        from: 0,
        insert: content ? content : this.contentSubjects[extension].getValue(),
        to: editorView.state.doc.length,
      },
    });

    this.editorSubjects[extension].next(editorView);
  }

  setContent(extension: EditorExtension, content: string) {
    this.contentSubjects[extension].next(content);
  }
}
