import { APP_BASE_HREF } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule } from '../../common/common.module';
import { AxaSiteModule } from '../../axa-site/axa-site.module';
import { IndicatorNavigationComponent } from './indicator-navigation.component';

describe('IndicatorNavigationComponent', () => {
  let component: IndicatorNavigationComponent;
  let fixture: ComponentFixture<IndicatorNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, AxaSiteModule],
      providers: [{provide: APP_BASE_HREF, useValue : '/' }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
