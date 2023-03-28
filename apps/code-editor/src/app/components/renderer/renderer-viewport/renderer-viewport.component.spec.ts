import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendererViewportComponent } from './renderer-viewport.component';

describe('RendererViewportComponent', () => {
  let component: RendererViewportComponent;
  let fixture: ComponentFixture<RendererViewportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RendererViewportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RendererViewportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
