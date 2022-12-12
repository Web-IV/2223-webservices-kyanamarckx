import { db } from "../utils/db.server";

type Reiziger = {
  id: number;
  voornaam: string;
  naam: string;
  geboortedatum: string;
  stad: string;
  straat: string;
  huisnummer: string;
  auth0id: string;
};

export const listReizigers = async (): Promise<Reiziger[]> => {
  return db.reiziger.findMany({
    select: {
      id: true,
      voornaam: true,
      naam: true,
      geboortedatum: true,
      stad: true,
      straat: true,
      huisnummer: true,
      auth0id: true,
    },
  });
};

export const getReizigerById = async(id: number): Promise<Reiziger | null> => {
  return db.reiziger.findUnique({
    where: {
      id,
    },
    // select: {
    //   id: true,
    //   voornaam: true,
    //   naam: true,
    //   geboortedatum: true,
    //   stad: true,
    //   straat: true,
    //   huisnummer: true,
    // },
  });
};

export const createReiziger = async(reiziger: Omit<Reiziger, "id">): 
Promise<Reiziger> => {
  const { voornaam, naam, geboortedatum, stad, straat, huisnummer, auth0id } = reiziger
  return db.reiziger.create({
    data: {
      voornaam,
      naam,
      geboortedatum,
      stad,
      straat,
      huisnummer,
      auth0id,
    },
    select: {
      id: true,
      voornaam: true,
      naam: true,
      geboortedatum: true,
      stad: true,
      straat: true,
      huisnummer: true,
      auth0id: true,
    },
  });
};

export const updateReiziger = async(id: number, reiziger: Omit<Reiziger, "id">):
Promise<Reiziger> => {
  const { voornaam, naam, geboortedatum, stad, straat, huisnummer, auth0id } = reiziger
  return db.reiziger.update({
    where: {
      id,
    },
    data: {
      voornaam,
      naam,
      geboortedatum,
      stad,
      straat,
      huisnummer,
      auth0id,
    },
    select: {
      id: true,
      voornaam: true,
      naam: true,
      geboortedatum: true,
      stad: true,
      straat: true,
      huisnummer: true,
      auth0id: true
    },
  });
};

export const deleteReiziger = async (id: number): 
Promise<void> => {
  await db.reiziger.delete({
    where: {
      id,
    },
  });
};
