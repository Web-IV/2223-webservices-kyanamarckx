import { db } from "../src/utils/db.server";

type Reiziger = {
  voornaam: string;
  naam: string;
  geboortedatum: string;
  stad: string;
  straat: string;
  huisnummer: string;
  auth0id: string;
};

type Bestemming = {
  land: string;
  stad: string;
  postcode: string;
};

type Vervoersmiddel = {
  type: string;
};

type Verplaatsing = {
  reiziger_id: number;
  bestemming_id: number;
  vervoersmiddel_id: number;
};



export async function seed() {
  await Promise.all(
    getReizigers().map((reiziger) => {
      return db.reiziger.create({
        data: {
          voornaam: reiziger.voornaam,
          naam: reiziger.naam,
          geboortedatum: reiziger.geboortedatum,
          stad: reiziger.stad,
          straat: reiziger.straat,
          huisnummer: reiziger.huisnummer,
          auth0id: reiziger.auth0id,
        },
      });
    })
  );

  await Promise.all(
    getBestemmingen().map((bestemming) => {
      return db.bestemming.create({
        data: {
          land: bestemming.land,
          stad: bestemming.stad,
          postcode: bestemming.postcode,
        },
      });
    })
  );

  await Promise.all(
    getVervoersmiddelen().map((vervoersmiddel) => {
      return db.vervoersmiddel.create({
        data: {
          type: vervoersmiddel.type,
        },
      });
    })
  );

  await Promise.all(
    getVerplaatsingen().map((verplaatsing) => {
      return db.verplaatsing.create({
        data: {
          reiziger_id: verplaatsing.reiziger_id,
          bestemming_id: verplaatsing.bestemming_id,
          vervoersmiddel_id: verplaatsing.vervoersmiddel_id,
        },
      });
    })
  );
}

seed();



function getReizigers(): Array<Reiziger> {
  return [
    {
      voornaam: "Robin",
      naam: "De Waegeneer",
      geboortedatum: "2003-12-15",
      stad: "Aalst",
      straat: "Hugo Lefèvrestraat",
      huisnummer: "5",
      auth0id: "sJUibowqneIEBIvxyeLQd869uivdTHuP@clients",
    },
  ];
}

function getBestemmingen(): Array<Bestemming> {
  return [
    {
      land: "Frankrijk",
      stad: "Cotignac",
      postcode: "83570",
    },
  ];
}

function getVervoersmiddelen(): Array<Vervoersmiddel> {
  return [
    {
      type: "auto",
    },
  ];
}

function getVerplaatsingen(): Array<Verplaatsing> {
  return [
    {
      reiziger_id: 1,
      bestemming_id: 1,
      vervoersmiddel_id: 1,
    },
  ];
}
