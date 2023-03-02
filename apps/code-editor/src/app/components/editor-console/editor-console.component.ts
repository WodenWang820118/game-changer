import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  SecurityContext,
  ViewChild,
} from '@angular/core';
import { EditorService } from '../../../services/editor.service';
import { Observable, map } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'game-editor-console',
  imports: [CommonModule],
  standalone: true,
  template: `
    <div id="editor-console">
      <div id="output" [innerHTML]="output$ | async"></div>
    </div>
  `,
  styleUrls: ['../../../styles.scss'],
})
export class EditorConsoleComponent implements AfterViewInit, OnInit {
  @ViewChild('outputElement', { static: true }) outputElement!: ElementRef;
  output$: Observable<string> | undefined;
  constructor(
    private readonly editorService: EditorService,
    private readonly sanitizer: DomSanitizer
  ) {}
  ngAfterViewInit(): void {
    console.log('AfterViewInit');
  }
  ngOnInit(): void {
    // Create a custom console object that filters out certain log levels
    const customConsole = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      log: (_: unknown) => {
        return;
      },
      warn: console.warn.bind(console),
      error: console.error.bind(console),
      info: console.info.bind(console),
    };

    // Override the global console object with the custom one
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).console = customConsole;

    this.output$ = this.editorService.js$.pipe(
      map(js => {
        // Use console.log to capture the output
        let output = '';
        customConsole.log = (message: unknown) => {
          output += message + '\n';
        };
        // the custom console object is used inside the js code
        eval(js);
        customConsole.log = () => {
          return;
        };

        // Sanitize and format the output for display in the HTML
        const html =
          '<pre>' +
          this.sanitizer.sanitize(SecurityContext.HTML, output) +
          '</pre>';
        return html;
      })
    );
  }
}
