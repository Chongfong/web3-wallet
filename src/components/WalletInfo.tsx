import { Box, Button, Typography } from '@mui/material';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { SwitchNetWork } from './SwitchNetwork';
import { setAccount } from '../store/assetsSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

export const WalletInfo = () => {
  const dispatch = useDispatch();
  const account = useAccount();

  useEffect(() => {
    if (account) {
      dispatch(setAccount(account));
    }
  }, [account]);

  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <Box
      display="flex"
      borderRadius="8px"
      border="1px solid rgba(0, 0, 0, 0.26)"
      padding={3}
      flexDirection="column"
      gap={1}
    >
      <Typography variant="h5">
        {account.status === 'connected' ? 'Wallet Info' : 'Connect Wallet'}
      </Typography>
      <Typography variant="body2" color="gray">
        {account.status !== 'connected' &&
          'Connect your cryptocurrency wallet to view your asset portfolio.'}
      </Typography>

      {account.status === 'connected' && (
        <Box display='flex' alignItems='center' gap={1}>
          <AccountBalanceWalletIcon/> 
          <Typography variant="body2">
            {JSON.stringify(account.addresses).slice(2, -2)}
          </Typography>
        </Box>
      )}

      {account.status === 'connected' && <SwitchNetWork />}

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        padding={2}
      >
        {account.status !== 'connected' ? (
          <Button
            variant="contained"
            sx={{ width: '200px' }}
            onClick={() => connect({ connector: connectors[3] })}
            type="button"
          >
            <AccountBalanceWalletIcon/> 
            Connect Wallet
          </Button>
        ) : (
          <Button
            variant="contained"
            sx={{ width: '200px' }}
            type="button"
            onClick={() => disconnect()}
          >
            Disconnect
          </Button>
        )}
      </Box>
    </Box>
  );
};

