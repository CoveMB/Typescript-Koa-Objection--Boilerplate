const countInstances = async model => {

  const dbCount = await model.query().count();

  return Number(dbCount[0].count);

};

module.exports = {
  countInstances
};
