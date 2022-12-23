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
```  
  DATABASE_URL=

  PORT=

  NODE_ENV=

  AUTH_ISSUER=

  AUTH_AUDIENCE=

  AUTH_JWKS_URI=

  AUTH_USER_INFO=

  AUTH_TOKEN_URL=

  AUTH_TEST_USER_USER_ID=

  AUTH_TEST_USER_USERNAME=

  AUTH_TEST_USER_PASSWORD=

  AUTH_TEST_USER_AUTH0ID=

  AUTH_CLIENT_ID=

  AUTH_CLIENT_SECRET=
```

## Testen

De files moeten elk apart gerunned worden, anders doet de testuser te veel requests en wordt die geblocked door Auth0 en geeft Axios een 429 ERROR Too Many Requests terug.

### reiziger.test.ts

`npm run test:reiziger`

### bestemming.test.ts

`npm run test:bestemming`

### vervoersmiddel.test.ts

`npm run test:vervoersmiddel`

### verplaatsing.test.ts

`npm run test:verplaatsing`


## Extra

Er is ook een html file aanwezig van dossier.md waar je het dossier als een website kunt bekijken.
