import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorViewportComponent } from './editor-viewport.component';

describe('EditorViewportComponent', () => {
  let component: EditorViewportComponent;
  let fixture: ComponentFixture<EditorViewportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorViewportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditorViewportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
