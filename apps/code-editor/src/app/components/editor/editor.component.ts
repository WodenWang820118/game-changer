import { Component, OnInit } from '@angular/core';
import { EditorService } from '../../../services/editor.service';

// generate the standalone component typescript template
@Component({
  standalone: true,
  selector: 'the-eye-editor',
  styles: [
    `
      .cm-content {
        display: flex;
        width: 100%;
        height: 100%;
        align-items: stretch;
      }
    `,
  ],
  template: `<div class="editor">
    <div class="cm-editor" #editor>
      <div tabindex="-1" class="cm-scroller"></div>
    </div>
  </div> `,
})
export class EditorComponent implements OnInit {
  constructor(private readonly editorService: EditorService) {}

  ngOnInit() {
    this.editorService.initHtmlEditorView('.cm-editor');
  }
}
