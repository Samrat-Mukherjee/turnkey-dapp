import { apiRequest } from "../api/apiRequest";

export const faucet = {
  requestFund: (address: string, network: string) =>
    apiRequest(`/api/faucet`, {
      method: "POST",
      body: JSON.stringify({ address, network }),
    }),
};
