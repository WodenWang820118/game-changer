import { combineLatest, tap } from 'rxjs';
import { Component } from '@angular/core';
import { EditorService } from '../services/editor.service';

@Component({
  selector: 'game-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'code-editor';

  constructor(private editorService: EditorService) {}

  onPlay() {
    console.log('onPlay');
    combineLatest([
      this.editorService.htmlEditor$,
      this.editorService.cssEditor$,
    ])
      .pipe(
        tap(([htmlEditor, cssEditor]) => {
          this.editorService.setHtml(htmlEditor.state.doc.toString() as string);
          this.editorService.setCss(cssEditor.state.doc.toString() as string);
        })
      )
      .subscribe();
  }

  selectEditor(editor: HTMLElement) {
    this.editorService.selectEditor(editor.id);
  }
}
