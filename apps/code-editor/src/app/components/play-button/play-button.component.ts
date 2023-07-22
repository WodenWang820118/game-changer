import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'game-play-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  styleUrls: ['../../../styles.scss'],
  template: `
    <button class="play-button" mat-raised-button>
      <mat-icon
        class="play-button__icon"
        style="transform: scale(2); padding:0; margin:0 ;"
        >play_arrow</mat-icon
      >
    </button>
  `,
})
export class PlayButtonComponent {}
