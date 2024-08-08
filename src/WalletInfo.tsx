import { Box, Button, Typography } from '@mui/material';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export const WalletInfo = () => {
  const account = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <Box
      sx={{
        display: 'flex',
        borderRadius: '8px',
        border: '1px solid rgba(0, 0, 0, 0.26)',
        padding: '24px',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <Typography variant='h5'>{account.status === 'connected' ? 'Wallet Info' : 'Connect Wallet'}</Typography>
      <Typography variant='body2' color="gray">
        {account.status !== 'connected' && 'Connect your cryptocurrency wallet to view your asset portfolio.'}
      </Typography>

      {account.status === 'connected' && (
        <Typography variant='body2'>Address: {JSON.stringify(account.addresses).slice(2, -2)}</Typography>
      )}

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
