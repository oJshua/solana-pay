import React, { useEffect, useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PaymentOptions } from "./payment/PaymentOptions";
import { usePaymentSession, usePaymentStatus } from "../providers/PaymentSessionProvider";
import fetch from 'cross-fetch';
import { createQR } from '@solana/pay';
import parse from 'html-react-parser';

const POLL_INTERVAL = 5000;

export function Payment() {
  const { paymentSessionId, paymentUrl } = usePaymentSession();
  const { publicKey } = useWallet();
  const [ signature, setSignature ] = useState(null);
  const { setPaymentStatus } = usePaymentStatus();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const check = await fetch(`${process.env.REACT_APP_PAYMENTS_API_URL}/v1/payment-session/check?paymentSessionId=${paymentSessionId}`);
        setSignature(await check.json());
      } catch(error) {

      }
    }, POLL_INTERVAL);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (signature) {
      setPaymentStatus("complete");
    }
  }, [signature, setPaymentStatus]);

  const qrCode = useMemo(() => {
    const qr = createQR(paymentUrl);
    return parse(qr);
  }, [paymentUrl]);

  return (
    <div className="flex-container">
      <h2>SolPay</h2>

      {!publicKey && <h3>Connect a wallet or scan the QR code below to send a payment.</h3>}

      <div className="qr">
        {qrCode}
      </div>

      <div className="row">
        {!publicKey && <WalletMultiButton />}
        {publicKey && <WalletDisconnectButton />}
        <PaymentOptions />
      </div>
    </div>
  );
}
