import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { EditorExtension, EditorService } from '../../services/editor.service';

@Component({
  standalone: true,
  selector: 'game-editor',
  styles: [``],
  template: `<div id="cm-editor" #editor></div>`,
})
export class EditorComponent implements AfterViewInit {
  @Input() editorExtension: EditorExtension = 'html';
  @Input() content = '';
  @ViewChild('editor') editorElement!: ElementRef<HTMLDivElement>;

  constructor(private readonly editorService: EditorService) {}

  ngAfterViewInit() {
    this.editorService.initEditorView(
      this.editorExtension,
      this.editorElement,
      this.content
    );
  }
}
