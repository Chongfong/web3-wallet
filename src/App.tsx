import { Box } from '@mui/material';
import { WalletInfo } from './WalletInfo';
import { AssetList } from './AssetList';
import { AssetValue } from './AssetValue';
import { Provider } from 'react-redux';
import store from './store'

function App() {

  return (
    <Provider store={store}>
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
    </Provider>
  );
}

export default App;

