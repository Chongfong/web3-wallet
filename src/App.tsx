import { useAccount } from 'wagmi';
import { Box } from '@mui/material';
import { SwitchNetWork } from './SwitchNetwork';
import { WalletInfo } from './WalletInfo';
import { AssetList } from './AssetList';
import { AssetValue } from './AssetValue';

function App() {
  const account = useAccount();

  return (
    <Box
      display="flex"
      justifyContent="center"
      gap={3}
      width="100%"
      flexDirection="column"
    >
      <WalletInfo />
      <Box
        display="flex"
        justifyContent="center"
        gap={3}
        width="100%"
        flexDirection="row"
      >
        <AssetList />
        <AssetValue />
      </Box>
      {account.status === 'connected' && <SwitchNetWork />}
    </Box>
  );
}

export default App;

