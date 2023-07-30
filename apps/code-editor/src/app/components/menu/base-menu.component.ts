import { User } from 'firebase/auth';
import { FirebaseAuthService } from '@game/data-access/authentication';
import { OnInit, Component, ElementRef, QueryList } from '@angular/core';
import { tap } from 'rxjs';

@Component({
  template: '',
}) // This is a dummy component
export class BaseMenuComponent implements OnInit {
  set menuItems(value: { text: string; user?: User }[]) {
    this._menuItems = value;
  }

  get menuItems() {
    return this._menuItems;
  }

  currentMenuItem: { text: string; user?: User } = { text: '' };
  menuItemsRefs!: QueryList<ElementRef>;
  signIn = 'Sign In';
  isOpen = false;

  activeTrigger!: ElementRef;
  private _menuItems: { text: string; user?: User }[] = [];

  constructor(protected firebaseAuthService: FirebaseAuthService) {}

  ngOnInit() {
    this.handleAuthStateChange();
  }

  activateMenuItem(
    menuItem: { text: string; user?: User },
    triggerButton: any
  ) {
    // assign the trigger button to the active trigger
    this.activeTrigger = triggerButton;
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
      // console.warn('User: ', user.displayName);
      this.currentMenuItem = { text: user.displayName as string, user };
      this.replaceSignInItem();
      this.closeLoginInterface();
    }
  }

  private handleAuthStateChange() {
    this.firebaseAuthService
      .authState()
      .pipe(
        tap(user => {
          if (user) {
            console.warn('User: ', user);
            this.currentMenuItem = { text: user.displayName as string, user };
            this.replaceSignInItem();
          }
        })
      )
      .subscribe();
  }

  private replaceSignInItem() {
    // Find index of the 'Sign In' item
    const index = this.menuItems.findIndex(item => item.text === this.signIn);

    // Replace the 'Sign In' item with new item
    if (index !== -1) {
      this.menuItems[index] = this.currentMenuItem;
    }
  }
}
