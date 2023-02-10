import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'the-eye-play-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  styles: [
    `
      .play-button {
        display: flex;
        justify-content: flex-end;
      }
    `,
  ],
  template: `
    <button class="play-button" mat-raised-button color="primary">
      <mat-icon>play_arrow</mat-icon>
    </button>
  `,
})
export class PlayButtonComponent {}
