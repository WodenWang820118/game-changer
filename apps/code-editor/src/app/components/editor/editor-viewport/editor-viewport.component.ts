import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { EditorComponent } from '../editor.component';
import { EditorExtension } from '../../../services/editor.service';

@Component({
  selector: 'game-editor-viewport',
  standalone: true,
  imports: [CommonModule, MatTabsModule, EditorComponent],
  template: `<mat-tab-group
    mat-stretch-tabs="false"
    mat-align-tabs="start"
    animationDuration="0ms">
    <mat-tab
      *ngFor="let editor of editors"
      label="{{ editor }}"
      id="{{ editor }}">
      <game-editor [editorExtension]="editor"></game-editor>
    </mat-tab>
  </mat-tab-group>`,
  styles: [],
})
export class EditorViewportComponent {
  editors: EditorExtension[] = ['html', 'css', 'js'];
}
