//models/teacher.js
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database'); // Import your database connection here

class Teacher extends Model {
    async comparePassword(password) {
        return await bcrypt.compare(password, this.password);
    }
}

Teacher.init(
    {
        teacher_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        educational_qualification: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rating: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        date_of_birth: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        address: { 
            type: DataTypes.STRING,
            allowNull: false,
        },
        contact_number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        expertise: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Teacher',
        tableName: 'teacher',
        timestamps: false,
        hooks: {
            beforeCreate: async (teacher) => {
                const hashedPassword = await bcrypt.hash(teacher.password, 10);
                teacher.password = hashedPassword;
            }
        }
    }
);

module.exports = Teacher;