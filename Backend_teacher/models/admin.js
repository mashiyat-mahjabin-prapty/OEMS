//models/teacher.js
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database'); // Import your database connection here

class Admin extends Model {
    async comparePassword(password) {
        return await bcrypt.compare(password, this.password);
    }
}

Admin.init(
    {
        admin_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
    },
    {
        sequelize,
        modelName: 'Admin',
        tableName: 'admin',
        timestamps: false,
        hooks: {
            beforeCreate: async (admin) => {
                const hashedPassword = await bcrypt.hash(admin.password, 10);
                admin.password = hashedPassword;
            }
        }
    }
);

module.exports = Admin;