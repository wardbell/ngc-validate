import { FormGroup } from '@angular/forms';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { BehaviorSubject, of } from 'rxjs';

import { Address, Company } from '@model';
import { appValidationContextProvider } from '@validators';
import { CompanyFormValidationDemo } from './company-form-validation-demo';
import { CompanyFormComponent } from './company-form.component';
import { DataService } from '@services';
import { validationSuiteProviders } from '@validators';

describe('CompanyFormComponent', () => {
  let component: CompanyFormComponent;
  let fixture: ComponentFixture<CompanyFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
      ],
      providers: [
        appValidationContextProvider,
        CompanyFormValidationDemo,
        { provide: DataService, useClass: TestDataService },
        validationSuiteProviders,
      ]
    }).compileComponents();
  }));

  beforeEach(waitForAsync(async () => {
    fixture = TestBed.createComponent(CompanyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // wait for NgForm to be populated by detectChanges.
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  it('should have a populated form control', () => {
    const controls = component.form!.controls;
    expect(Object.keys(controls).length).toBeGreaterThan(1);
  });

  it('should have company fields validated with the company modelType', () => {
    const controls = component.form!.controls;
    expect(controls['legalName']._validationMetadata?.modelType).toBe('company');
    expect(controls['fein']._validationMetadata?.modelType).toBe('company');
  })

  it('should have company.workAddress fields validated with the address modelType', () => {
    const workAddressGroup = component.form!.controls['workAddress'] as FormGroup;
    const controls = workAddressGroup?.controls;
    Object.keys(controls).forEach(key => {
      expect(controls[key]._validationMetadata?.modelType).toBe('address');
    })
  });
});

class TestDataService {
  companySubject = new BehaviorSubject<Partial<Company>>({
    legalName: 'Test Name',
    fein: '',
    workAddress: {} as Address
  });
  company$ = this.companySubject.asObservable();
  saveCompanyData = jasmine.createSpy('saveCompanyData').and.returnValue(of(true));
}
