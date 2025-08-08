"use client";
import { Auth, TurnkeyThemeProvider } from "@turnkey/sdk-react";
import { turnConfig } from "@/lib/auth/turnkey";
import { useTurnkeyAuth } from "@/hooks/useTurnkeyAuth";
import { customTheme } from "@/lib/theme/customTheme";
import { ToastProvider } from "@/components/ToastProvider";
import { onError } from "@/lib/utils/onError";
import style from "@/styles/Home.module.css";

export default function Home() {
  const { onAuthSuccess } = useTurnkeyAuth();

  return (
    <>
      <div className={style.background}>
        <TurnkeyThemeProvider theme={customTheme}>
          <Auth
            {...turnConfig}
            onAuthSuccess={onAuthSuccess}
            onError={(e) => onError(e)}
          />
        </TurnkeyThemeProvider>
        <ToastProvider />
      </div>
    </>
  );
}
