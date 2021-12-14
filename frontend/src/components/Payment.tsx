import React, { useEffect, useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PaymentOptions } from "./payment/PaymentOptions";
import { usePaymentSession, usePaymentStatus } from "../providers/PaymentSessionProvider";
import fetch from 'cross-fetch';
import { createQR } from '@solana/pay';
import parse from 'html-react-parser';
import Loader from "react-loader-spinner";

const POLL_INTERVAL = 2500;

export function Payment() {
  const { paymentSessionId, paymentUrl } = usePaymentSession();
  const { publicKey } = useWallet();
  const { paymentStatus, setPaymentStatus, signature, setSignature } = usePaymentStatus();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const check = await fetch(`${process.env.REACT_APP_PAYMENTS_API_URL}/v1/payment-session/check?paymentSessionId=${paymentSessionId}`);
        const sig = await check.json();
        setSignature(sig.signature);
      } catch (error) {

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

      {paymentStatus !== "submitted" ?
        <div className="qr">
          {qrCode}
        </div>
        :
        <div className="loader">
          <Loader type="Rings"
            color="#00BFFF"
            height={192}
            width={192}
          />
        </div>
      }

      <div className="row">
        {!publicKey && <WalletMultiButton />}
        {publicKey && <WalletDisconnectButton />}
        <PaymentOptions />
      </div>
    </div>
  );
}
