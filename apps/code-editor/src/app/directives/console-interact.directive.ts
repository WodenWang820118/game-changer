import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[gameConsoleInteract]',
})
export class ConsoleInteractDirective {
  constructor(private el: ElementRef) {}

  @HostListener('click') onClick() {
    this.el.nativeElement.classList.toggle('collapsed');
  }
}
