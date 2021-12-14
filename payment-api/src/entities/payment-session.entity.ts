import {
  Column,
  Entity,
  Generated,
  ObjectID,
  ObjectIdColumn
} from 'typeorm';

import BigNumber from 'bignumber.js';

import { encodeURL } from '@solana/pay';
import { PublicKey } from '@solana/web3.js';

export interface PaymentOption {
  tokenMint?: string;
  tokenSymbol?: string;
  amount: BigNumber;
}

export interface PaymentInformation {
  recipient: string;
  reference: string;
  amount: BigNumber;
  label: string;
  paymentOptions: PaymentOption[];
}

@Entity()
export class PaymentSession {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  @Generated("uuid")
  paymentSessionId: string;

  @Column()
  integration?: string;

  @Column()
  meta: any;

  @Column()
  paymentInformation: PaymentInformation;

  static encodeBip(session: PaymentSession): string {
    return encodeURL(new PublicKey(session.paymentInformation.recipient), session.paymentInformation.amount, {
      references: [
        new PublicKey(session.paymentInformation.reference)
      ]
    });
  }
}
