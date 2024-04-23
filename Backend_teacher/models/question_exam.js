// models/question_exam.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class QuestionExam extends Model {}

QuestionExam.init(
  {
    question_question_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'question',
        key: 'question_id',
      },
    },
    exam_exam_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'exam',
        key: 'exam_id',
      },
    },
  },
  {
    sequelize,
    modelName: 'QuestionExam',
    tableName: 'question_exam',
    timestamps: false,
  }
);

module.exports = QuestionExam;
