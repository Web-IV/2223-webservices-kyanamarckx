const jwks = require('jwks-rsa')
import { expressjwt as jwt} from 'express-jwt';
import { auth, requiredScopes } from 'express-oauth2-jwt-bearer';
import axios from 'axios'
import config from 'config';
import { $log as logger } from "ts-log-debug";
import { NextFunction, Request, Response } from 'express';


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


export function hasPermission(ctx: any, perm: string) {
  try {
    let answer;
    const input = ctx.auth.scope;


    if(input.includes(perm)) {
      answer = true;
    }
    else {
      answer = false;
    }

    return answer;
  } catch (error) {
    logger.error("Something went wrong when checking permissions", { error });
    throw error;
  }
}














// export function hasPermission(join: String, perm: string) {
//   try {
//     let answer;
//     // const input = user;

//     const permget = join;

//     // if(permget.includes("write") && perm == "write") {
//     //   logger.debug("User has write permission", { permget, perm })
//     //   answer = true;
//     // }
//     // else if(permget.includes("read") && perm == "write") {
//     //   logger.debug("User has read permission, but needs write permission", { permget, perm })
//     //   answer = false;
//     // }
//     // else if(permget.includes("read") && perm == "read") {
//     //   logger.debug("User has read permission", { permget, perm })
//     //   answer = true;
//     // }
//     // if(join.includes('write')) {
//     //   if(perm === "write") {
//     //     logger.debug("User has write permission", { permget, perm })
//     //     answer = true;
//     //   }
      
//     // }
//     // else {
//     //   answer = false;
//     // }

//     // join = join.toString();


//     if(join.includes(perm)) {
//       logger.debug("User has permission", { join, perm })
//       answer = true;
//     }
//     else {
//       logger.debug("User does not have permission", { join, perm })
//       answer = false;
//     }

  

//     return answer;
    
//   }catch (error) {
//     logger.error("Something went wrong when checking the permissions", { error });
//     throw error;
//   }

// }






// export function hasPermission(perm: string) {

//   try {
//     let answer;
//     async (ctx: any) => {
//       let res;
//       // const input = getScope(ctx);
//       const input = ctx.auth.scope;
//       logger.debug(input);

//       // if(input.includes(perm)) {
//       //   logger.debug("User has permission", { input, perm })
//       //   answer = true;
//       // }
//       // else {
//       //   logger.debug("User does not have permission", { input, perm })
//       //   answer = false;
//       // }

//       if(input.includes("write") && perm == "write") {
//         logger.debug("User has write permission", { input, perm })
//         res = true;
//       }
//       else if(input.includes("read") && perm == "write") {
//         logger.debug("User has read permission, but needs write permission", { input, perm })
//         res = false;
//       }
//       else if(input.includes("read") && perm == "read") {
//         logger.debug("User has read permission", { input, perm })
//         res = true;
//       }
    
//      return res;
//     }
    
//     return answer;
    

//   }catch (error) {
//     logger.error("Something went wrong when checking the permissions", { error });
//     throw error;
//   }
// }

// export function getScope(ctx: any) {
//   try {
//     let scope = ctx.auth.scope;
//     return scope;
//   } catch (error) {
//     logger.error("Something went wrong when getting the scope", { error });
//     throw error;
//   }
// }