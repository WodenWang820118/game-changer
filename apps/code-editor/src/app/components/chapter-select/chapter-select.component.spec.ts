import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapterSelectComponent } from './chapter-select.component';

describe('ChapterSelectComponent', () => {
  let component: ChapterSelectComponent;
  let fixture: ComponentFixture<ChapterSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChapterSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChapterSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
