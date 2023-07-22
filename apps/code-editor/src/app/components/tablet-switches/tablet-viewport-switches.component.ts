import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'game-tablet-viewport-switches',
  standalone: true,
  imports: [CommonModule],
  template: ` <ng-container *ngIf="isTablet">
    <button
      class="editor-layout__switches__item"
      (click)="goToTutorial()"
      #tutorial>
      tutorial
    </button>
    <button class="editor-layout__switches__item" (click)="goToEditor()" #input>
      input
    </button>
    <button
      class="editor-layout__switches__item"
      (click)="goToOutput()"
      #output>
      output
    </button>
  </ng-container>`,
  styles: [],
})
export class TabletViewportSwitchesComponent implements OnInit {
  isTablet = false;
  @Input() viewport: HTMLDivElement | null = null;
  @ViewChild('tutorial') tutorial: ElementRef<HTMLButtonElement> | null = null;
  @ViewChild('input') input: ElementRef<HTMLButtonElement> | null = null;
  @ViewChild('output') output: ElementRef<HTMLButtonElement> | null = null;

  ngOnInit(): void {
    this.onResize();
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth <= 800) {
      this.isTablet = true;
      this.tutorial?.nativeElement.click();
    } else {
      this.isTablet = false;
      this.tutorial?.nativeElement.click(); // reset the css
    }
  }

  goToTutorial() {
    if (!this.viewport || !this.tutorial) return;
    this.resetAllBackgroundColor();
    this.tutorial.nativeElement.style.backgroundColor = '#ff3e00';
    this.tutorial.nativeElement.style.color = 'white';
    this.viewport.style.transform = 'translate(0)';
  }

  goToEditor() {
    if (!this.viewport || !this.input) return;
    this.resetAllBackgroundColor();
    this.input.nativeElement.style.backgroundColor = '#ff3e00';
    this.input.nativeElement.style.color = 'white';
    this.viewport.style.transform = 'translate(-33.333%)';
  }

  goToOutput() {
    if (!this.viewport || !this.output) return;
    this.resetAllBackgroundColor();
    this.output.nativeElement.style.backgroundColor = '#ff3e00';
    this.output.nativeElement.style.color = 'white';
    this.viewport.style.transform = 'translate(-66.666%)';
  }

  resetAllBackgroundColor() {
    if (!this.tutorial || !this.input || !this.output) return;
    this.tutorial.nativeElement.style.backgroundColor = 'transparent';
    this.tutorial.nativeElement.style.color = '#888';
    this.input.nativeElement.style.backgroundColor = 'transparent';
    this.input.nativeElement.style.color = '#888';
    this.output.nativeElement.style.backgroundColor = 'transparent';
    this.output.nativeElement.style.color = '#888';
  }
}
