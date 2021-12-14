import { Body, Controller, Get, Res } from '@nestjs/common';
import { InstallRequestDto } from 'src/integrations/shopify/dto/install-request.dto';

const CLIENT_ID = '';

@Controller('integrations/shopify/onboarding')
export class OnboardingController {

  @Get('install')
  async function(@Body() body: InstallRequestDto, @Res() res) {



    return res.redirect(this.getShopifyUrl(
      body.shop
    ));
  }

  getShopifyUrl(shop: string) {
    return `https://${shop}.myshopify.com/admin/oauth/authorize?client_id=${CLIENT_ID}`;
  }
}
