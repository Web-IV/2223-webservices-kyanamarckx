import { db } from "../utils/db.server";

type Verplaatsing = {
  id: number;
  reiziger_id: number;
  bestemming_id: number;
  vervoersmiddel_id: number;
}

export const listVerplaatsingen = async (): Promise<Verplaatsing[]> => {
  return db.verplaatsing.findMany({
    select: {
      id: true,
      reiziger_id: true,
      bestemming_id: true,
      vervoersmiddel_id: true,
    },
  });
};

export const getVerplaatsingById = async(id: number): Promise<Verplaatsing | null> => {
  return db.verplaatsing.findUnique({
    where: {
      id,
    },
    // select: {
    //   id: true,
    //   reiziger_id: true,
    //   bestemming_id: true,
    //   vervoersmiddel_id: true,
    // },
  });
};

export const createVerplaatsing = async(verplaatsing: Omit<Verplaatsing, "id">):
Promise<Verplaatsing> => {
  const { reiziger_id, bestemming_id, vervoersmiddel_id } = verplaatsing
  return db.verplaatsing.create({
    data: {
      reiziger_id,
      bestemming_id,
      vervoersmiddel_id,
    },
    select: {
      id: true,
      reiziger_id: true,
      bestemming_id: true,
      vervoersmiddel_id: true,
    },
  });
};

export const updateVerplaatsing = async(id: number, verplaatsing: Omit<Verplaatsing, "id">):
Promise<Verplaatsing | null> => {
  const { reiziger_id, bestemming_id, vervoersmiddel_id } = verplaatsing
  return db.verplaatsing.update({
    where: {
      id,
    },
    data: {
      reiziger_id,
      bestemming_id,
      vervoersmiddel_id,
    },
    select: {
      id: true,
      reiziger_id: true,
      bestemming_id: true,
      vervoersmiddel_id: true,
    },
  });
};

export const deleteVerplaatsing = async(id: number): 
Promise<void> => {
  await db.verplaatsing.delete({
    where: {
      id,
    },
  });
};
