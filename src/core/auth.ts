import { auth } from 'express-oauth2-jwt-bearer';
import axios from 'axios'
import config from 'config';
import { $log as logger } from "ts-log-debug"


const AUTH_USER_INFO: string = config.get('auth.userInfo');

export const checkJwt = auth({
  audience: config.get('auth.audience'),
  issuerBaseURL: config.get('auth.issuer'),
});


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

