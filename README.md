# Examenopdracht Web Services

> Schrap hierboven wat niet past

- Student: KYANA MARCKX
- Studentennummer: 202183241
- E-mailadres: kyana.marckx@student.hogent.be

## Vereisten

Ik verwacht dat volgende software reeds geïnstalleerd is:

- [NodeJS](https://nodejs.org)
- [Yarn](https://yarnpkg.com)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)
- ...

> Vul eventueel aan

## ERD
  ![ERD](/images/ERD.png)
- code kroki:
  
  `[Bestemming]`
  
  `*id`
  
  `land`
  
  `stad`
  
  `postcode`

  `[Reiziger]`
  
  `*id`
  
  `voornaam`
  
  `naam`
  
  `geboortedatum`
  
  `stad`

  `straat`

  `huisnummer`

  `[Vervoersmiddel]`
  
  `*id`
  
  `type`

  `[Verplaatsing]`

  `*id`

  `+vervoersmiddel_id`

  `+reiziger_id`

  `+bestemming_id`

  `Reiziger *--1 Verplaatsing`
  
  `Verplaatsing *--1 Bestemming`

  `Verplaatsing 1--* Vervoersmiddel`

## Opstarten

> Schrijf hier hoe we de applicatie starten (.env bestanden aanmaken, commando's om uit te voeren...)

- `npm install`

- `npm run dev`

- .env: 
  `DATABASE_URL="mysql://root:root@localhost:3306/vakantieDB"`
  `PORT=8000`

  `NODE_ENV=production`

  `AUTH_ISSUER='https://dev-tssp2kyfaa2lyu1y.us.auth0.com/'`

  `AUTH_AUDIENCE='https://vacay.kyana-hogent.be'`

  `AUTH_JWKS_URI='https://dev-tssp2kyfaa2lyu1y.us.auth0.com/.well-known/jwks.json'`

  `AUTH_USER_INFO="https://dev-tssp2kyfaa2lyu1y.us.auth0.com/userinfo"`

## Testen

> Schrijf hier hoe we de testen uitvoeren (.env bestanden aanmaken, commando's om uit te voeren...)
