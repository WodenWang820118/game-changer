import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { User } from 'firebase/auth';

@Component({
  selector: 'game-hamburger-menu',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatMenuModule, MatButtonModule],
  template: `
    <button mat-button [matMenuTriggerFor]="menu">
      <mat-icon style="transform: scale(2.5);">menu</mat-icon>
    </button>
    <mat-menu #menu="matMenu" class="mat-menu">
      <button mat-menu-item *ngFor="let menuItem of menuItems">
        {{ menuItem.text }}
      </button>
    </mat-menu>
  `,
  styles: [
    `
      .mat-mdc-button {
        --mat-mdc-button-persistent-ripple-color: none;
      }

      .mat-menu {
        min-width: 100vw !important;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class HamburgerMenuComponent {
  @Input() showMenu = false;
  @Input() menuItems: { text: string; user?: User }[] = [];
}
