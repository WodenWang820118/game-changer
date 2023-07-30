import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { OverlayModule } from '@angular/cdk/overlay';
import { LoginInterfaceComponent } from '../../login-interface/login-interface.component';
import { User } from 'firebase/auth';
import { FirebaseAuthService } from '@game/data-access/authentication';
import { tap } from 'rxjs';

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
        (click)="activateMenuItem(menuItem)"
        cdkOverlayOrigin
        #trigger="cdkOverlayOrigin"
        *ngFor="let menuItem of menuItems">
        {{ menuItem.text }}
      </button>
    </mat-menu>
    <game-login-interface
      [trigger]="trigger"
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
export class HamburgerMenuComponent implements OnInit, AfterViewInit {
  @Input() showMenu = false;
  @Input() menuItems: { text: string; user?: User }[] = [];

  menuItemsRefs!: QueryList<ElementRef>;
  trigger: ElementRef | undefined;
  isOpen = false;
  currentMenuItem: { text: string; user?: User } = { text: '' };
  signIn = 'Sign In';

  constructor(private firebaseAuthService: FirebaseAuthService) {}

  ngOnInit() {
    this.firebaseAuthService
      .authState()
      .pipe(
        tap(user => {
          if (user) {
            console.warn('User: ', user);
            this.currentMenuItem = { text: user.displayName as string, user };
            // Find index of the 'Sign In' item
            const index = this.menuItems.findIndex(
              item => item.text === this.signIn
            );

            // Replace the 'Sign In' item with new item
            if (index !== -1) {
              this.menuItems[index] = this.currentMenuItem;
            }
          }
        })
      )
      .subscribe();
  }

  ngAfterViewInit() {
    this.trigger = this.menuItemsRefs.find(
      item => item.nativeElement.innerText === this.signIn
    );
  }

  activateMenuItem(menuItem: { text: string; user?: User }) {
    if (menuItem.text === this.signIn) {
      console.warn('Signing in with Google');
      this.currentMenuItem = menuItem;
      this.isOpen = true;
    }
  }

  closeLoginInterface() {
    this.isOpen = false;
  }

  handleUserData(user: User | null) {
    console.warn('User: ', user);
    if (user && this.currentMenuItem.text === this.signIn) {
      console.warn('User: ', user.displayName);
      this.currentMenuItem = { text: user.displayName as string, user };

      // Find index of the 'Sign In' item
      const index = this.menuItems.findIndex(item => item.text === this.signIn);

      // Replace the 'Sign In' item with new item
      if (index !== -1) {
        this.menuItems[index] = this.currentMenuItem;
      }

      this.closeLoginInterface();
    }
  }
}
