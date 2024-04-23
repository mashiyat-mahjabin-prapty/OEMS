// models/student_course.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class CourseTeacher extends Model {}

CourseTeacher.init(
  {
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'teacher', // Assuming 'exam' is the table name for the 'exam' model
        key: 'teacher_id',
      },
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'course',
        key: 'course_id',
      },
    },
  },
  {
    sequelize,
    modelName: 'CourseTeacher',
    tableName: 'course_teacher',
    timestamps: false,
  }
);

module.exports = CourseTeacher;
