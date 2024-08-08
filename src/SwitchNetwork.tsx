import { MenuItem, Select } from "@mui/material";
import { mainnet, sepolia } from "wagmi/chains";

export const SwitchNetWork = () => (
  <div>
    <h2>Switch Network</h2>
    <Select
      defaultValue=""
      onChange={(e) => handleSwitchNetwork(Number(e.target.value))}
    >
      <MenuItem value={mainnet.id}>Ethereum Mainnet</MenuItem>
      <MenuItem value={sepolia.id}>Sepolia Testnet</MenuItem>
    </Select>
  </div>
);

const handleSwitchNetwork = async (chainId: number) => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
          },
        ],
      });
    } catch (switchError) {
      if ((switchError as any).code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${chainId.toString(16)}`,
                rpcUrl:
                  chainId === mainnet.id
                    ? mainnet.rpcUrls.default
                    : sepolia.rpcUrls.default,
              },
            ],
          });
        } catch (addError) {
          console.error(addError);
        }
      } else {
        console.error(switchError);
      }
    }
  } else {
    console.error("Ethereum object not found");
  }
};

