import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginInterfaceComponent } from '../../login-interface/login-interface.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { User } from 'firebase/auth';

@Component({
  selector: 'game-regular-menu',
  standalone: true,
  imports: [CommonModule, LoginInterfaceComponent, OverlayModule],
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
          {{ menuItem.text }}
        </li>
      </ul>
    </nav>
    <!-- TODO: refactor out to be shared across different screen sizes -->
    <game-login-interface
      [trigger]="trigger"
      [isOpen]="isOpen"
      (closeEvent)="closeLoginInterface()"
      (userData)="handleUserData($event)"></game-login-interface>
  `,
  styleUrls: ['../../../../styles.scss'],
})
export class RegularMenuComponent implements AfterViewInit {
  @Input() menuItems: { text: string; user?: User }[] = [];
  @ViewChildren('cdkOverlayOrigin', { read: ElementRef })
  menuItemsRefs!: QueryList<ElementRef>;
  trigger: ElementRef | undefined;
  isOpen = false;
  currentMenuItem: { text: string; user?: User } = { text: '' };
  signIn = 'Sign In';

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
    if (user && this.currentMenuItem.text === 'Sign In') {
      console.warn('User: ', user.displayName);
      this.currentMenuItem = { text: user.displayName as string, user };

      // Find index of the 'Sign In' item
      const index = this.menuItems.findIndex(item => item.text === 'Sign In');

      // Replace the 'Sign In' item with new item
      if (index !== -1) {
        this.menuItems[index] = this.currentMenuItem;
      }

      this.closeLoginInterface();
    }
  }
}
