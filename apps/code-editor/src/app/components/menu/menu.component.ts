import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HamburgerMenuComponent } from './hamburger-menu/hamburger-menu.component';
import { RegularMenuComponent } from './regular-menu/regular-menu.component';
import { menuItems } from './menuItems';

@Component({
  selector: 'game-menu',
  standalone: true,
  imports: [CommonModule, HamburgerMenuComponent, RegularMenuComponent],
  template: `
    <game-hamburger-menu
      *ngIf="showHamburgerMenu"
      [showMenu]="showHamburgerMenu"
      [menuItems]="menuItems"
      class="navigation__col__nav"></game-hamburger-menu>
    <game-regular-menu
      *ngIf="!showHamburgerMenu"
      [menuItems]="menuItems"></game-regular-menu>
  `,
  styles: [],
})
export class MenuComponent implements OnInit {
  @Input() showHamburgerMenu = false;
  menuItems = menuItems;
  ngOnInit() {
    this.onChangingMenuType();
  }

  @HostListener('window:resize')
  onChangingMenuType() {
    const sizeTablet2 = parseInt(
      window
        .getComputedStyle(document.documentElement)
        .getPropertyValue('--screen-tablet2')
        .replace('px', '')
    );
    if (window.innerWidth <= sizeTablet2) {
      this.showHamburgerMenu = true;
    } else {
      this.showHamburgerMenu = false;
    }
  }
}
