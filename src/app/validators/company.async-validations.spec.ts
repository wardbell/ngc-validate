import { asyncValidationSuiteFactories } from './validation-suites';
import { createCompanyAsyncValidationSuite } from './company.async-validations';
import { customVestSuiteResultMatchers, testAppContext } from './unit-test-validation-helpers';
import { ValidationSuite } from '@validation';

describe('companyAsyncValidationSuite', () => {
  let companyAsyncValidationSuite: ValidationSuite ;

  beforeEach(() => {
    jasmine.addMatchers(customVestSuiteResultMatchers);
    companyAsyncValidationSuite = createCompanyAsyncValidationSuite();
  });

  describe('createCompanyAsyncValidationSuite', () => {
    it('is registered with asyncValidationSuiteFactories', () => {
      expect(asyncValidationSuiteFactories['company']).toBe(createCompanyAsyncValidationSuite);
    });

    it('creates a "companyAsyncValidationSuite"', () => {
      expect(companyAsyncValidationSuite).toBeDefined();
    });
  })

  describe('when fein', () => {
    it('is registered with the IRS, it passes', (done) => {
      companyAsyncValidationSuite( { fein: '13-1234567' }, 'fein', undefined, testAppContext)
        .done(result => {
          expect(result).hasNoFieldErrors('fein');
          done();
        })
    });

    it('is not registered with the IRS, it has the expected error', (done) => {
      companyAsyncValidationSuite( { fein: '66-1234567' }, 'fein', undefined, testAppContext)
        .done(result => {
          expect(result).hasExpectedFieldError('fein', /not registered/);
          done();
        })
    });

    it('is empty, it passes', (done) => {
      companyAsyncValidationSuite( { fein: '' }, 'fein', undefined, testAppContext)
        .done(result => {
          expect(result.hasErrors()).toBeFalse();
          done();
        })
    });

    it('is badly formed, it passes', (done) => {
      companyAsyncValidationSuite( { fein: 'no good' }, 'fein', undefined, testAppContext)
        .done(result => {
          expect(result.hasErrors()).toBeFalse();
          done();
        })
    });
  });

  describe('when legal name', () => {
    it('matches the name registered with the IRS, it passes', (done) => {
      companyAsyncValidationSuite( { fein: '13-1234567', legalName: 'MARVELOUS PRODUCTS, INC.' }, 'legalName', undefined, testAppContext)
        .done(result => {
          expect(result).hasNoFieldErrors('legalName');
          done();
        })
    });

    it('does not exactly match the name registered with the IRS, it has the "not matched" error', (done) => {
      companyAsyncValidationSuite( { fein: '13-1234567', legalName: 'MARVELOUS PRODUCTS' }, 'legalName', undefined, testAppContext)
        .done(result => {
          expect(result).hasExpectedFieldError('legalName', /not match/);
          done();
        })
    });

    it('is empty, it passes even if FEIN is registered', (done) => {
      companyAsyncValidationSuite( { fein: '13-1234567', legalName: '' }, 'legalName', undefined, testAppContext)
        .done(result => {
          expect(result).hasNoFieldErrors('legalName');
          done();
        })
    });

    it('is provided but the FEIN is not registered with the IRS, it passes', (done) => {
      companyAsyncValidationSuite( { fein: '66-1234567', legalName: 'any name' }, 'legalName', undefined, testAppContext)
        .done(result => {
          expect(result).hasNoFieldErrors('legalName');
          done();
        })
    });
  });
});
