import { Address } from '@model';
import { companySyncValidationSuite } from './company.sync-validations';
import { customVestSuiteResultMatchers } from './unit-test-validation-helpers';
import { syncValidationSuites } from './validation-suites';

describe('companySyncValidationSuite', () => {
  beforeEach(() => {
    jasmine.addMatchers(customVestSuiteResultMatchers)
  });

  it('is registered with syncValidationSuites', () => {
    expect(syncValidationSuites['company']).toBe(companySyncValidationSuite);
  })

  it('has errors when company model is empty', () => {
    const result = companySyncValidationSuite({});
    expect(result.hasErrors()).toBeTrue();
  });

  describe('when legal name', () => {
    it('is a good name it passes', () => {
      const result = companySyncValidationSuite({ legalName: 'Acme' });
      expect(result).hasNoFieldErrors('legalName');
    });

    it('is null it has a required error', () => {
      const result = companySyncValidationSuite({ legalName: null });
      expect(result).hasExpectedFieldError('legalName', /required/);
    })

    it('is empty it has a required error', () => {
      const result = companySyncValidationSuite({ legalName: '' });
      expect(result).hasExpectedFieldError('legalName', /required/);
    })

    it('is fewer than 3 chars it has the expected min length error', () => {
      const result = companySyncValidationSuite({ legalName: 'ab' });
      expect(result).hasExpectedFieldError('legalName', /at least 3/);
    })

    it('is more than 30 chars it has the expected max length error', () => {
      const result = companySyncValidationSuite({ legalName: ' 234567890 234567890 !TOO LONG!' });
      expect(result).hasExpectedFieldError('legalName', /at most 30/);
    })
  });

  describe('when fein', () => {
    it('is well-formatted it passes', () => {
      const result = companySyncValidationSuite({ fein: '12-1234567' });
      expect(result).hasNoFieldErrors('fein');
    });

    it('is missing the dash it has a format error', () => {
      const result = companySyncValidationSuite({ fein: '121234567' });
      expect(result).hasExpectedFieldError('fein', /format/);
    });

    it('is too short it has a format error', () => {
      const result = companySyncValidationSuite({ fein: '12-123456' });
      expect(result).hasExpectedFieldError('fein', /format/);
    });

    it('is too long it has a format error', () => {
      const result = companySyncValidationSuite({ fein: '12-12345678' });
      expect(result).hasExpectedFieldError('fein', /format/);
    });

    it('has alpha chars it has a format error', () => {
      const result = companySyncValidationSuite({ fein: '12-123A567' });
      expect(result).hasExpectedFieldError('fein', /format/);
    });

    it('is null it has a required error', () => {
      const result = companySyncValidationSuite({ fein: null });
      expect(result).hasExpectedFieldError('fein', /required/);
    })

    it('is empty it has a required error', () => {
      const result = companySyncValidationSuite({ fein: '' });
      expect(result).hasExpectedFieldError('fein', /required/);
    })
  });

  describe('when work address', () => {
    // Leave most of the address testing to the addressSyncValidationSuite tests.
    // Test just enough to show that address validation is happening for the companySyncValidation suite.

    it('is valid, there are no work address errors', () => {
      const result = companySyncValidationSuite({
        workAddress: {
          street: '123 Main',
          city: 'Somewhere',
          state: 'CA',
          postalCode: '94123'
        } as Address
      });
      const hasAddressErrors = result.hasErrorsByGroup('workAddress');
      expect(hasAddressErrors).toBeFalse();
    });

    it('is empty, it has errors', () => {
      const result = companySyncValidationSuite({});
      const hasAddressErrors = result.hasErrorsByGroup('workAddress');
      expect(hasAddressErrors).toBeTrue();
    });

    it('is incomplete, it has errors', () => {
      const result = companySyncValidationSuite({
        workAddress: {
          street: '123 Main',
          city: 'Somewhere',
          // state: 'CA',
          // postalCode: '94123'
        } as Address
      });
      const hasAddressErrors = result.hasErrorsByGroup('workAddress');
      expect(hasAddressErrors).toBeTrue();
    });
  });
});
