import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[gameToggleAnswer]',
  standalone: true,
})
export class ToggleAnswerDirective {
  constructor(private el: ElementRef) {}

  @HostListener('click') onClick() {
    const btn = this.el.nativeElement;
    btn.innerHTML = btn.innerHTML === 'Show me' ? 'Reset' : 'Show me';
  }
}
