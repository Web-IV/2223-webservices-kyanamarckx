import { $log as logger } from "ts-log-debug";
const bestemming = require('./bestemming/bestemming.service');

const debugLog = (message: string, meta = {}) => {
  logger.debug(message, meta);
}

export const getAll = async () => {
  debugLog('get all destinations');
  const allbestemmingen = await bestemming.getAll();
  return { allbestemmingen };
};

export const getById = async (id: number) => {
  debugLog('get destination by id', { id });
  const bestemmingbyid = await bestemming.getById(id);
  return { bestemmingbyid };
};

export const create = async (bestemming: any) => {
  debugLog('create destination', { bestemming });
  const bestemmingcreated = await bestemming.create(bestemming);
  return { bestemmingcreated };
};

export const update = async (id: number, bestemming: any) => {
  debugLog('update destination with id ', { id, bestemming });
  const bestemmingupdated = await bestemming.update(id, bestemming);
  return { bestemmingupdated };
};

export const remove = async (id: number) => {
  debugLog('delete destination with id ', { id });
  await bestemming.remove(id);
};
