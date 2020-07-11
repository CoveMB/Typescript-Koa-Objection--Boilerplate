const countInstances = async (model: any): Promise<number> => {

  const dbCount = await model.query().count();

  return Number(dbCount[0].count);

};

export {
  countInstances
};
