import { Reiziger } from "@prisma/client";
import { $log as logger } from "ts-log-debug";
import { createReiziger, deleteReiziger, getReizigerById, listReizigers, updateReiziger } from "../reiziger/reiziger.service";

const reizigers = require('./reiziger/reiziger.service');

//TODO nog aanpassen

const debugLog = (message: string, meta = {}) => {
  logger.debug(message, meta);
}

export const getAll = async () => {
  debugLog('Getting all travellers');
  const allreizigers = await listReizigers();
  return { allreizigers };
};

export const getById = async (id: number) => {
  debugLog('Getting traveller by id', { id });
  const reizigerbyid = await getReizigerById(id);
  return { reizigerbyid };
}

export const create = async (reiziger: Reiziger) => {
  debugLog('Creating traveller', { reiziger });
  const reizigercreated = await createReiziger(reiziger);
  return { reizigercreated };
}

export const update = async (id: number, reiziger: Omit<Reiziger, "id">) => {
  debugLog('Updating traveller with id ', { id, reiziger });
  const reizigerupdated = await updateReiziger(id, reiziger);
  return { reizigerupdated };
}

export const remove = async (id: number) => {
  debugLog('Deleting traveller with id ', { id });
  await deleteReiziger(id);
}
