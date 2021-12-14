import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-oauth2';

@Injectable()
export class ShopifyStrategy extends PassportStrategy(Strategy, 'shopify')
{
	constructor() {
		super({
			authorizationURL: null,
			tokenURL        : null,
			clientID        : null,
			clientSecret    : null,
			callbackURL     : null,
			scope           : null,
		});
	}

	async validate(
		accessToken: string,
	): Promise<any> {

	}
}
  