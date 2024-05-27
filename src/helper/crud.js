// import mongoose from "mongoose";
// import "../models/schemaRegister.js";
const mongoose =require("mongoose");
const user =require("../model/user")
const deleteQuery = async (modelName, condition, queryType = "default") => {
  try {
    const groupModel = mongoose.model(modelName);
    let deleteData;
    switch (queryType) {
      case "deleteOne":
        deleteData = await groupModel.deleteOne(condition);
        break;
      default:
        deleteData = await groupModel.deleteMany(condition);
        break;
    }
    return deleteData;
  } catch (error) {
    console.error(error);
  }
};

const insertQuery = async (modelName, data, queryType = "default") => {
  try {
    const groupModel = mongoose.model(modelName);
    let insert;
    switch (queryType) {
      case "insertMany":
        insert = await groupModel.insertMany(data);
        break;
      default:
        insert = await groupModel.create(data);
        break;
    }
    return insert;
  } catch (error) {
    console.error(error);
  }
};

const distinctQuery = async (modelName, distinctName, where) => {
  try {
    const groupModel = mongoose.model(modelName);
    const distinctData = await groupModel.distinct(distinctName, where);
    return distinctData;
  } catch (error) {
    console.error(error);
  }
};

const findAll = async (
  modelName,
  where = {},
  select = {},
  populationFields = [],
  sort = {},
  limit = 0,
  skip = 0
) => {
  try {
    const groupModel = mongoose.model(modelName);
    return await groupModel
      .find(where, select)
      .populate(populationFields)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .lean();
  } catch (error) {
    console.error(error);
  }
};

module.exports.findOne = async (modelName,
  where = {},
  select = {},
  populationFields = [],
  sort = {},
  limit = 0,
  skip = 0,) => {
  try {
    const groupModel = mongoose.model(modelName);
    return await groupModel
      .findOne(where, select)
      .populate(populationFields)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .lean();
  } catch (error) {
    console.error(error);
  }
};

const update = async (modelName, where, updateData, queryType) => {
  try {
    const groupModel = mongoose.model(modelName);
    let update;
    switch (queryType) {
      case "updateOne":
        update = await groupModel.updateOne(where, updateData, { new: true });  
        break;
      case "updateMany":
        update = await groupModel.updateMany(where, updateData, { new: true });
        break;
      default:
        update = await groupModel.findOneAndUpdate(where, updateData, {
          upsert: true,
          new: true,
        });
        break;
    }
    return update;
  } catch (error) {
    console.error(error);
  }
};

const countRecords = async (modelName, condition = {}) => {
  try {
    const groupModel = mongoose.model(modelName);
    return await groupModel.countDocuments(condition);
  } catch (error) {
    console.error(error);
  }
};

const findRaw = async (modelName, where = {}) => {
  try {
    return await mongoose.collection(modelName).find(where.condition).toArray();
  } catch (error) {
    console.error(error);
  }
};

const findDistinct = async (modelName, distinctKey, where = {}) => {
  try {
    return await mongoose.model(modelName).distinct(distinctKey, where);
  } catch (error) {
    console.error(error);
  }
};

const groupBy = async (modelName, where = {}, groupData = {}) => {
  try {
    const groupModel = mongoose.model(modelName);
    const data1 = await groupModel.aggregate([
      {
        $match: where,
      },
      {
        $group: groupData,
      },
    ]);
    return data1;
  } catch (error) {
    console.error(error);
  }
};

const projectAggregate = async (modelName, lookup, project = {}, match = {}) => {
  try {
    const groupModel = mongoose.model(modelName);
    const data = await groupModel.aggregate([
      { $lookup: lookup},
      { $match: match },
      // { $project: project },
    ]);
    return data;
  } catch (error) {
    console.error(error);
  }
};

module.export= {
  deleteQuery,
  insertQuery,
  findAll,
  findOne,
  update,
  countRecords,
  findRaw,
  findDistinct,
  groupBy,
  projectAggregate,
  distinctQuery,
};