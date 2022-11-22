import { db } from "../utils/db.server";

type Vervoersmiddel = {
  id: number;
  type: string;
}

export const listVervoersmiddelen = async (): Promise<Vervoersmiddel[]> => {
  return db.vervoersmiddel.findMany({
    select: {
      id: true,
      type: true,
    },
  });
};

export const getVervoersmiddelById = async(id: number): Promise<Vervoersmiddel | null> => {
  return db.vervoersmiddel.findUnique({
    where: {
      id,
    },
    // select: {
    //   id: true,
    //   type: true,
    // },
  });
};

export const createVervoersmiddel = async(vervoersmiddel: Omit<Vervoersmiddel, "id">):
Promise<Vervoersmiddel> => {
  const { type } = vervoersmiddel
  return db.vervoersmiddel.create({
    data: {
      type,
    },
    select: {
      id: true,
      type: true,
    },
  });
};

export const updateVervoersmiddel = async(vervoersmiddel: Omit<Vervoersmiddel, "id">, id: number):
Promise<Vervoersmiddel | null> => {
  const { type } = vervoersmiddel
  return db.vervoersmiddel.update({
    where: {
      id,
    },
    data: {
      type,
    },
    select: {
      id: true,
      type: true,
    },
  });
};

export const deleteVervoersmiddel = async(id: number): 
Promise<void> => {
  await db.vervoersmiddel.delete({
    where: {
      id,
    },
  });
};

