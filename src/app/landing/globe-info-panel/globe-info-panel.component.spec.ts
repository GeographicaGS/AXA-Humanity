import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobeInfoPanelComponent } from './globe-info-panel.component';

describe('GlobeInfoPanelComponent', () => {
  let component: GlobeInfoPanelComponent;
  let fixture: ComponentFixture<GlobeInfoPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobeInfoPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobeInfoPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
