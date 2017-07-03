import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { LandingModule } from '../landing.module';
import { GlobeComponent } from './globe.component';

describe('GlobeComponent', () => {
  let component: GlobeComponent;
  let fixture: ComponentFixture<GlobeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [LandingModule],
      providers:  [
        {provide: APP_BASE_HREF, useValue : '/' }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
