# 🔐 ETHEREUM → CELO Cross-Chain Transfer App with Turnkey Embedded Wallet

A demo **Next.js** application simulating a token transfer from **ETHEREUM** to **CELO**, using **Turnkey** for embedded wallets. Styled with `Tailwind CSS`, the app features a modal interface, balance tracking, and mock transaction logic.

---

## ⚡️ Features

- 🛂 **Embedded wallet login via Turnkey** using **Passkey or Email**
- 🔐 Secure wallet creation and account management
- 📤 Simulated ETHEREUM → CELO transfers
- 💳 Real-time (mock) balance updates
- 🖼️ Beautiful modal UI with backdrop blur
- 📢 Toast notifications for success and validation errors
- 🧠 Client-side validation for address and amount
- 🚰 Faucet API (created separately) to request test ETH (not integrated yet due to Turnkey's minimum balance requirement for wallet creation)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/turnkey-crosschain-demo.git
cd turnkey-crosschain-demo

```

### 2. Install Dependencies

```bash
npm install
# or
yarn install

```

### 3. Setup Environment Variables

```bash
cp .env.example .env.local

```

### 4. Run the App

```bash
npm run dev
# or
yarn dev

```

Visit the app at http://localhost:3000

## 🔐 How Turnkey is Integrated

This app uses **Turnkey’s Embedded Wallet SDK** to provide seamless and secure wallet creation and authentication, enabling users to manage wallets with **passkey or email login**.

### 1. Import the `<Auth />` Component

We use the `<Auth />` component from `@turnkey/sdk-react` to handle user authentication with Turnkey.

```tsx
import { Auth } from "@turnkey/sdk-react";
```

### 2. Configure the <Auth /> Component

You must pass the following required props:

authConfig: Contains the Turnkey organization ID and authentication strategy (e.g., passkey or email).

configOrder: A unique identifier to manage the wallet creation order.

onAuthSuccess: Callback triggered after successful authentication. It receives the session and user info.

onError: Callback to handle authentication or SDK errors.

```tsx
<Auth
  authConfig={...}
  configOrder={...}
  onAuthSuccess={(session) => { /* store session */ }}
  onError={(error) => { /* handle error */ }}
/>
```

### 3. Sub-Organization Creation

Upon successful login, Turnkey creates a sub-organization for each user. Wallet accounts are created under this sub-org to ensure logical separation and security.

### 4. Creating Blockchain-Specific Wallet Accounts

To create an account for a specific blockchain (like ETHEREUM or Ethereum), you need to:

Provide a valid BIP32 derivationPath

Specify the addressFormat for that blockchain (e.g., "ETHEREUM" or "EVM")

```tsx
await createWalletAccount({
  session,
  organizationId,
  subOrgId,
  walletId,
  accountName: "ETHEREUM Wallet",
  addressFormat: "ADDRESS_FORMAT_ETHEREUM",
  curve: "secp256k1",
  derivationPath: "m/44'/195'/0'/0/0", // ETHEREUM derivation path
});
```

### 5. Using the Session for Wallet Actions

Once a session is active:

You can fetch wallet and account details using the session token.

You can initiate and sign transactions (e.g., using Turnkey's API for Ethereum or any supported chain).

All operations (like listing wallets, creating accounts, signing messages) are scoped to the authenticated session and sub-organization.
