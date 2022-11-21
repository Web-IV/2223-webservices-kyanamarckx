let BESTEMMINGEN = [
  {
    id: 1,
    land: 'België',
    stad: 'Gent',
    postcode: 9000,
  },
  {
    id: 2,
    land: 'Frankrijk',
    stad: 'Cotignac',
    postcode: 83570,
  },
  {
    id: 3,
    land: 'Spanje',
    stad: 'Valencia',
    postcode: 46001,
  },
  {
    id: 4,
    land: 'Griekenland',
    stad: 'Santorini',
    postcode: 84700,
  },
  {
    id: 5,
    land: 'Frankrijk',
    stad: 'Bora Bora',
    postcode: 98730,
  },
];

let VERVOERSMIDDELEN = [
  {
    id: 1,
    type: 'auto',
  },
  {
    id: 2,
    type: 'trein',
  },
  {
    id: 3,
    type: 'vliegtuig',
  },
  {
    id: 4,
    type: 'boot',
  },
  {
    id: 5,
    type: 'bus',
  },
];

let REIZIGERS = [
  {
    id: 1,
    voornaam: 'Kyana',
    naam: 'Marckx',
    geboortedatum: '2003-10-01',
    stad: 'Lierde',
    straat: 'Keistraat',
    huisnummer: '1C',
  },
  {
    id: 2,
    voornaam: 'Robin',
    naam: 'De Waegeneer',
    geboortedatum: '2003-12-15',
    stad: 'Aalst',
    straat: 'Hugo Lefèvrestraat',
    huisnummer: '5',
  },
  {
    id: 3,
    voornaam: 'Greta',
    naam: 'Van der Linden',
    geboortedatum: '1959-12-09',
    stad: 'Lierde',
    straat: 'Molenstraat',
    huisnummer: '10',
  },
  {
    id: 4,
    voornaam: 'Tine',
    naam: 'Van Voren',
    geboortedatum: '2004-10-25',
    stad: 'Bever',
    straat: 'Akrenbos',
    huisnummer: '51A',
  },
  {
    id: 5,
    voornaam: 'Lorenz',
    naam: 'Coppens',
    geboortedatum: '1992-07-30',
    stad: 'Gent',
    straat: 'Keramiekstraat',
    huisnummer: '80',
  },
];

let VERPLAATSINGEN = [
  {
    id: 1,
    vervoersmiddelId: 3,
    reizigerId: 2,
    bestemmingId: 4,
  },
  {
    id: 2,
    vervoersmiddelId: 1,
    reizigerId: 3,
    bestemmingId: 2,
  },
  {
    id: 3,
    vervoersmiddelId: 2,
    reizigerId: 4,
    bestemmingId: 1,
  },
  {
    id: 4,
    vervoersmiddelId: 5,
    reizigerId: 1,
    bestemmingId: 3,
  },
  {
    id: 5,
    vervoersmiddelId: 4,
    reizigerId: 5,
    bestemmingId: 5,
  },
];

