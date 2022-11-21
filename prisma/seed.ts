import { db } from "../src/utils/db.server";
import internal from "stream";

type Reiziger = {
  voornaam: string;
  naam: string;
  geboortedatum: Date;
  stad: string;
  straat: string;
  huisnummer: string;
};

type Bestemming = {
  land: string;
  stad: string;
  postcode: string;
};

type Vervoersmiddel = {
  type: string;
};

type Verplaatsing = {};



async function seed() {
  await Promise.all(
    getReizigers().map((reiziger) => {
      return db.reiziger.create({
        data: {
          voornaam: reiziger.voornaam,
          naam: reiziger.naam,
          geboortedatum: String(reiziger.geboortedatum),
          stad: reiziger.stad,
          straat: reiziger.straat,
          huisnummer: reiziger.huisnummer,
        },
      });
    })
  );
    const reiziger = await db.reiziger.findFirst({
      where: {
        voornaam: "Kyana",
      },
    });
}



function getReizigers(): Array<Reiziger> {
  return [
    {
      voornaam: "Kyana",
      naam: "Marckx",
      geboortedatum: new Date("2003-10-01"),
      stad: "Lierde",
      straat: "Keistraat",
      huisnummer: "1C",
    },
    {
      voornaam: "Robin",
      naam: "De Waegeneer",
      geboortedatum: new Date("2003-12-15"),
      stad: "Aalst",
      straat: "Hugo Lefèvrestraat",
      huisnummer: "5",
    },
    {
      voornaam: 'Greta',
      naam: 'Van der Linden',
      geboortedatum: new Date("1959-12-09"),
      stad: 'Lierde',
      straat: 'Molenstraat',
      huisnummer: '10',
    },
  ];
}

function getBestemmingen(): Array<Bestemming> {
  return [
    {
      land: "België",
      stad: "Lierde",
      postcode: "9571",
    },
    {
      land: "Spanje",
      stad: "Valencia",
      postcode: "46001",
    },
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
    {
      type: "trein",
    },
    {
      type: "vliegtuig",
    },
    {
      type: "boot",
    },
    {
      type: "bus",
    },
  ];
}

function getVerplaatsingen(): Array<Verplaatsing> {
  return [
    {
      reiziger: 1,
      bestemming: 1,
      vervoersmiddel: 1,
    },
    {
      reiziger: 2,
      bestemming: 2,
      vervoersmiddel: 2,
    },
    {
      reiziger: 3,
      bestemming: 3,
      vervoersmiddel: 3,
    },
  ];
}
