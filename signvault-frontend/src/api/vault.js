import api from './axiosInstance';

// GET /api/vault — all FULLY_SIGNED contracts for logged in user
export const getVault = () => api.get('/api/vault');

// GET /api/vault/{contractId} — single fully signed contract
export const getVaultContract = (contractId) => api.get('/api/vault/' + contractId);

// Download contract PDF — opens the fileHash URL directly
// Since backend stores Cloudinary URL in fileHash, we fetch the contract and open the URL
export const downloadContract = async (contractId) => {
  const res = await api.get('/api/vault/' + contractId);
  return res;
};