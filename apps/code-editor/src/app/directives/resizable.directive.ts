import {
  Directive,
  ElementRef,
  OnInit,
  HostListener,
  Input,
} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[gameDivResizable]',
})
export class ResizableDirective implements OnInit {
  isResizing = false;
  @Input() resizableGrabHeight = 1;
  @Input() resizableMinHeight = 5;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.el.nativeElement.style['border-bottom'] =
      this.resizableGrabHeight + 'px solid';
    this.el.nativeElement.style['border-top'] = 'none';
  }

  getNewHeight(height: number) {
    const newHeight = Math.max(this.resizableMinHeight, height);
    this.el.nativeElement.style.height = newHeight + 'px';
  }

  @HostListener('document: mousemove', ['$event'])
  onMouseMoveG(event: MouseEvent) {
    if (!this.isResizing) return;

    const containerRect = this.el.nativeElement.getBoundingClientRect();
    const containerTop = containerRect.top;
    const containerBottom = containerRect.bottom;

    const mouseY = event.clientY;

    if (mouseY > containerTop && mouseY < containerBottom) {
      const viewportHeight = window.innerHeight;
      const newHeight = Math.min(Math.max(0, event.clientY), viewportHeight);
      this.getNewHeight(newHeight - this.el.nativeElement.offsetTop);
    }

    event.stopPropagation();
  }

  @HostListener('document: mouseup', ['$event'])
  onMouseUpG(event: MouseEvent) {
    if (!this.isResizing) return;
    this.restoreGlobalMouseEvents();
    this.isResizing = false;
    event.stopPropagation();
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (this.inDragRegion(event)) {
      this.isResizing = true;
      this.preventGlobalMouseEvents();
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.inDragRegion(event) || this.isResizing) {
      // doesn't allow resizing in tablet mode
      // may refactor to be resizable in tablet mode
      if (window.innerWidth > 800)
        this.el.nativeElement.style.cursor = 'row-resize';
    } else {
      this.el.nativeElement.style.cursor = 'default';
    }
  }

  restoreGlobalMouseEvents() {
    const body = document.body as HTMLElement | null;
    if (body) {
      body.style.pointerEvents = 'auto';
    }
  }

  preventGlobalMouseEvents() {
    const body = document.body as HTMLElement | null;
    if (body) {
      body.style.pointerEvents = 'none';
    }
  }

  inDragRegion(event: MouseEvent) {
    const element = this.el.nativeElement;
    const grabOffset = element.offsetHeight * 0 - 50;
    const bottomOffset = element.offsetTop + element.offsetHeight - grabOffset;
    const mouseY = event.clientY + window.scrollY;
    return mouseY < element.offsetTop + grabOffset || mouseY > bottomOffset;
  }
}
