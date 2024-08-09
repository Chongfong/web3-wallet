import { Box, MenuItem, Select, Typography } from "@mui/material";
import { mainnet, sepolia } from "wagmi/chains";

export const SwitchNetWork = () => (
  <Box marginTop={2}>
    <Typography variant="h6">Switch Network</Typography>
    <Select
      defaultValue=""
      displayEmpty
      renderValue={(selected) =>
        selected === "" ? <em>Switch Network</em> : Number(selected) === mainnet.id ? "Ethereum Mainnet" : "Sepolia Testnet"
      }
      onChange={(e) => handleSwitchNetwork(Number(e.target.value))}
    >
      <MenuItem value={mainnet.id}>Ethereum Mainnet</MenuItem>
      <MenuItem value={sepolia.id}>Sepolia Testnet</MenuItem>
    </Select>
  </Box>
);

const handleSwitchNetwork = async (chainId: number) => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (switchError) {
      if ((switchError as any).code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${chainId.toString(16)}`,
                rpcUrl: chainId === mainnet.id ? mainnet.rpcUrls.default : sepolia.rpcUrls.default,
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

