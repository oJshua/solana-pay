import { ApiProperty } from "@nestjs/swagger";

export class InstallRequestDto {
  @ApiProperty()
  shop: string;

  @ApiProperty()
  timestamp: string;

  @ApiProperty()
  hmac: string;
}
