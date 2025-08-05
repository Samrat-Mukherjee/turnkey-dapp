# 🔐 TRON → CELO Cross-Chain Transfer App with Turnkey Embedded Wallet

A demo **Next.js** application simulating a token transfer from **TRON** to **CELO**, using **Turnkey** for embedded wallets. Styled with `Tailwind CSS` and `shadcn/ui`, the app features a modal interface, balance tracking, and mock transaction logic.

---

## ⚡️ Features

- 🛂 **Embedded wallet login via Turnkey** using **Passkey or Email**
- 🔐 Secure wallet creation and account management
- 📤 Simulated TRON → CELO transfers  
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

