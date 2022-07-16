import { addressSyncValidationSuite } from './address.sync-validations';
import { customVestSuiteResultMatchers, disabledState, supportedState } from './unit-test-validation-helpers';
import { syncValidationSuites } from './validation-suites';

describe('addressSyncValidationSuite', () => {
  beforeEach(() => {
    jasmine.addMatchers(customVestSuiteResultMatchers)
  });

  it('is registered with syncValidationSuites', () => {
    expect(syncValidationSuites['address']).toBe(addressSyncValidationSuite);
  })

  it('has errors when address model is empty', () => {
    const result = addressSyncValidationSuite({});
    expect(result.hasErrors()).toBeTrue();
  });

  describe('when street', () => {
    it('is a good street it passes', () => {
      const result = addressSyncValidationSuite({ street: '123 main' });
      expect(result).hasNoFieldErrors('street');
    });

    it('is null it has a required error', () => {
      const result = addressSyncValidationSuite({ street: null });
      expect(result).hasExpectedFieldError('street', /required/);
    });

    it('is empty it has a required error', () => {
      const result = addressSyncValidationSuite({ street: '' });
      expect(result).hasExpectedFieldError('street', /required/ );
    });

    it('is fewer than 3 chars it has the expected min length error', () => {
      const result = addressSyncValidationSuite({ street: '12' });
      expect(result).hasExpectedFieldError('street', /at least 3/ );
    });

    it('is more than 50 chars it has the expected max length error', () => {
      const result = addressSyncValidationSuite({ street: ' 234567890 234567890 234567890 234567890 !TOO LONG!' });
      expect(result).hasExpectedFieldError('street', /at most 50/ );
    })
  });

  describe('when street2', () => {
    // There should be no restrictions on Street2
    it('is provided it passes', () => {
      const result = addressSyncValidationSuite({ street2: 'Apt. A' });
      expect(result).hasNoFieldErrors('street2');
    });

    it('is null it passes', () => {
      const result = addressSyncValidationSuite({ street2: null });
      expect(result).hasNoFieldErrors('street2');
    });

    it('is empty it passes', () => {
      const result = addressSyncValidationSuite({ street2: '' });
      expect(result).hasNoFieldErrors('street2');
    });
  });

  describe('when city',() => {
    it('is provided it passes', () => {
      const result = addressSyncValidationSuite({ city: 'small town' });
      expect(result).hasNoFieldErrors('city');
    });

    it('is null it has a required error', () => {
      const result = addressSyncValidationSuite({ city: null });
      expect(result).hasExpectedFieldError('city', /required/ );
    });

    it('is empty it has a required error', () => {
      const result = addressSyncValidationSuite({ city: '' });
      expect(result).hasExpectedFieldError('city', /required/ );
    });
  });

  describe('when state',() => {
    it('is one of the enabled U.S. States it passes', () => {
      const result = addressSyncValidationSuite({ state: supportedState?.abbreviation });
      expect(result).hasNoFieldErrors('state');
    });

    it('is one of the disabled U.S. States it has the expected error', () => {
      const result = addressSyncValidationSuite({ state: disabledState?.abbreviation });
      expect(result).hasExpectedFieldError('state', /supported/ );
    });

    it('is null it has a required error', () => {
      const result = addressSyncValidationSuite({ state: null });
      expect(result).hasExpectedFieldError('state', /required/ );
    });

    it('is empty it has a required error', () => {
      const result = addressSyncValidationSuite({ state: '' });
      expect(result).hasExpectedFieldError('state', /required/ );
    });
  });

  describe('when postal code', () => {
    it('is 5 digits it passes', () => {
      const result = addressSyncValidationSuite({ postalCode: '12345' });
      expect(result).hasNoFieldErrors('postalCode');
    });

    it('is zip+4 it passes', () => {
      const result = addressSyncValidationSuite({ postalCode: '12345-1234' });
      expect(result).hasNoFieldErrors('postalCode');
    });

    it('is null it has a required error', () => {
      const result = addressSyncValidationSuite({ postalCode: null });
      expect(result).hasExpectedFieldError('postalCode', /required/ );
    });

    it('is empty it has a required error', () => {
      const result = addressSyncValidationSuite({ postalCode: '' });
      expect(result).hasExpectedFieldError('postalCode', /required/ );
    });

    it('has non-digits it has a format error', () => {
      const result = addressSyncValidationSuite({ postalCode: 'abcde' });
      expect(result).hasExpectedFieldError('postalCode', /must be 5 digit/ );
    });

    it('has zip+4 without the dash it has a format error', () => {
      const result = addressSyncValidationSuite({ postalCode: '123451234' });
      expect(result).hasExpectedFieldError('postalCode', /must be 5 digit/ );
    });
  });
});
