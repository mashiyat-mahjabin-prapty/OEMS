// models/student_course.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class CourseStudent extends Model {}

CourseStudent.init(
  {
    student_stu_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'student', // Assuming 'exam' is the table name for the 'exam' model
        key: 'stu_id',
      },
    },
    course_course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'course', // Assuming 'student' is the table name for the 'student' model
        key: 'course_id',
      },
    },
    rating: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0.0,
    },
  },
  {
    sequelize,
    modelName: 'CourseStudent',
    tableName: 'student_course',
    timestamps: false,
  }
);

module.exports = CourseStudent;
