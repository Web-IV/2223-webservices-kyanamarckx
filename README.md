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
  
  `adres`

  `[Vervoersmiddel]`
  
  `*id`
  
  `type`

  `Reiziger *--1 Vervoersmiddel`
  
  `Vervoersmiddel *--1 Bestemming`

## Opstarten

> Schrijf hier hoe we de applicatie starten (.env bestanden aanmaken, commando's om uit te voeren...)

<!-- - `yarn add @koa/cors` -->


## Testen

> Schrijf hier hoe we de testen uitvoeren (.env bestanden aanmaken, commando's om uit te voeren...)
