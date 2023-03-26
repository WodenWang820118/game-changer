import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularMenuComponent } from './regular-menu.component';

describe('HamburgerMenuComponent', () => {
  let component: RegularMenuComponent;
  let fixture: ComponentFixture<RegularMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegularMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegularMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
