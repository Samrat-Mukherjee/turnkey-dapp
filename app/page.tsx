"use client";
import { Auth } from "@turnkey/sdk-react";

export default function Home() {
  type Config = {
    authConfig: AuthConfig;
    configOrder: ConfigOrder[];
  };
  type AuthConfig = {
    emailEnabled: boolean;
    passkeyEnabled: boolean;
    phoneEnabled: boolean;
    appleEnabled: boolean;
    facebookEnabled: boolean;
    googleEnabled: boolean;
    walletEnabled: boolean;
  };

  type ConfigOrder = "email" | "passkey" | "phone" | "socials";

  const config: Config = {
    authConfig: {
      emailEnabled: true,
      passkeyEnabled: true,
      phoneEnabled: false,
      appleEnabled: false,
      facebookEnabled: false,
      googleEnabled: false,
      walletEnabled: false,
    },
    // The order of the auth methods to display in the UI
    configOrder: ["email", "passkey" /*  "phone" , "socials" */],
  };

  const onAuthSuccess = async () => {
    console.log("✅ Auth Success:");
  };
  const onError = (err: any) => {
    console.error("❌ Auth Error:", err);
  };
  return (
    <div>
      <Auth
        {...config}
        onAuthSuccess={onAuthSuccess}
        onError={(e) => onError(e)}
      />
    </div>
  );
}
