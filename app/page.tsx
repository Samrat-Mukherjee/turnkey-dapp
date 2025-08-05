"use client";
import { Auth, TurnkeyThemeProvider } from "@turnkey/sdk-react";
import { turnConfig } from "@/lib/auth/turnkey";
import { useTurnkeyAuth } from "@/hooks/useTurnkeyAuth";
import { customTheme } from "@/lib/theme/customTheme";



export default function Home() {
  const { onAuthSuccess } = useTurnkeyAuth();

  const onError = (err: any) => {
    console.error("❌ Auth Error:", err);
  };

  return (
    <div>
      <TurnkeyThemeProvider theme={customTheme}>
        <Auth
          {...turnConfig}
          onAuthSuccess={onAuthSuccess}
          onError={(e) => onError(e)}
        />
      </TurnkeyThemeProvider>
    </div>
  );
}
