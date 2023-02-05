import { CommonModule } from '@angular/common';
import { OnInit, SecurityContext } from '@angular/core';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EditorService } from '../../../services/editor.service';
import { Observable, map, tap } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'the-eye-renderer',
  template: `<div class="renderer">
    <div [innerHTML]="safeHtml$ | async"></div>
  </div>`,
})
export class RendererComponent implements OnInit {
  safeHtml$: Observable<string> | undefined;
  safeCss$: Observable<string> | undefined;
  constructor(
    private readonly editorService: EditorService,
    private readonly sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    this.safeHtml$ = this.editorService.html$.pipe(
      map(html => {
        // console.log('rendering html', html);
        return this.sanitizer.sanitize(SecurityContext.HTML, html) as string;
      })
    );

    this.editorService.css$
      .pipe(
        tap(css => {
          // console.log('rendering css', css);
          const head = document.getElementsByTagName('head')[0];
          const style = document.createElement('style');
          style.appendChild(
            document.createTextNode(
              this.sanitizer.sanitize(SecurityContext.STYLE, css) as string
            )
          );
          head.appendChild(style);
        })
      )
      .subscribe();
  }
}
