import { Observable, tap, map, switchMap } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { EditorService } from '../services/editor.service';
import { EditorView } from 'codemirror';

@Component({
  selector: 'the-eye-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'code-editor';
  editorView: EditorView | undefined;
  constructor(private editorService: EditorService) {}

  ngOnInit() {
    console.log('app init');
    this.editorService.htmlEditorView$.subscribe(editor => {
      this.editorView = editor;
    });
  }
  onPlay() {
    console.log('play');
    console.log(this.editorView?.state.doc);
    this.editorService.setHtml(this.editorView?.state.doc.toString() as string);
  }
}
