import { Component, ViewEncapsulation } from '@angular/core';
import { EditorService } from './services/editor.service';
import { combineLatest, tap } from 'rxjs';

@Component({
  selector: 'game-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  title = 'code-editor';
  editors = ['index.html', 'style.css', 'index.js'];
  renderers = ['Result'];

  constructor(private editorService: EditorService) {}

  onPlay() {
    console.log('onPlay');
    combineLatest([
      this.editorService.htmlEditor$,
      this.editorService.cssEditor$,
      this.editorService.jsEditor$,
    ])
      .pipe(
        tap(([htmlEditor, cssEditor, jsEditor]) => {
          this.editorService.setHtml(htmlEditor.state.doc.toString() as string);
          this.editorService.setCss(cssEditor.state.doc.toString() as string);
          this.editorService.setJs(jsEditor.state.doc.toString() as string);
        })
      )
      .subscribe();
  }
}
