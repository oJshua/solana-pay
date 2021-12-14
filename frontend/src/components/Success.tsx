import React from 'react';
import { useQuery } from '../utils/url';

export function Success() {
  const signature = useQuery().get('signature');
  return (
    <div className="flex-container">
      <h1>Payment completed successfully.</h1>
      <a href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`} target="_blank" rel="noreferrer">View in Explorer.</a>
    </div>
  );
}
