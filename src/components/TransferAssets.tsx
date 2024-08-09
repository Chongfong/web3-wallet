import { useState } from 'react';
import { BaseError, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { Box, Button, TextField, Typography } from '@mui/material';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

export const TransferAssets = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<BaseError | undefined>();
  const { data: hash, isPending, sendTransaction } = useSendTransaction();

  const handleTransfer = async () => {
    try {
      await sendTransaction({
        to: `0x${recipient}`,
        value: parseEther(amount),
      });
    } catch (error) {
      setError(error as BaseError);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Typography variant="body2">TO:</Typography>
      <TextField
        type="text"
        placeholder="Recipient address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <Typography variant="body2">AMOUNT:</Typography>
      <TextField
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button onClick={handleTransfer} disabled={!recipient || !amount || isPending}>
        {isPending ? 'Confirming...' : <ArrowOutwardIcon />}
      </Button>
      <Box>
        {error && (
          <Typography color="error">Error: {error.message}</Typography>
        )}
        <Box>{hash && <Box>Transaction Hash: {hash}</Box>}</Box>
      </Box>
    </Box>
  );
};

