const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Student = require('./student');
const Course = require('./course');


class StudentCourse extends Model { }

StudentCourse.init(
    {
        student_stu_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,

            references: {
                model: Student,
                key: 'stu_id'
            },
        },
        course_course_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            
            references: {
                model: Course,
                key: 'course_id'
            },
        },
        rating: {
            type: DataTypes.DOUBLE,
            
        },
    },
    {
        sequelize,
        modelName: 'StudentCourse',
        tableName: 'student_course',
        timestamps: false,
    }
);

module.exports = StudentCourse;


