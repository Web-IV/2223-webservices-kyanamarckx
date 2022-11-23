import { $log as logger } from "ts-log-debug";
const verplaatsing = require('./verplaatsing/verplaatsing.service');

const debugLog = (message: string, meta = {}) => {
  logger.debug(message, meta);
}

export const getAll = async () => {
  debugLog('get all movements');
  const allverplaatsingen = await verplaatsing.getAll();
  return { allverplaatsingen };
};

export const getById = async (id: number) => {
  debugLog('get movement by id', { id });
  const verplaatsingbyid = await verplaatsing.getById(id);
  return { verplaatsingbyid };
};

export const create = async (verplaatsing: any) => {
  debugLog('create movement', { verplaatsing });
  const verplaatsingcreated = await verplaatsing.create(verplaatsing);
  return { verplaatsingcreated };
};

export const update = async (id: number, verplaatsing: any) => {
  debugLog('update movement with id ', { id, verplaatsing });
  const verplaatsingupdated = await verplaatsing.update(id, verplaatsing);
  return { verplaatsingupdated };
};

export const remove = async (id: number) => {
  debugLog('delete movement with id ', { id });
  await verplaatsing.remove(id);
};
