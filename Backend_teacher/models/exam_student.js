// models/exam_student.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class ExamStudent extends Model {}

ExamStudent.init(
  {
    exam_exam_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'exam', // Assuming 'exam' is the table name for the 'exam' model
        key: 'exam_id',
      },
    },
    student_stu_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'student', // Assuming 'student' is the table name for the 'student' model
        key: 'stu_id',
      },
    },
    obtained_marks: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'ExamStudent',
    tableName: 'exam_student',
    timestamps: false,
  }
);

module.exports = ExamStudent;
