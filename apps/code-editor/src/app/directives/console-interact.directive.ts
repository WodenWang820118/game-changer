import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[gameConsoleInteract]',
})
export class ConsoleInteractDirective {
  constructor(private el: ElementRef) {}

  @HostListener('click', ['$event']) onClick(event: MouseEvent) {
    const ignoreTarget = '#clean-console';
    const ignoreTargetElement =
      this.el.nativeElement.querySelector(ignoreTarget);

    if (event.target === ignoreTargetElement) {
      event.stopPropagation();
      return;
    }

    if (window.innerWidth < 800) {
      const element = document.querySelector('.editor-layout__code-preview');
      element?.classList.toggle('collapsed');
      this.el.nativeElement.classList.toggle('collapsed');
    }
  }
}
