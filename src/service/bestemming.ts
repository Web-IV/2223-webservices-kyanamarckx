import { $log as logger } from "ts-log-debug";
import { Bestemming } from "../bestemming/bestemming.service";
import { listBestemmingen, getBestemmingById, createBestemming, updateBestemming, deleteBestemming } from "../bestemming/bestemming.service";
const bestemmingen = require('../bestemming/bestemming.service');


const debugLog = (message: string, meta = {}) => {
  logger.debug(message, meta);
}

// export const getAll = async () => {
//   debugLog('get all destinations');
//   const allbestemmingen = await bestemmingen.getAll();
//   return { allbestemmingen };
// };

// export const getById = async (id: number) => {
//   debugLog('get destination by id', { id });
//   const bestemmingbyid = await bestemmingen.getById(id);
//   return { bestemmingbyid };
// };

// export const create = async (bestemming: Bestemming) => {
//   debugLog('create destination', { bestemming });
//   const bestemmingcreated = await bestemmingen.createBestemming(bestemming);
//   return { bestemmingcreated };
// };

// export const update = async (bestemming: Omit<Bestemming, "id">, id: number) => {
//   debugLog('update destination with id ', { id, bestemming });
//   const bestemmingupdated = await bestemmingen.updateBestemming(id, bestemming);
//   return { bestemmingupdated };
// };

// export const remove = async (id: number) => {
//   debugLog('delete destination with id ', { id });
//   await bestemmingen.deleteBestemming(id);
// };

export const getAll = async () =>{
  debugLog('Getting all destinations');
  const allbestemmingen = await listBestemmingen();
  return { allbestemmingen };
};

export const getById = async (id: number) => {
  debugLog('Getting destination by id', { id });
  const bestemmingbyid = await bestemmingen.getBestemmingById(id);
  return { bestemmingbyid };
};

export const create = async (bestemming: Bestemming) => {
  debugLog('Creating destination', { bestemming });
  const bestemmingcreated = await bestemmingen.createBestemming(bestemming);
  return { bestemmingcreated };
};

export const update = async (id: number, bestemming: Omit<Bestemming, "id">) => {
  debugLog('Updating destination with id ', { id, bestemming });
  const bestemmingupdated = await bestemmingen.updateBestemming(id, bestemming);
  return { bestemmingupdated };
};

export const remove = async (id: number) => {
  debugLog('Deleting destination with id ', { id });
  await deleteBestemming(id);
};
