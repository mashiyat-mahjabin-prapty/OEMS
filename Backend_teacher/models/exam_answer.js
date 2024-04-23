// models/exam_student.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class ExamAnswer extends Model {}

ExamAnswer.init(
  {
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'student', // Assuming 'student' is the table name for the 'student' model
          key: 'stu_id',
        },
      },
    exam_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'exam', // Assuming 'exam' is the table name for the 'exam' model
        key: 'exam_id',
      },
    },
    answer_script_url: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isChecked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'ExamAnswer',
    tableName: 'exam_answer',
    timestamps: false,
  }
);

module.exports = ExamAnswer;
