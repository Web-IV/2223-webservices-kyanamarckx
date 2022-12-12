const jwks = require('jwks-rsa')
import { expressjwt as jwt} from 'express-jwt';
import axios from 'axios'
import config from 'config';
import { $log as logger } from "ts-log-debug";
import { string } from 'joi';

const AUTH_USER_INFO: string = config.get('auth.userInfo');

function getJwtSecret() {
  try {
    let secretFunction = jwks.expressJwtSecret({
      jwksUri: config.get('auth.jwksUri'),
      cache: true,
      cacheMaxEntries: 5,
      
    });
    return secretFunction;
  } catch (error) {
    logger.error("Something went wrong when handling the JWT secret", { error });
    throw error;
  }
}

export function checkJwtToken() {
  try {
    let secretFunction = getJwtSecret();
    return jwt({
      secret: secretFunction,
      audience: config.get('auth.audience'),
      issuer: config.get('auth.issuer'),
      algorithms: ['RS256'],
  });
  }catch (error) {
    logger.error("Something went wrong when checking the JWT token", { error });
    throw error;
  }
}

export async function addUserInfo(ctx: any) {
	try {
		const token = ctx.headers.authorization;
		const url = AUTH_USER_INFO;
		if (token && url && ctx.auth) {
			logger.debug(`addUserInfo: ${url}, ${JSON.stringify(token)}`);

			const userInfo = await axios.get(url, {
        headers: {
          Authorization: token,
        },
      });

			ctx.auth = {
				...ctx.auth,
				...userInfo.data,
			};
		}
	} catch (error) {
		logger.error('Something went wrong when fetching user info', { error });
		throw error;
	}
}