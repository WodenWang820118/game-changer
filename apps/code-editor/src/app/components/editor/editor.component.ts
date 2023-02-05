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
    <div id="cm-html-editor" #editor>
      <div tabindex="-1" class="cm-scroller"></div>
    </div>
    <div id="cm-css-editor" #editor>
      <div tabindex="-1" class="cm-scroller"></div>
    </div>
    <div id="cm-js-editor" #editor>
      <div tabindex="-1" class="cm-scroller"></div>
    </div>
  </div> `,
})
export class EditorComponent implements OnInit {
  constructor(private readonly editorService: EditorService) {}

  ngOnInit() {
    // TODO: read from the store or init with default values
    this.editorService.initHtmlEditorView('#cm-html-editor');
    this.editorService.initCssEditorView('#cm-css-editor');
    this.editorService.initJsEditorView('#cm-js-editor');
    this.editorService.selectEditor('#cm-html-editor');
  }
}
