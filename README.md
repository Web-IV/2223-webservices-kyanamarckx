# Examenopdracht Web Services

- Student: KYANA MARCKX
- Studentennummer: 202183241
- E-mailadres: kyana.marckx@student.hogent.be

## Vereisten

Ik verwacht dat volgende software reeds geïnstalleerd is:

- [NodeJS](https://nodejs.org)
- [Npm](https://www.npmjs.com)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)


## Opstarten

- Alles installeren: `npm install`

- Server starten: `npm start`

- .env: 
  
  `DATABASE_URL="mysql://183241km:8CoKkWpebejGcMRDZK4V@vichogent.be:40043/183241km"`

  `PORT=40043`

  `NODE_ENV=production`

  `AUTH_ISSUER='https://dev-tssp2kyfaa2lyu1y.us.auth0.com/'`

  `AUTH_AUDIENCE='https://vacay.kyana-hogent.be'`

  `AUTH_JWKS_URI='https://dev-tssp2kyfaa2lyu1y.us.auth0.com/.well-known/jwks.json'`

  `AUTH_USER_INFO="https://dev-tssp2kyfaa2lyu1y.us.auth0.com/userinfo"`

  `AUTH_TOKEN_URL=https://dev-tssp2kyfaa2lyu1y.us.auth0.com/oauth/token`

  `AUTH_TEST_USER_USER_ID=auth0|639f942faacda0152647fbbf`

  `AUTH_TEST_USER_USERNAME=e2e-testing@budgetapp.be`

  `AUTH_TEST_USER_PASSWORD=Test-123`

  `AUTH_TEST_USER_AUTH0ID=639f942faacda0152647fbbf`

  `AUTH_CLIENT_ID=sJUibowqneIEBIvxyeLQd869uivdTHuP`

  `AUTH_CLIENT_SECRET=akPiwhNalFp6QXm8LlP7s38cCxoI5SP4pCropiZNKjBZ_kI0isxsN6UlwVkvsji4`

## Testen

De files moeten elk apart gerunned worden, anders doet de testuser te veel requests en wordt die geblocked door Auth0 en geeft Axios een 429 ERROR Too Many Requests terug.

### reiziger.test.ts

`npm run test:reiziger`

### bestemming.test.ts

`npm run test:bestemming`

### vervoermsiddel.test.ts

`npm run test:vervoersmiddel`

### verplaatsing.test.ts

`npm run test:verplaatsing`
