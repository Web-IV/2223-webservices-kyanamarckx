import { db } from "../utils/db.server";

export type Bestemming = {
  // id: number;
  land: string;
  stad: string;
  postcode: string;
}

export const listBestemmingen = async (): Promise<Bestemming[]> => {
  return db.bestemming.findMany({
    select: {
      id: true,
      land: true,
      stad: true,
      postcode: true,
    },
  });
};

export const getBestemmingCount = async (): Promise<number> => {
  return db.bestemming.count();
};

export const getBestemmingById = async(id: number): Promise<Bestemming | null> => {
  return db.bestemming.findUnique({
    where: {
      id,
    },
    // select: {
    //   id: true,
    //   land: true,
    //   stad: true,
    //   postcode: true,
    // },
  });
};

export const createBestemming = async(bestemming: Omit<Bestemming, "id">):
Promise<Bestemming> => {
  const { land, stad, postcode } = bestemming
  return db.bestemming.create({
    data: {
      land,
      stad,
      postcode,
    },
    select: {
      id: true,
      land: true,
      stad: true,
      postcode: true,
    },
  });
};

export const updateBestemming = async(id: number, bestemming: Omit<Bestemming, "id">):
Promise<Bestemming | null> => {
  const { land, stad, postcode } = bestemming
  return db.bestemming.update({
    where: {
      id,
    },
    data: {
      land,
      stad,
      postcode,
    },
    select: {
      id: true,
      land: true,
      stad: true,
      postcode: true,
    },
  });
};

export const deleteBestemming = async(id: number): 
Promise<void> => {
  await db.bestemming.delete({
    where: {
      id,
    },
  });
};
