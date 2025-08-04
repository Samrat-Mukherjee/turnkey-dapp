"use client";
import { Auth, TurnkeyThemeProvider } from "@turnkey/sdk-react";
import { useRouter } from "next/navigation";

const customTheme = {
  "--text-primary": "#333333",
  "--button-bg": "#4c48ff",
  "--button-hover-bg": "#3b38e6",
};


export default function Home() {
  const router = useRouter();
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
    router.push("/dashboard");
  };
  const onError = (err: any) => {
    console.error("❌ Auth Error:", err);
  };
  return (
    <div>
     <TurnkeyThemeProvider theme={customTheme} >
       <Auth
        {...config}
        onAuthSuccess={onAuthSuccess}
        onError={(e) => onError(e)}
      />
     </TurnkeyThemeProvider>
    </div>
  );
}
