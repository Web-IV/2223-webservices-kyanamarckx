import { Verplaatsing } from "@prisma/client";
import { $log as logger } from "ts-log-debug";
import { listVerplaatsingen, getVerplaatsingById, createVerplaatsing, updateVerplaatsing, deleteVerplaatsing } from "../verplaatsing/verplaatsing.service";

const debugLog = (message: string, meta = {}) => {
  logger.debug(message, meta);
}

export const getAll = async () => {
  debugLog('Getting all movements');
  const allverplaatsingen = await listVerplaatsingen();
  return { allverplaatsingen };
};

export const getById = async (id: number) => {
  debugLog('Getting movement by id', { id });
  const verplaatsingbyid = await getVerplaatsingById(id);
  return { verplaatsingbyid };
};

export const create = async (verplaatsing: Verplaatsing) => {
  debugLog('Creating movement', { verplaatsing });
  const verplaatsingcreated = await createVerplaatsing(verplaatsing);
  return { verplaatsingcreated };
};

export const update = async (id: number, verplaatsing: Verplaatsing) => {
  debugLog('Updating movement with id ', { id, verplaatsing });
  const verplaatsingupdated = await updateVerplaatsing(id, verplaatsing);
  return { verplaatsingupdated };
};

export const remove = async (id: number) => {
  debugLog('Deleting movement with id ', { id });
  await deleteVerplaatsing(id);
};
