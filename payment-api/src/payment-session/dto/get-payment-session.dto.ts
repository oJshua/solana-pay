import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class GetPaymentSessionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  paymentSessionId: string;
}
