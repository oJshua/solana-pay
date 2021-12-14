import React from "react";
import { PaymentOption, usePaymentSession } from "../../providers/PaymentSessionProvider";
import { SendPayment } from "./SendPayment";

export function PaymentOptions() {
  const { paymentInformation } = usePaymentSession();
  return (
    <>
      {paymentInformation.paymentOptions.map((option) => {
        return <SendPayment key={getKey(option)} paymentOption={option} />
      })}
    </>
  );
};

function getKey(paymentOption: PaymentOption) {
  return paymentOption.amount + (paymentOption.tokenMint || '');
}
