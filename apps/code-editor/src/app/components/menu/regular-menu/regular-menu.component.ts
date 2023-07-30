import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginInterfaceComponent } from '../../login-interface/login-interface.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { User } from 'firebase/auth';
import { FirebaseAuthService } from '@game/data-access/authentication';
import { BaseMenuComponent } from '../base-menu.component';

@Component({
  selector: 'game-regular-menu',
  standalone: true,
  imports: [CommonModule, LoginInterfaceComponent, OverlayModule],
  template: `
    <nav class="navigation__nav">
      <ul class="navigation__list">
        <li
          (click)="activateMenuItem(menuItem, triggerButton)"
          cdkOverlayOrigin
          #triggerButton="cdkOverlayOrigin"
          class="navigation__list__item"
          *ngFor="let menuItem of menuItems">
          {{ menuItem.text }}
        </li>
      </ul>
    </nav>
    <game-login-interface
      [trigger]="activeTrigger"
      [isOpen]="isOpen"
      (closeEvent)="closeLoginInterface()"
      (userData)="handleUserData($event)"></game-login-interface>
  `,
  styleUrls: ['../../../../styles.scss'],
})
export class RegularMenuComponent extends BaseMenuComponent implements OnInit {
  @Input() override set menuItems(value: { text: string; user?: User }[]) {
    super.menuItems = value;
  }

  override get menuItems() {
    return super.menuItems;
  }

  constructor(firebaseAuthService: FirebaseAuthService) {
    super(firebaseAuthService);
  }
}
