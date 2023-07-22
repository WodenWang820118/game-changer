import { MenuItemLinkDirective } from './../../../directives/menu-item-link.directive';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'game-regular-menu',
  standalone: true,
  imports: [CommonModule, MenuItemLinkDirective],
  template: `
    <nav class="navigation__nav">
      <ul class="navigation__list">
        <li
          class="navigation__list__item"
          gameMenuItemLink
          *ngFor="let menuItem of menuItems">
          <!-- <a href="">{{ menuItem }}</a> -->
          {{ menuItem }}
        </li>
      </ul>
    </nav>
  `,
  styles: [],
})
export class RegularMenuComponent {
  @Input() menuItems: string[] = [];
}
