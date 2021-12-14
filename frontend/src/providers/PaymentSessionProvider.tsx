import React, { useEffect, useState } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { useQuery } from "../utils/url";
import jwktopem from 'jwk-to-pem';
import jwt from 'jsonwebtoken';
import fetch from 'cross-fetch';
import { BigNumber } from 'bignumber.js';

export interface PaymentOption {
  tokenMint?: string;
  tokenSymbol?: string;
  amount: BigNumber;
}

export interface PaymentInformation {
  recipient: string;
  reference: string;
  paymentOptions: PaymentOption[];
}

export type PaymentSession = {
  paymentSessionId: string;
  paymentInformation: PaymentInformation;
  paymentUrl: string;
};

export type PaymentStatus = "incomplete" | "canceled" | "complete" | "errored";

const PaymentSessionContext = React.createContext<PaymentSession | undefined>(undefined);

const PaymentStatusContext = React.createContext<{
  paymentStatus: PaymentStatus,
  setPaymentStatus: Function
} | undefined>(undefined);

type PaymentScopeProviderProps = { children: React.ReactNode };

export function PaymentSessionProvider({ children }: PaymentScopeProviderProps) {
  const paymentSessionId = useQuery().get('paymentSessionId');
  const location = useLocation();

  const [decoded, setDecoded] = useState<undefined | PaymentSession>(undefined);
  const [sessionEstablished, setSessionEstablished] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("incomplete");

  useEffect(() => {
    (async () => {
      try {
        if (paymentSessionId) {
          delete sessionStorage['jwt'];
        }

        const jwksRequest = await fetch(`${process.env.REACT_APP_PAYMENTS_API_URL}/v1/jwks.json`);
        const jwks = await jwksRequest.json();
        const [key] = jwks.keys;
        const publicKey = jwktopem(key);

        let token = sessionStorage['jwt'];

        if (!token && !paymentSessionId) {
          return setPaymentStatus("errored");
        }

        if (!token) {
          const jwtRequest = await fetch(`${process.env.REACT_APP_PAYMENTS_API_URL}/v1/payment-session?paymentSessionId=${paymentSessionId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          token = await jwtRequest.text();
        }

        const decoded = jwt.verify(token, publicKey) as PaymentSession

        sessionStorage['jwt'] = token;

        setDecoded(decoded);
        setSessionEstablished(true);
      } catch (error) {
        console.log(error);
        setPaymentStatus("errored");
      }
    })()
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (paymentStatus === "errored") {
    return (
      <Redirect to="/error" push />
    );
  }

  if (paymentStatus === "complete") {
    delete sessionStorage['jwt'];
    return (
      <Redirect to="/success" />
    );
  }

  if (!sessionEstablished) {
    return null;
  }

  if (sessionEstablished && location.pathname !== '/pay') {
    return (
      <Redirect to="/pay" push />
    );
  }

  return (
    <PaymentSessionContext.Provider value={decoded}>
      <PaymentStatusContext.Provider value={{ paymentStatus, setPaymentStatus }}>
        {children}
      </PaymentStatusContext.Provider>
    </PaymentSessionContext.Provider>
  );
}

export function usePaymentSession(): PaymentSession {
  const context = React.useContext(PaymentSessionContext);
  if (!context) {
    throw new Error('usePaymentSession must be used within a PaymentSessionProvider');
  }
  return context;
}

export function usePaymentStatus() {
  const context = React.useContext(PaymentStatusContext);
  if (!context) {
    throw new Error('usePaymentStatus must be used within a PaymentSessionProvider');
  }
  return context;
}
