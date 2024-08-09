import { Box } from '@mui/material';
import { WalletInfo } from './WalletInfo';
import { AssetList } from './AssetList';
import { AssetValue } from './AssetValue';


function App() {

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
    </Box>
  );
}

export default App;

