import { useDashboardLogic } from "@/hooks/useDashboardLogic";
import { shortenAddress } from "@/lib/utills/addressShort";
import { copyAddress } from "@/lib/utills/copyAddress";
import modalStyle from "@/styles/ModalStyles.module.css";
import { useState } from "react";
import { FaArrowDown, FaArrowUp, FaHandHoldingUsd } from "react-icons/fa";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { MdContentCopy } from "react-icons/md";
import { toast } from "react-toastify";
import Modal from "react-modal";


// Bind modal to your app root
//Modal.setAppElement("#app");

export function WalletCard() {
  const {
    loading,
    tronAddress,

    handleLogout,
  } = useDashboardLogic();
  const [balance, setBalance] = useState(0.0);
  const [celoBalance, setCeloBalance] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address, setAddress] = useState<string>("");
  const [amount, setAmount] = useState(0);

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function getFunds() {
    const toastId = toast.loading("Processing transaction...");

    setTimeout(() => {
      try {
        toast.update(toastId, {
          render: "✅ Success! 10 TRX has been deposited.",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          closeOnClick: true,
          draggable: true,
        });

        setBalance(10);
      } catch (error) {
        toast.update(toastId, {
          render: "❌ Something went wrong.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
          closeOnClick: true,
          draggable: true,
        });
        console.error("Error in getFunds:", error);
      }
    }, 3000);
  }

  const handleTransfer = () => {
    const amt = parseFloat(amount.toString());

    const isValidEvmAddress = /^0x[a-fA-F0-9]{40}$/.test(address);

    if (!address || !isValidEvmAddress) {
      toast.error("❌ Please enter a valid Celo address");
      return;
    }

    if (amt > balance) {
      toast.error("❌ Insufficient TRON balance");
      return;
    }

    const toastId = toast.loading("⏳ Simulating cross-chain transfer...");

    setTimeout(() => {
      setBalance((prev) => prev - amt);
      setCeloBalance((prev) => prev + amt);

      toast.update(toastId, {
        render: `✅ Successfully transferred ${amt} TRX to Celo address: ${shortenAddress(
          address
        )}`,
        type: "success",
        isLoading: false,
        autoClose: 4000,
      });

      setAmount(0);
      setAddress("");
      setIsModalOpen(false);
    }, 3000);
  };

  return (
    <div className={modalStyle.card} id="app">
      <div className={modalStyle.walletbtn}>
        <h1 className={modalStyle.h1}>Tron Wallet</h1>
        <div className={modalStyle.buttonOption}>
          <button onClick={getFunds} className={modalStyle.buttonOptionBtn}>
            <FaHandHoldingUsd /> Add Fund
          </button>
          <button onClick={openModal} className={modalStyle.buttonOptionBtn}>
            <FaArrowUp /> Send
          </button>
          <button className={modalStyle.buttonOptionBtn}>
            <FaArrowDown />
            Receive
          </button>
          <button className={modalStyle.buttonOptionBtn}>
            <FaArrowRightFromBracket /> Export
          </button>
          <button onClick={handleLogout} className={modalStyle.buttonOptionBtn}>
            LogOut☹️
          </button>
        </div>
      </div>

      <button
        className={modalStyle.address}
        onClick={() => copyAddress(tronAddress)}
      >
        {tronAddress ? shortenAddress(tronAddress) : "Fetching address..."}
        <MdContentCopy />
      </button>

      <div style={{ marginTop: "0.5rem" }}>
        <p style={{ fontSize: "2rem", fontWeight: "700" }}>
          ${(balance * 0.33).toFixed(2)}
        </p>
        <span style={{ fontSize: "0.8rem", color: "gray" }}>
          {balance.toFixed(2)} TRX
        </span>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className={modalStyle.centeredModal}
        overlayClassName={modalStyle.overlayBlur}
      >
        <button onClick={closeModal} className={modalStyle.closeButton}>
          &times;
        </button>
        <h3 className={modalStyle.heading}>Transfer from TRON → CELO</h3>

        <input
          className={modalStyle.input}
          type="text"
          placeholder="Enter CELO wallet address"
          value={address}
          onChange={(e: any) => setAddress(e.target.value)}
        />

        <input
          className={modalStyle.input}
          type="number"
          placeholder="Enter amount (e.g., 0.01)"
          value={amount}
          onChange={(e: any) => setAmount(e.target.value)}
        />

        <button className={modalStyle.button} onClick={handleTransfer}>
          Transfer
        </button>
      </Modal>
    </div>
  );
}
