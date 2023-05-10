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

  constructor(private editorService: EditorService) {}

  onPlay() {
    combineLatest([
      this.editorService.editor$.html,
      this.editorService.editor$.css,
      this.editorService.editor$.js,
    ])
      .pipe(
        tap(([htmlEditor, cssEditor, jsEditor]) => {
          this.editorService.setContent(
            'html',
            htmlEditor.state.doc.toString() as string
          );
          this.editorService.setContent(
            'css',
            cssEditor.state.doc.toString() as string
          );
          this.editorService.setContent(
            'js',
            jsEditor.state.doc.toString() as string
          );
        })
      )
      .subscribe();
  }
}
