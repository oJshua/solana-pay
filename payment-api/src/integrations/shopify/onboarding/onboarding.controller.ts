import { Body, Controller, Get, Query, Res } from '@nestjs/common';
import { InstallRequestDto } from 'src/integrations/shopify/dto/install-request.dto';

@Controller('integrations/shopify/onboarding')
export class OnboardingController {

  @Get('install')
  async install(@Query() { shop }: InstallRequestDto, @Res() res) {
    return res.redirect(this.getShopifyUrl(
      shop
    ));
  }

  @Get('redirect')
  async redirect(@Query() test: any, @Res() res) {
    console.log(test);
    return true;
  }

  getShopifyUrl(shop: string) {
    let url = `https://${shop}.myshopify.com/admin/oauth/authorize?`;
    url += `client_id=${process.env.SHOPIFY_API_KEY}`
    url += `&scope=write_payment_gateways,write_payment_sessions`;
    url += `&redirect_uri=${process.env.BACKEND_URL}/v1/integrations/shopify/onboarding/redirect`;
    url += `&nonce=${Math.floor(Math.random() * 10000000)}`;
    url += `&grant_options[]=value`;

    return url;
  }
}
