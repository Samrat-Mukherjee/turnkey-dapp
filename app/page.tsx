import { Auth } from "@turnkey/sdk-react";
import Image from "next/image";

export default function Home() {
  // The auth methods to display in the UI
  const config: any = {
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
    configOrder: ["email", "passkey" /*  "phone", "socials" */],
  };
  return <div>

    <Auth {...config}/>
  </div>;
}
