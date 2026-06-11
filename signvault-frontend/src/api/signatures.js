import api from './axiosInstance';

// POST /api/signatures/sign [Auth Required]
// contractId: String — format SV-2026-XXXXXX
// fingerprintString: String — raw fingerprint data
export const signContract = (contractId, fingerprintString) =>
  api.post('/api/signatures/sign', { contractId, fingerprintString });
