// CREATE TABLE question_answer (
//     student_id INT,
//     exam_id INT,
//     answer_script_url TEXT
// );

// write a model for question_answer

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class QuestionAnswer extends Model { }

QuestionAnswer.init(
    {
        student_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        exam_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        answer_script_url: {
            type: DataTypes.TEXT,
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
        modelName: 'QuestionAnswer',
        tableName: 'exam_answer',
        timestamps: false,

    }

);


module.exports = QuestionAnswer;