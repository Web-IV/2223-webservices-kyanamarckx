const { tables, getKnex } = require('../data/index');
const { getLogger } = require('../core/logging');

const SELECT_COLUMNS = [
  `${tables.verplaatsing}.id`, 'vervoersmiddelId', 'reizigerId', 'bestemmingId',
  `${tables.bestemming}.id as bestemming_id`, `${tables.bestemming}.land as bestemming_land`,
  `${tables.reiziger}.id as reiziger_id`, `${tables.reiziger}.naam as reiziger_naam`,
  `${tables.vervoersmiddel}.id as vervoersmiddel_id`, `${tables.vervoersmiddel}.type as vervoersmiddel_type`,
];

// TODO is het hier de bedoeling dat alles van de entiteiten erin staan of enkel id en 1 iets anders?

const formatVerplaatsing = ({ bestemming_id, bestemming_land, reiziger_id, reiziger_naam, vervoersmiddel_id, voervoersmiddel_type, ...rest }) => ({
  ...rest,
  bestemming: {
    id: bestemming_id,
    land: bestemming_land,
  },
  reiziger: {
    id: reiziger_id,
    naam: reiziger_naam,
  },
  vervoersmiddel: {
    id: vervoersmiddel_id,
    type: voervoersmiddel_type,
  },
});


const findAll = async () => {
  const verplaatsingen = await getKnex()(tables.verplaatsing).select(SELECT_COLUMNS)
  .join(tables.bestemming, `${tables.verplaatsing}.bestemming_id`, '=', `${tables.bestemming}.id`)
  .join(tables.reiziger, `${tables.verplaatsing}.reiziger_id`, '=', `${tables.reiziger}.id`)
  .join(tables.vervoersmiddel, `${tables.verplaatsing}.vervoersmiddel_id`, '=', `${tables.vervoersmiddel}.id`)
  .orderBy('date', 'ASC');
  return verplaatsingen.map(formatVerplaatsing);
};

const findCount = async () => {
  const [count] = await getKnex()(tables.verplaatsing).count();
  return count['count(*)'];
};

const findById = async (id) => {
  const verplaatsing = await getKnex()(tables.verplaatsing)
    .first(SELECT_COLUMNS)
    .where(`${tables.verplaatsing}.id`, id)
    .join(tables.bestemming, `${tables.verplaatsing}.bestemming_id`, '=', `${tables.bestemming}.id`)
    .join(tables.reiziger, `${tables.verplaatsing}.reiziger_id`, '=', `${tables.reiziger}.id`)
    .join(tables.vervoersmiddel, `${tables.verplaatsing}.vervoersmiddel_id`, '=', `${tables.vervoersmiddel}.id`)
  return verplaatsing && formatTransaction(verplaatsing);
};

const create = async ({ bestemmingId, reizigerId, vervoersmiddelId, }) => {
  try {
    const [id] = await getKnex()(tables.verplaatsing).insert({ bestemming_id: bestemmingId, reiziger_id: reizigerId, vervoersmiddel_id: vervoersmiddelId, });
    return id;
  } catch (error) {
    const logger = getLogger();
    logger.error('Error in create', { error, });
    throw error;
  }
};

const updateById = async (id, { bestemmingId, reizigerId, vervoersmiddelId }) => {
  try {
    await getKnex()(tables.verplaatsing).update({ bestemming_id: bestemmingId, reiziger_id: reizigerId, vervoersmiddel_id: vervoersmiddelId }).where(`${tables.verplaatsing}.id`, id);
    return id;
  } catch (error) {
    const logger = getLogger();
    logger.error('Error in updateById', { error, });
    throw error;
  }
};

const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.verplaatsing).delete().where(`${tables.verplaatsing}.id`, id);
    return rowsAffected > 0;
  } catch (error) {
    const logger = getLogger();
    logger.error('Error in deleteById', { error, });
    throw error;
  }
};

module.exports = { findAll, findCount, findById, create, updateById, deleteById };