import { HubspotSignatureVerificationMiddleware } from './hubspot-signature-verification.middleware';

describe('HubspotSignatureVerificationMiddleware', () => {
  it('should be defined', () => {
    expect(new HubspotSignatureVerificationMiddleware()).toBeDefined();
  });
});
