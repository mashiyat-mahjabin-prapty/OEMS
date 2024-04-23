// models/exam.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Course extends Model {}

Course.init(
  {
    course_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0.0,
    },
    name: {
      type: DataTypes.STRING(1024),
      allowNull: false,
    },
    class: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subject: {
        type: DataTypes.STRING(100),
        allowNull: false,

        references: {
            model: 'subject',
            key: 'name'
        },
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,      
    },
  },
  {
    sequelize,
    modelName: 'Course',
    tableName: 'course',
    timestamps: false,
  }
);

module.exports = Course;
