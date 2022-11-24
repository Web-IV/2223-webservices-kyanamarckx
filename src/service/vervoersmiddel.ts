import { Vervoersmiddel } from "@prisma/client";
import { $log as logger } from "ts-log-debug";
import { createVervoersmiddel, deleteVervoersmiddel, getVervoersmiddelById, listVervoersmiddelen, updateVervoersmiddel } from "../vervoersmiddel/vervoersmiddel.service";

const debugLog = (message: string, meta = {}) => {
  logger.debug(message, meta);
}

export const getAll = async () => {
  debugLog('Getting all transports');
  const allvervoersmiddelen = await listVervoersmiddelen();
  return { allvervoersmiddelen };
};

export const getById = async (id: number) => {
  debugLog('Getting transport by id', { id });
  const vervoersmiddelbyid = await getVervoersmiddelById(id);
  return { vervoersmiddelbyid };
};

export const create = async (vervoersmiddel: Vervoersmiddel) => {
  debugLog('create transport', { vervoersmiddel });
  const vervoersmiddelcreated = await createVervoersmiddel(vervoersmiddel);
  return { vervoersmiddelcreated };
};

export const update = async (id: number, vervoersmiddel: Vervoersmiddel) => {
  debugLog('update transport with id ', { id, vervoersmiddel });
  const vervoersmiddelupdated = await updateVervoersmiddel(id, vervoersmiddel);
  return { vervoersmiddelupdated };
};

export const remove = async (id: number) => {
  debugLog('delete transport with id ', { id });
  await deleteVervoersmiddel(id);
};
