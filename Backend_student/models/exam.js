// models/exam.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Exam extends Model { }

Exam.init(
  {
    exam_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    total_marks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    name: {
      type: DataTypes.STRING(100),
    },
    duration: {
      type: DataTypes.INTEGER,
    },
    course_course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references: {
        model: 'course',
        key: 'course_id',

      },
    },
    exam_type: {
      type: DataTypes.STRING(100),
    },
  },
  {
    sequelize,
    modelName: 'Exam',
    tableName: 'exam',
    timestamps: false,
  }
);

module.exports = Exam;
