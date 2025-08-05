import { Config } from "@/types/auth";

 export const turnConfig: Config = {
    authConfig: {
      emailEnabled: true,
      passkeyEnabled: true,
      phoneEnabled: false,
      appleEnabled: false,
      facebookEnabled: false,
      googleEnabled: false,
      walletEnabled: false,
    },
    configOrder: ["email", "passkey"],
  };