// models/question.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Question extends Model {}

Question.init(
  {
    question_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    question_stmt: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    option1: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    option2: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    option3: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    option4: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    difficulty: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    marks: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Question',
    tableName: 'question',
    timestamps: false,
  }
);

module.exports = Question;
