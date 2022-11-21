const { tables, getKnex } = require('../data/index');
const { getLogger } = require('../core/logging');

const findAll = () => {
  return getKnex()(tables.bestemming).select().orderBy('land', 'ASC');
};

const findByLand = (land) => {
  return getKnex()(tables.bestemming).where('land', land).first();
};

const findById = (id) => {
  return getKnex()(tables.bestemming).where('id', id).first();
};

const findCount = async () => {
  const [count] = await getKnex()(tables.bestemming).count();
  return count['count(*)'];
}

const create = async ({ land, stad, postcode, }) => {
  try {
    const [id] = await getKnex()(tables.bestemming).insert({ land, stad, postcode, });
    return id;
  } catch (error) {
    const logger = getLogger();
    logger.error('Error in create', { error, });
    throw error;
  }
};

const updateById = async (id, { land, stad, postcode, }) => {
  try {
    await getKnex()(tables.bestemming).update({ land, stad, postcode, }).where('id', id);
    return id
  } catch (error) {
    const logger = getLogger();
    logger.error('Error in updateById', { error, });
    throw error;
  }
};

const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.bestemming).delete().where('id', id);
    return rowsAffected > 0;
  } catch (error) {
    const logger = getLogger();
    logger.error('Error in deleteById', { error, });
    throw error;
  }
};

module.exports = { findAll, findByLand, findById, findCount, create, updateById, deleteById };