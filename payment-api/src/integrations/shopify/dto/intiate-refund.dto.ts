import { ApiProperty } from "@nestjs/swagger";

export class InitiateRefundDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  gid: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  merchant_locale: string;

  @ApiProperty()
  proposed_at: string;
}
