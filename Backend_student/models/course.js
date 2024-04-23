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
            type: DataTypes.REAL,
            allowNull: false,
            defaultValue: 0,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        class: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false,
        },
       duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        num_ratings: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
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

