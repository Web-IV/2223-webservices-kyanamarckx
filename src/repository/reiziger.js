const { tables, getKnex } = require('../data');
const { getLogger } = require('../core/logging');

const findAll = () => {
  return getKnex()(tables.reiziger).select().orderBy('naam', 'ASC');
};

const findCount = async () => {
  const [count] = await getKnex()(tables.reiziger).count();
  return count['count(*)'];
};

const findById = (id) => {
  return getKnex()(tables.reiziger).where('id', id).first();
};

const create = async ({ voornaam, naam, geboortedatum, adres }) => {
  try {
    const [id] = await getKnex()(tables.reiziger).insert({ voornaam, naam, geboortedatum, adres });
    return id;
  } catch(error) {
    const logger = getLogger();
    logger.error('Error in create', { error, });
    throw error;
  }
};

const updateById = async (id, { voornaam, naam, geboortedatum, adres }) => {
  try {
    await getKnex()(tables.reiziger).update({ voornaam, naam, geboortedatum, adres }).where('id', id);
    return id;
  } catch(error) {
    const logger = getLogger();
    logger.error('Error in updateById', { error, });
    throw error;
  }
};

const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.reiziger).delete().where('id', id);
    return rowsAffected > 0;
  } catch(error) {
    const logger = getLogger();
    logger.error('Error in deleteById', { error, });
    throw error;
  }
};

module.exports = {
  findAll, findCount, findById, create, updateById, deleteById,
};