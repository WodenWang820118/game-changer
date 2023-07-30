import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { OverlayModule } from '@angular/cdk/overlay';
import { LoginInterfaceComponent } from '../../login-interface/login-interface.component';
import { User } from 'firebase/auth';
import { FirebaseAuthService } from '@game/data-access/authentication';
import { BaseMenuComponent } from '../base-menu.component';

@Component({
  selector: 'game-hamburger-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    OverlayModule,
    LoginInterfaceComponent,
  ],
  template: `
    <button mat-button [matMenuTriggerFor]="menu">
      <mat-icon style="transform: scale(2.5);">menu</mat-icon>
    </button>
    <mat-menu #menu="matMenu" class="mat-menu">
      <button
        mat-menu-item
        (click)="activateMenuItem(menuItem, triggerButton)"
        cdkOverlayOrigin
        #triggerButton="cdkOverlayOrigin"
        *ngFor="let menuItem of menuItems">
        {{ menuItem.text }}
      </button>
    </mat-menu>
    <game-login-interface
      [trigger]="activeTrigger"
      [isOpen]="isOpen"
      (closeEvent)="closeLoginInterface()"
      (userData)="handleUserData($event)"></game-login-interface>
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
export class HamburgerMenuComponent
  extends BaseMenuComponent
  implements OnInit
{
  @Input() showMenu = false;
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
