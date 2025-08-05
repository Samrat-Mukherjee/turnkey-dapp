export interface AuthConfig {
  emailEnabled: boolean;
  passkeyEnabled: boolean;
  phoneEnabled: boolean;
  appleEnabled: boolean;
  facebookEnabled: boolean;
  googleEnabled: boolean;
  walletEnabled: boolean;
}

type ConfigOrder = "email" | "passkey" | "phone" | "socials";

export interface Config {
  authConfig: AuthConfig;
  configOrder: ConfigOrder[];
}
