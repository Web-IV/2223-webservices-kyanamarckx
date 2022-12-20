module.exports = {
  env: 'NODE_ENV',
  auth: {
    jwksUri: 'AUTH_JWKS_URI',
    audience: 'AUTH_AUDIENCE',
    issuer: 'AUTH_ISSUER',
    userInfo: 'AUTH_USER_INFO',
    tokenUrl: 'AUTH_TOKEN_URL',
    clientId: 'AUTH_CLIENT_ID',
    clientSecret: 'AUTH_CLIENT_SECRET',
    testUser: {
      userId: 'AUTH_TEST_USER_USER_ID',
      username: 'AUTH_TEST_USER_USERNAME',
      password: 'AUTH_TEST_USER_PASSWORD',
      auth0id: 'AUTH_TEST_USER_AUTH0ID',
    },
  },
};

