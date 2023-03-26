import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HamburgerMenuComponent } from './hamburger-menu/hamburger-menu.component';
import { RegularMenuComponent } from './regular-menu/regular-menu.component';

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
  menuItems = ['Kit', 'Discord', 'GitHub'];
  ngOnInit() {
    this.onChangingMenuType();
  }

  @HostListener('window:resize')
  onChangingMenuType() {
    // console.warn('window.screen.width: ', window.screen.width);
    if (window.innerWidth <= 800) {
      this.showHamburgerMenu = true;
    } else {
      this.showHamburgerMenu = false;
    }
  }
}
