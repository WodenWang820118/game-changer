import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { EditorService } from '../../../services/editor.service';

@Component({
  standalone: true,
  selector: 'game-editor',
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
  template: `<div id="cm-editor" #editor>
    <div tabindex="-1" class="cm-scroller"></div>
  </div>`,
})
export class EditorComponent implements AfterViewInit {
  @Input() editorExtension = 'html';
  @ViewChild('editor') editorElement!: ElementRef<HTMLDivElement>;

  constructor(private readonly editorService: EditorService) {}

  ngAfterViewInit() {
    this.editorService.initEditorView(this.editorExtension, this.editorElement);
  }
}
