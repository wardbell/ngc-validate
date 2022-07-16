import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { CompanyGeneralFormComponent } from './company-general-sub-form.component';
import { validationSuiteProviders } from '@validators';

describe('CompanyGeneralFormComponent', () => {
  let component: CompanyGeneralFormComponent;
  let fixture: ComponentFixture<CompanyGeneralFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
      ],
      providers: [
        validationSuiteProviders,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyGeneralFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
