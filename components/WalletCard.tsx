import { useWallet } from "@/hooks/useWallet";
import { shortenAddress } from "@/lib/utils/addressShort";
import { copyAddress } from "@/lib/utils/copyAddress";
import style from "@/styles/ModalStyles.module.css";
import { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp, FaHandHoldingUsd } from "react-icons/fa";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { MdContentCopy } from "react-icons/md";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { onError } from "@/lib/utils/onError";

// Bind modal to your app root
//Modal.setAppElement("#app");

export function WalletCard() {
  const {
    loading,
    walletAddress, // This is now WalletAddress[]
    refreshWallet,
    getAccountAddress,
    handleLogout,
  } = useWallet();

  // State for wallet selection
  const [selectedWalletType, setSelectedWalletType] = useState<
    "ETHEREUM" | "TRON"
  >("TRON");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [tronBalance, setTronBalance] = useState(0.0);
  const [ethBalance, setEthBalance] = useState(0.0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address, setAddress] = useState<string>("");
  const [amount, setAmount] = useState(0);

  // Get the current wallet address based on selected type
  const currentAddress =
    walletAddress?.find(
      (addr) => addr.addressFormat === `ADDRESS_FORMAT_${selectedWalletType}`
    )?.address || "";

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle wallet type selection
  const handleWalletTypeChange = (walletType: "ETHEREUM" | "TRON") => {
    setSelectedWalletType(walletType);
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.querySelector(".dropdown-container");
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        if (!loading && !currentAddress) {
          const addresses = await getAccountAddress();
          

          if (!addresses || addresses.length === 0) {
            // If no addresses are found, try refreshing the wallet
            await refreshWallet();
          }
        }
      } catch (error) {
        onError(error);
      }
    };
    fetchAddress();
  }, [loading, currentAddress, getAccountAddress, refreshWallet]);

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
        if (selectedWalletType === "TRON") {
          toast.update(toastId, {
            render: "✅ Success! 0.001 TRX has been deposited.",
            type: "success",
            isLoading: false,
            autoClose: 3000,
            closeOnClick: true,
            draggable: true,
          });

          setTronBalance(10);
        } else {
          toast.update(toastId, {
            render: "✅ Success! 0.001 ETH has been deposited.",
            type: "success",
            isLoading: false,
            autoClose: 3000,
            closeOnClick: true,
            draggable: true,
          });

          setEthBalance(0.001);
        }
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

    if (isNaN(amt) || amt <= 0) {
      toast.error("❌ Please enter a valid amount");
      return;
    }

    if (!address) {
      toast.error("❌ Please enter a recipient address");
      return;
    }

    // Validate address based on selected wallet type
    let isValidAddress = false;
    let currentBalance = 0;
    let currency = "";

    if (selectedWalletType === "TRON") {
      // TRON address validation (starts with T + 33 characters total, base58 encoded)
      isValidAddress = /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address);
      currentBalance = tronBalance;
      currency = "TRX";

      if (!isValidAddress) {
        toast.error("❌ Please enter a valid TRON address");
        return;
      }
    } else if (selectedWalletType === "ETHEREUM") {
      // Ethereum address validation (0x + 40 hex characters)
      isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(address);
      currentBalance = ethBalance;
      currency = "ETH";

      if (!isValidAddress) {
        toast.error("❌ Please enter a valid Ethereum address");
        return;
      }
    }

    // Check balance
    if (amt > currentBalance) {
      toast.error(
        `❌ Insufficient ${currency} balance. Available: ${currentBalance} ${currency}`
      );
      return;
    }

    const toastId = toast.loading(
      `⏳ Simulating ${selectedWalletType} transfer...`
    );

    setTimeout(() => {
      // Deduct amount from appropriate balance
      if (selectedWalletType === "TRON") {
        setTronBalance((prev) => prev - amt);
      } else if (selectedWalletType === "ETHEREUM") {
        setEthBalance((prev) => prev - amt);
      }

      toast.update(toastId, {
        render: `✅ Successfully transferred ${amt} ${currency} to ${selectedWalletType} address: ${shortenAddress(
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
    <div className={style.card} id="app">
      <div className={style.walletButton}>
        <div style={{ position: "relative" }} className="dropdown-container">
          <button
            onClick={toggleDropdown}
            className={`${style.h1} ${style.dropdownButton}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              border: "1px solid #333",
              borderRadius: "8px",
              padding: "6px 8px",
              backgroundColor: "#1a1a1a",
              color: "#fff",
              minWidth: "200px",
            }}
          >
            {selectedWalletType} Wallet
            <span style={{ marginLeft: "8px", fontSize: "0.8rem" }}>
              {isDropdownOpen ? "▲" : "▼"}
            </span>
          </button>

          {isDropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "0",
                right: "0",
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "8px",
                borderTop: "none",
                borderTopLeftRadius: "0",
                borderTopRightRadius: "0",
                zIndex: 1000,
                boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
              }}
            >
              <button
                onClick={() => handleWalletTypeChange("ETHEREUM")}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor:
                    selectedWalletType === "ETHEREUM" ? "#333" : "transparent",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  borderBottom: "1px solid #333",
                }}
                onMouseEnter={(e) => {
                  if (selectedWalletType !== "ETHEREUM") {
                    (e.target as HTMLElement).style.backgroundColor = "#2a2a2a";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedWalletType !== "ETHEREUM") {
                    (e.target as HTMLElement).style.backgroundColor =
                      "transparent";
                  }
                }}
              >
                ETHEREUM Wallet
              </button>
              <button
                onClick={() => handleWalletTypeChange("TRON")}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor:
                    selectedWalletType === "TRON" ? "#333" : "transparent",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  if (selectedWalletType !== "TRON") {
                    (e.target as HTMLElement).style.backgroundColor = "#2a2a2a";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedWalletType !== "TRON") {
                    (e.target as HTMLElement).style.backgroundColor =
                      "transparent";
                  }
                }}
              >
                TRON Wallet
              </button>
            </div>
          )}
        </div>
        <div className={style.buttonOption}>
          <button onClick={getFunds} className={style.buttonOptionBtn}>
            <FaHandHoldingUsd /> Add Fund
          </button>
          <button onClick={openModal} className={style.buttonOptionBtn}>
            <FaArrowUp /> Send
          </button>
          <button className={style.buttonOptionBtn}>
            <FaArrowDown />
            Receive
          </button>
          <button className={style.buttonOptionBtn}>
            <FaArrowRightFromBracket /> Export
          </button>
          <button onClick={handleLogout} className={style.buttonOptionBtn}>
            LogOut☹️
          </button>
        </div>
      </div>

      <button
        className={style.address}
        onClick={() => copyAddress(currentAddress)}
      >
        {currentAddress
          ? shortenAddress(currentAddress)
          : "Fetching address..."}
        <MdContentCopy style={{ marginLeft: "0.2rem", fontWeight: 700 }} />
      </button>

      <div style={{ marginTop: "0.5rem" }}>
        <p style={{ fontSize: "2rem", fontWeight: "700" }}>
          $
          {
            selectedWalletType === "TRON"
              ? (tronBalance * 0.1).toFixed(2) // TRX price approximation
              : (ethBalance * 3923.84).toFixed(2) // ETH price
          }
        </p>
        <span style={{ fontSize: "0.8rem", color: "gray" }}>
          {selectedWalletType === "TRON"
            ? `${tronBalance} TRX`
            : `${ethBalance} ETH`}
        </span>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className={style.centeredModal}
        overlayClassName={style.overlayBlur}
      >
        <button onClick={closeModal} className={style.closeButton}>
          &times;
        </button>
        <h3 className={style.heading}>
          Transfer from {selectedWalletType} Wallet
        </h3>

        <input
          className={style.input}
          type="text"
          placeholder={`Enter ${selectedWalletType} wallet address`}
          value={address}
          onChange={(e: any) => setAddress(e.target.value)}
        />

        <input
          className={style.input}
          type="number"
          placeholder={`Enter amount (Available: ${
            selectedWalletType === "TRON" ? tronBalance : ethBalance
          } ${selectedWalletType === "TRON" ? "TRX" : "ETH"})`}
          value={amount}
          onChange={(e: any) => setAmount(e.target.value)}
        />

        <button className={style.button} onClick={handleTransfer}>
          Transfer {selectedWalletType === "TRON" ? "TRX" : "ETH"}
        </button>
      </Modal>
    </div>
  );
}
