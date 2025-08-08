type Curve = "CURVE_SECP256K1";
type PathFormat = "PATH_FORMAT_BIP32";
type Path = "m/44’/195’/0’/0/0" | "m/44’/60’/0’/0/0";
type AddressFormat = "ADDRESS_FORMAT_TRON" | "ADDRESS_FORMAT_ETHEREUM";

interface WalletConfig {
  curve: Curve;
  pathFormat: PathFormat;
  path: Path;
  addressFormat: AddressFormat;
}

export interface WalletDerivationConfig {
  tron: WalletConfig & { addressFormat: "ADDRESS_FORMAT_TRON" } & {
    path: "m/44’/195’/0’/0/0";
  };
  ethereum: WalletConfig & { addressFormat: "ADDRESS_FORMAT_ETHEREUM" } & {
    path: "m/44’/60’/0’/0/0";
  };
}
