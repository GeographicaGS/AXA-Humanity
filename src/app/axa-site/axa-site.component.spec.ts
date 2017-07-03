import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';

import { AxaSiteComponent } from './axa-site.component';
import { AxaSiteModule } from './axa-site.module';
import { CommonModule } from '../common/common.module';

describe('AxaSiteComponent', () => {
  let component: AxaSiteComponent;
  let fixture: ComponentFixture<AxaSiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, AxaSiteModule],
      providers:  [
        {provide: APP_BASE_HREF, useValue : '/' }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AxaSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // We need to import CARTODB.js
  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
