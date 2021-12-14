import React from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@solana/wallet-adapter-react-ui/lib/Button";
import { PublicKey } from "@solana/web3.js";
import { BigNumber } from "bignumber.js";
import { PaymentOption, usePaymentSession, usePaymentStatus } from "../../providers/PaymentSessionProvider";
import { createTransaction } from "@solana/pay";

export function SendPayment(
  { paymentOption }: {
    paymentOption: PaymentOption
  }
) {
  const session = usePaymentSession();
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { setPaymentStatus } = usePaymentStatus();

  let symbol;

  if (!paymentOption.tokenMint) {
    symbol = 'SOL'
  } else if (paymentOption.tokenMint && paymentOption.tokenSymbol) {
    symbol = paymentOption.tokenSymbol;
  } else if (paymentOption.tokenMint) {
    symbol = 'Unknown Token';
  }

  const sendPayment = async () => {
    if (!publicKey) {
      return;
    }

    try {
      const transaction = await createTransaction(
        connection,
        publicKey,
        new PublicKey(session.paymentInformation.recipient),
        new BigNumber(paymentOption.amount),
        {
          references: [new PublicKey(session.paymentInformation.reference)]
        }
      );

      const res = await sendTransaction(transaction, connection);

      setPaymentStatus("submitted");

      console.log(res);
    } catch (error) {

    }
  };


  return (
    <Button onClick={() => sendPayment()} disabled={!publicKey} key={paymentOption.amount + (paymentOption.tokenMint || '')}>Send {paymentOption.amount} {symbol}</Button>
  );
}
