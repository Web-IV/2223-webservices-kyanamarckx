import { db } from "../src/utils/db.server";

type Reiziger = {
  voornaam: string;
  naam: string;
  geboortedatum: string;
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
        },
      });
    })
  );
  const reiziger = await db.reiziger.findFirst({
    where: {
      voornaam: "Kyana",
    },
  });

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
  const bestemming = await db.bestemming.findFirst({
    where: {
      land: "Frankrijk",
    },
  });

  await Promise.all(
    getVervoersmiddelen().map((vervoersmiddel) => {
      return db.vervoersmiddel.create({
        data: {
          type: vervoersmiddel.type,
        },
      });
    })
  );
  const vervoersmiddel = await db.vervoersmiddel.findFirst({
    where: {
      type: "boot",
    },
  });

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
  const verplaatsing = await db.verplaatsing.findFirst({
    where: {
      reiziger_id: 1,
    },
  });
}

seed();



function getReizigers(): Array<Reiziger> {
  return [
    {
      voornaam: "Kyana",
      naam: "Marckx",
      geboortedatum: "2003-10-01",
      stad: "Lierde",
      straat: "Keistraat",
      huisnummer: "1C",
    },
    {
      voornaam: "Robin",
      naam: "De Waegeneer",
      geboortedatum: "2003-12-15",
      stad: "Aalst",
      straat: "Hugo Lefèvrestraat",
      huisnummer: "5",
    },
    {
      voornaam: 'Greta',
      naam: 'Van der Linden',
      geboortedatum: "1959-12-09",
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
      reiziger_id: 1,
      bestemming_id: 1,
      vervoersmiddel_id: 1,
    },
    {
      reiziger_id: 2,
      bestemming_id: 2,
      vervoersmiddel_id: 2,
    },
    {
      reiziger_id: 3,
      bestemming_id: 3,
      vervoersmiddel_id: 3,
    },
  ];
}
