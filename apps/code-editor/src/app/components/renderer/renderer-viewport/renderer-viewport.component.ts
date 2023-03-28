import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { RendererComponent } from '../renderer.component';

@Component({
  selector: 'game-renderer-viewport',
  standalone: true,
  imports: [CommonModule, MatTabsModule, RendererComponent],
  template: ` <div class="editor-layout__code-preview__viewport">
    <mat-tab-group
      mat-stretch-tabs="false"
      mat-align-tabs="start"
      animationDuration="0ms">
      <mat-tab label="Result">
        <game-renderer></game-renderer>
      </mat-tab>
    </mat-tab-group>
  </div>`,
  styles: [],
})
export class RendererViewportComponent {}
