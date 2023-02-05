import { CommonModule } from '@angular/common';
import { OnInit, SecurityContext } from '@angular/core';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EditorService } from '../../../services/editor.service';
import { Observable, map } from 'rxjs';
import { EditorView } from 'codemirror';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'the-eye-renderer',
  template: `<div class="renderer">
    <div [innerHTML]="safeHtml$ | async"></div>
    <div></div>
  </div>`,
})
export class RendererComponent implements OnInit {
  editorView: EditorView | undefined;
  safeHtml$: Observable<string> | undefined;
  constructor(
    private readonly editorService: EditorService,
    private readonly sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    this.safeHtml$ = this.editorService.html$.pipe(
      map(html => {
        console.log('renderer html', html);
        return this.sanitizer.sanitize(SecurityContext.HTML, html) as string;
      })
    );
  }
}
