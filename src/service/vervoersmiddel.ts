import { $log as logger } from "ts-log-debug";
const vervoersmiddel = require('./vervoersmiddel/vervoersmiddel.service');

const debugLog = (message: string, meta = {}) => {
  logger.debug(message, meta);
}

export const getAll = async () => {
  debugLog('get all transport');
  const allvervoersmiddelen = await vervoersmiddel.getAll();
  return { allvervoersmiddelen };
};

export const getById = async (id: number) => {
  debugLog('get transport by id', { id });
  const vervoersmiddelbyid = await vervoersmiddel.getById(id);
  return { vervoersmiddelbyid };
};

export const create = async (vervoersmiddel: any) => {
  debugLog('create transport', { vervoersmiddel });
  const vervoersmiddelcreated = await vervoersmiddel.create(vervoersmiddel);
  return { vervoersmiddelcreated };
};

export const update = async (id: number, vervoersmiddel: any) => {
  debugLog('update transport with id ', { id, vervoersmiddel });
  const vervoersmiddelupdated = await vervoersmiddel.update(id, vervoersmiddel);
  return { vervoersmiddelupdated };
};

export const remove = async (id: number) => {
  debugLog('delete transport with id ', { id });
  await vervoersmiddel.remove(id);
};
