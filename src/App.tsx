import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains';
import { Select, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import { ERC20_TOKENS } from './constants';
import PieChartComponent from './PieChart';

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

  const [usdPrices, setUsdPrices] = useState<{ [key: string]: { usd: number } }>({});
  const fetchUsdPrices = () => {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,usd-coin&vs_currencies=usd')
    .then((data) => data.json())
    .then((price) => setUsdPrices(price))
  }

  useEffect(() => {
    fetchUsdPrices();
  }, []);

  const balance = useBalance({
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',// account.address,
  })

  const [assets, setAssets] = useState<{id: number, value: number, label: string}[]>([]);

  useEffect(() => {
    const usdPricesValue = usdPrices || {};
    setAssets([
      { id: 1, value: 10 * usdPricesValue.bitcoin?.usd || 0, label: 'BITCOIN' },
      { id: 2, value: (parseFloat(`${balance?.data?.value}`) / 10 ** 18 * usdPricesValue.ethereum?.usd) || 0, label: 'Ethereum' },
      { id: 3, value: 20 * usdPricesValue['usd-coin']?.usd || 0, label: 'USD' },
    ]);
  }, [balance?.data?.value, usdPrices]);

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

      {balance.data &&  Object.keys(usdPrices).length &&(
        <div>
          {balance.data.formatted} {parseFloat(`${balance.data.value}`) / 10 ** 18 * usdPrices.ethereum.usd} {balance.data.symbol}
          <PieChartComponent data={assets} />
        </div>
      )}
{Object.keys(usdPrices).length&& (
<div>
  <img src={ERC20_TOKENS[0].icon}/> BITCOIN <p>bitcoin: {usdPrices?.bitcoin.usd}</p>
  <img src={ERC20_TOKENS[1].icon}/> Ethereum <p>ethereum: {usdPrices?.ethereum.usd}</p>
  <img src={ERC20_TOKENS[2].icon}/> USD <p>USD: {usdPrices?.['usd-coin'].usd}</p>
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
