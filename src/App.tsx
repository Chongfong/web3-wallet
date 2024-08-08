import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import {
  Button,
  Box,
  Modal,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { ERC20_TOKENS } from './constants';
import PieChartComponent from './PieChart';
import TransferAssets from './TransferAssets';
import { SwitchNetWork } from './SwitchNetwork';

function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const [usdPrices, setUsdPrices] = useState<{
    [key: string]: { usd: number };
  }>({});
  const fetchUsdPrices = () => {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,usd-coin&vs_currencies=usd')
      .then((data) => data.json())
      .then((price) => setUsdPrices(price));
  };

  useEffect(() => {
    fetchUsdPrices();
  }, []);

  const balance = useBalance({
    address: '0x6b175474e89094c44da98b954eedeac495271d0f', // account.address,
  });

  const [assets, setAssets] = useState<{
    id: number;
    value: number;
    label: string;
  }[]>([]);

  useEffect(() => {
    const usdPricesValue = usdPrices || {};
    setAssets([
      {
        id: 1,
        value: 10 * usdPricesValue.bitcoin?.usd || 0,
        label: 'BITCOIN',
      },
      {
        id: 2,
        value:
          (parseFloat(`${balance?.data?.value}`) / 10 ** 18) *
            usdPricesValue.ethereum?.usd ||
          0,
        label: 'Ethereum',
      },
      {
        id: 3,
        value: 20 * usdPricesValue['usd-coin']?.usd || 0,
        label: 'USD',
      },
    ]);
  }, [balance?.data?.value, usdPrices]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          borderRadius: '8px',
          border: '1px solid rgba(0,0,0,0.26)',
          padding: '24px',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <Typography variant='h5'>Connect Wallet</Typography>
        <Typography variant='body2' color="gray">
          Connect your cryptocurrency wallet to view your asset portfolio.
        </Typography>

        {account.status === "connected" && (
          <Typography variant='body2'>Address: {JSON.stringify(account.addresses).slice(2, -2)}</Typography>
        )}

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          padding={2}
        >
          {account.status !== "connected" ? (
            <Button
              variant="contained"
              sx={{ width: "200px" }}
              onClick={() => connect({ connector: connectors[3] })}
              type="button"
            >
              Connect Wallet
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{ width: "200px" }}
              type="button"
              onClick={() => disconnect()}
            >
              Disconnect
            </Button>
          )}
        </Box>
      </Box>

      {balance.data && Object.keys(usdPrices).length > 0 && (
        <div>
          {balance.data.formatted}
          {parseFloat(`${balance.data.value}`) / 10 ** 18 * usdPrices.ethereum.usd}
          {balance.data.symbol}

          <PieChartComponent data={assets} />
        </div>
      )}

      {Object.keys(usdPrices).length > 0 && (
        <div>
          <img src={ERC20_TOKENS[0].icon} />
          BITCOIN <p>bitcoin: {usdPrices?.bitcoin.usd}</p>
          <Button onClick={handleOpen}>Open modal</Button>

          <img src={ERC20_TOKENS[1].icon} />
          Ethereum <p>ethereum: {usdPrices?.ethereum.usd}</p>

          <img src={ERC20_TOKENS[2].icon} />
          USD <p>USD: {usdPrices?.['usd-coin'].usd}</p>
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

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TransferAssets />
        </Box>
      </Modal>

      {account.status === 'connected' && <SwitchNetWork />}
    </>
  );
}

export default App;

