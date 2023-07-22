import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabletViewportSwitchesComponent } from './tablet-viewport-switches.component';

describe('TabletSwitchesComponent', () => {
  let component: TabletViewportSwitchesComponent;
  let fixture: ComponentFixture<TabletViewportSwitchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabletViewportSwitchesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabletViewportSwitchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
