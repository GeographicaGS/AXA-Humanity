import { TestBed, async } from '@angular/core/testing';
import { APP_BASE_HREF} from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule } from './common/common.module';
import { AxaSiteModule } from './axa-site/axa-site.module';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        CommonModule,
        AxaSiteModule

      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue : '/' }
      ],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  // it(`should have as title 'app works!'`, async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app.title).toEqual('app works!');
  // }));
  //
  // it('should render title in a h1 tag', async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('h1').textContent).toContain('app works!');
  // }));
});
