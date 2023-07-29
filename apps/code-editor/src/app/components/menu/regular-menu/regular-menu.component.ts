import { MenuItemLinkDirective } from './../../../directives/menu-item-link.directive';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginInterfaceComponent } from '../../login-interface/login-interface.component';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'game-regular-menu',
  standalone: true,
  imports: [
    CommonModule,
    MenuItemLinkDirective,
    LoginInterfaceComponent,
    OverlayModule,
  ],
  template: `
    <nav class="navigation__nav">
      <ul class="navigation__list">
        <li
          (click)="activateMenuItem(menuItem)"
          cdkOverlayOrigin
          #trigger="cdkOverlayOrigin"
          class="navigation__list__item"
          *ngFor="let menuItem of menuItems">
          <!-- <a href="">{{ menuItem }}</a> -->
          {{ menuItem }}
        </li>
      </ul>
    </nav>
    <!-- TODO: refactor out to be shared across different screen sizes -->
    <game-login-interface
      [trigger]="trigger"
      [isOpen]="isOpen"
      (closeEvent)="closeLoginInterface()"></game-login-interface>
  `,
  styleUrls: ['../../../../styles.scss'],
})
export class RegularMenuComponent {
  @Input() menuItems: string[] = [];
  @ViewChild('trigger') trigger!: ElementRef;
  isOpen = false;

  activateMenuItem(menuItem: string) {
    if (menuItem === 'Sign In') {
      console.warn('Signing in with Google');
      this.isOpen = true;
    }
  }

  closeLoginInterface() {
    this.isOpen = false;
  }
}
