const { tables, getKnex } = require('../data');
const { getLogger } = require('../core/logging');

const findAll = () => {
  return getKnex()(tables.vervoersmiddel).select().orderBy('type', 'ASC');
};

const findCount = async () => {
  const [count] = await getKnex()(tables.vervoersmiddel).count();
  return count['count(*)'];
};

const findById = (id) => {
  return getKnex()(tables.vervoersmiddel).where('id', id).first();
};

const create = async ({ type }) => {
  try {
    const [id] = await getKnex()(tables.vervoersmiddel).insert({ type });
    return id;
  } catch(error) {
    const logger = getLogger();
    logger.error('Error in create', { error, });
    throw error;
  }
};

const updateById = async (id, { type }) => {
  try {
    await getKnex()(tables.vervoersmiddel).update({ type }).where('id', id);
    return id;
  } catch(error) {
    const logger = getLogger();
    logger.error('Error in updateById', { error, });
    throw error;
  }
};

const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.vervoersmiddel).delete().where('id', id);
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