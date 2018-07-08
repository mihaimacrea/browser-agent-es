import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {Component} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatButtonToggleModule, MatInputModule, MatSnackBarModule, MatTooltipModule} from '@angular/material';

@Component({selector: 'app-browser-agent-table', template: ''})
class BrowserAgentTableStubComponent {}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        BrowserAgentTableStubComponent
      ],
      imports: [
        BrowserAnimationsModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatInputModule,
        MatTooltipModule,
        MatSnackBarModule
      ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Test​ ​for​ ​Marketing​ ​Factory​ ​newcomers​');
  }));
});
