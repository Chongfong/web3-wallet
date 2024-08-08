import { useState } from 'react';
import { BaseError, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';

const TransferAssets = () => {
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
    <div>
      <input
        type="text"
        placeholder="Recipient address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleTransfer} disabled={!recipient || !amount || isPending}>
        {isPending ? 'Confirming...' : 'Send'}
      </button>
      {error && <div>Error: {error.message}</div>}
      <div>{hash && <div>Transaction Hash: {hash}</div>}</div>
    </div>
  );
};

export default TransferAssets;

