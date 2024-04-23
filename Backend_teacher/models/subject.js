// models/exam.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Subject extends Model {}

Subject.init(
  {
    subject_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
    },
  },
  {
    sequelize,
    modelName: 'Subject',
    tableName: 'subject',
    timestamps: false,
  }
);

module.exports = Subject;
