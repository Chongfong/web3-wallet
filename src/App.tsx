import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains';
import { Select, MenuItem } from '@mui/material';

function App() {
  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()

  const handleSwitchNetwork = async (chainId: number) => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
      } catch (switchError) {
        if ((switchError as any).code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
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
      console.error('Ethereum object not found');
    }
  };

  const balance = useBalance({
    address: account.address,
  })

  return (
    <>
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === 'connected' && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      {balance.data && (
        <div>
          {balance.data.formatted} {balance.data.symbol}
        </div>
      )}

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>

      {account.status === 'connected' && (
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
      )}
    </>
  )
}

export default App
