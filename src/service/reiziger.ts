import { $log as logger } from "ts-log-debug";
const reiziger = require('./reiziger/reiziger.service');

const debugLog = (message: string, meta = {}) => {
  logger.debug(message, meta);
}

export const getAll = async () => {
  debugLog('get all travellers');
  const allreizigers = await reiziger.getAll();
  return { allreizigers };
};

export const getById = async (id: number) => {
  debugLog('get traveller by id', { id });
  const reizigerbyid = await reiziger.getById(id);
  return { reizigerbyid };
}

export const create = async (reiziger: any) => {
  debugLog('create traveller', { reiziger });
  const reizigercreated = await reiziger.create(reiziger);
  return { reizigercreated };
}

export const update = async (id: number, reiziger: any) => {
  debugLog('update traveller with id ', { id, reiziger });
  const reizigerupdated = await reiziger.update(id, reiziger);
  return { reizigerupdated };
}

export const remove = async (id: number) => {
  debugLog('delete traveller with id ', { id });
  await reiziger.remove(id);
}
